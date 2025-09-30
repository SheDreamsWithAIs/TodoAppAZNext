from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List as TypeList  # Explicit import to avoid confusion
from bson import ObjectId
import os
from pymongo import MongoClient

# Import schemas 🐉
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut

# 🐉 Tasks router - the dragons are watching!
router = APIRouter(tags=["tasks"])

# MongoDB connection 🐉
MONGO_URI = os.getenv("MONGO_URI")
print(f"🐉 Tasks router - MONGO_URI from environment: {'Found' if MONGO_URI else 'Not found'}")

if not MONGO_URI:
    print("🐉 Warning: MONGO_URI not found in environment variables!")
    raise Exception("MONGO_URI environment variable is required but not found. Please check your .env file.")

def serialize_task(task_doc: dict) -> TaskOut:
    """Helper to convert MongoDB document to TaskOut model"""
    return TaskOut(
        id=str(task_doc["_id"]),
        title=task_doc["title"],
        description=task_doc.get("description"),
        priority=task_doc["priority"],
        deadline=task_doc["deadline"].date() if isinstance(task_doc["deadline"], datetime) else task_doc["deadline"],
        completed=task_doc["completed"],
        label_ids=task_doc.get("label_ids", []),
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"]
    )

# Routes 🐉
@router.post("/", response_model=TaskOut, status_code=201)
async def create_task(task: TaskCreate):
    """Create a new task"""
    try:
        now = datetime.utcnow()
        print(f"🐉 Received task with deadline: {task.deadline} (type: {type(task.deadline)})")  # Debug log
        
        # Convert date to datetime for MongoDB storage
        deadline_datetime = datetime.combine(task.deadline, datetime.min.time())
        print(f"🐉 Converted to datetime: {deadline_datetime} (type: {type(deadline_datetime)})")  # Debug log
        
        task_doc = {
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": deadline_datetime,  # Store as datetime
            "completed": False,
            "label_ids": [],
            "created_at": now,
            "updated_at": now
        }
        
        print(f"🐉 Task doc before insert: {task_doc}")  # Debug log
        result = tasks_collection.insert_one(task_doc)
        task_doc["_id"] = result.inserted_id
        print(f"🐉 Task doc after insert: {task_doc}")  # Debug log
        
        serialized = serialize_task(task_doc)
        print(f"🐉 Serialized task: {serialized}")  # Debug log
        return serialized
        
    except Exception as e:
        print(f"🐉 Error creating task: {str(e)}")  # Error log
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create task: {str(e)}"
        )

@router.get("/", response_model=TypeList[TaskOut])
async def list_tasks(limit: int = 50):
    """List tasks sorted by created_at desc"""
    cursor = tasks_collection.find().sort("created_at", -1).limit(limit)
    tasks = []
    
    for doc in cursor:
        tasks.append(serialize_task(doc))
    
    return tasks

@router.get("/{task_id}", response_model=TaskOut)
async def get_task(task_id: str):
    """Get a task by ID"""
    # Validate ObjectId format
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    
    doc = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return serialize_task(doc)
