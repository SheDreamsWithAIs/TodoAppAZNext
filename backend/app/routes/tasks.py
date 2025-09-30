from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
import os
from pymongo import MongoClient

# 🐉 Tasks router - the dragons are watching!
router = APIRouter(tags=["tasks"])

# MongoDB connection 🐉
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.TodoAppAZNext
tasks_collection = db.tasks

# Pydantic Models 🐉
class TaskCreate(BaseModel):
    title: str = Field(..., description="Task title (required)")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = Field(..., description="Priority level", pattern="^(high|medium|low)$")
    deadline: datetime = Field(..., description="Task deadline")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: Optional[str] = Field(None, description="Priority level", pattern="^(high|medium|low)$")
    deadline: Optional[datetime] = Field(None, description="Task deadline")

class TaskOut(BaseModel):
    id: str = Field(..., description="Task ID")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = Field(..., description="Priority level")
    deadline: datetime = Field(..., description="Task deadline")
    completed: bool = Field(..., description="Completion status")
    label_ids: List[str] = Field(default_factory=list, description="Associated label IDs")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

# Routes 🐉
@router.post("/", response_model=TaskOut, status_code=201)
async def create_task(task: TaskCreate):
    """Create a new task"""
    now = datetime.utcnow()
    task_doc = {
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "deadline": task.deadline,
        "completed": False,
        "label_ids": [],
        "created_at": now,
        "updated_at": now
    }
    
    result = tasks_collection.insert_one(task_doc)
    task_doc["_id"] = result.inserted_id
    
    # Convert to TaskOut format
    return TaskOut(
        id=str(task_doc["_id"]),
        title=task_doc["title"],
        description=task_doc["description"],
        priority=task_doc["priority"],
        deadline=task_doc["deadline"],
        completed=task_doc["completed"],
        label_ids=task_doc["label_ids"],
        created_at=task_doc["created_at"],
        updated_at=task_doc["updated_at"]
    )

@router.get("/", response_model=List[TaskOut])
async def list_tasks(limit: int = 50):
    """List tasks sorted by created_at desc"""
    cursor = tasks_collection.find().sort("created_at", -1).limit(limit)
    tasks = []
    
    for doc in cursor:
        tasks.append(TaskOut(
            id=str(doc["_id"]),
            title=doc["title"],
            description=doc.get("description"),
            priority=doc["priority"],
            deadline=doc["deadline"],
            completed=doc["completed"],
            label_ids=doc.get("label_ids", []),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"]
        ))
    
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
    
    return TaskOut(
        id=str(doc["_id"]),
        title=doc["title"],
        description=doc.get("description"),
        priority=doc["priority"],
        deadline=doc["deadline"],
        completed=doc["completed"],
        label_ids=doc.get("label_ids", []),
        created_at=doc["created_at"],
        updated_at=doc["updated_at"]
    )
