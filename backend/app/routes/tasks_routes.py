from fastapi import APIRouter, HTTPException
from datetime import datetime, UTC  # Import UTC for timezone-aware timestamps
from typing import List as TypeList
from bson import ObjectId
import os
from pymongo import MongoClient

from app.schemas.task_schema import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(tags=["tasks"])

# --- Mongo connection (module-level) ---
MONGO_URI = os.getenv("MONGO_URI")
print(f"🐉 Tasks router - MONGO_URI from environment: {'Found' if MONGO_URI else 'Not found'}")
if not MONGO_URI:
    print("🐉 Warning: MONGO_URI not found in environment variables!")
    raise Exception("MONGO_URI environment variable is required but not found. Please check your .env file.")

# DEFINE THE CLIENT/DB/COLLECTION 
client = MongoClient(MONGO_URI)
db = client["TodoAppAZNext"]
tasks_collection = db["tasks"]
# ---------------------------------------

def serialize_task(task_doc: dict) -> TaskOut:
    return TaskOut(
        id=str(task_doc["_id"]),
        title=task_doc["title"],
        description=task_doc.get("description"),
        priority=task_doc["priority"],
        deadline=(task_doc["deadline"].date()
                  if isinstance(task_doc["deadline"], datetime)
                  else task_doc["deadline"]),
        completed=task_doc["completed"],
        label_ids=task_doc.get("label_ids", []),
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"],
    )

@router.post("/", response_model=TaskOut, status_code=201)
async def create_task(task: TaskCreate):
    try:
        now = datetime.now(UTC)  # Use timezone-aware UTC timestamp
        deadline_dt = datetime.combine(task.deadline, datetime.min.time())
        task_doc = {
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "deadline": deadline_dt,
            "completed": False,
            "label_ids": [],
            "created_at": now,
            "updated_at": now,
        }
        result = tasks_collection.insert_one(task_doc)
        task_doc["_id"] = result.inserted_id
        return serialize_task(task_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {e}")

@router.get("/", response_model=TypeList[TaskOut])
async def list_tasks(limit: int = 50):
    cursor = tasks_collection.find().sort("created_at", -1).limit(limit)
    return [serialize_task(doc) for doc in cursor]

@router.get("/{task_id}", response_model=TaskOut)
async def get_task(task_id: str):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    doc = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")
    return serialize_task(doc)

@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update a task with partial data (PATCH) 🐉"""
    # Validate ObjectId format
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    
    # Check if task exists
    existing_task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Build update document only with fields that were provided
    update_doc = {}
    
    if task_update.title is not None:
        update_doc["title"] = task_update.title
    
    if task_update.description is not None:
        update_doc["description"] = task_update.description
    
    if task_update.priority is not None:
        update_doc["priority"] = task_update.priority
    
    if task_update.deadline is not None:
        # Convert date to datetime for MongoDB storage
        update_doc["deadline"] = datetime.combine(task_update.deadline, datetime.min.time())
    
    if task_update.completed is not None:
        update_doc["completed"] = task_update.completed
    
    if task_update.label_ids is not None:
        update_doc["label_ids"] = task_update.label_ids
    
    # Always update the updated_at timestamp
    update_doc["updated_at"] = datetime.now(UTC)
    
    # Perform the update
    if update_doc:
        tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": update_doc}
        )
    
    # Fetch and return the updated document
    updated_doc = tasks_collection.find_one({"_id": ObjectId(task_id)})
    return serialize_task(updated_doc)

@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str):
    """Delete a task 🐉"""
    # Validate ObjectId format
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    
    # Try to delete the task
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    
    # If no document was deleted, the task wasn't found
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Return 204 No Content on successful deletion
    return None
