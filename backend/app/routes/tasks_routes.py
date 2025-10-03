"""
Task routes using Beanie ODM 🐉
Much cleaner than the previous PyMongo implementation!
"""
from fastapi import APIRouter, HTTPException
from typing import List as TypeList
from beanie import PydanticObjectId

from app.models.task import Task, TaskCreateRequest, TaskUpdateRequest

router = APIRouter(tags=["tasks"])

@router.post("/", response_model=Task, status_code=201)
async def create_task(task_data: TaskCreateRequest):
    """Create a new task 🐉"""
    try:
        # Create a new Task document directly from the request data
        task = Task(**task_data.model_dump())
        
        # Save to database (Beanie handles all the MongoDB operations)
        await task.create()
        
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {e}")

@router.get("/", response_model=TypeList[Task])
async def list_tasks(limit: int = 50):
    """List all tasks 🐉"""
    # Beanie makes queries super clean!
    tasks = await Task.find_all().sort(-Task.created_at).limit(limit).to_list()
    return tasks

@router.get("/{task_id}", response_model=Task)
async def get_task(task_id: PydanticObjectId):
    """Get a specific task by ID 🐉"""
    task = await Task.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=Task)
async def update_task(task_id: PydanticObjectId, task_update: TaskUpdateRequest):
    """Update a task with partial data (PATCH) 🐉"""
    # Find the existing task
    task = await Task.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Get only the fields that were provided (exclude None values)
    update_data = task_update.model_dump(exclude_unset=True)
    
    # Update the task with new data
    await task.update({"$set": update_data})
    
    # Return the updated task (Beanie automatically refreshes it)
    return await Task.get(task_id)

@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: PydanticObjectId):
    """Delete a task 🐉"""
    task = await Task.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Delete the task
    await task.delete()
    
    # Return 204 No Content on successful deletion
    return None