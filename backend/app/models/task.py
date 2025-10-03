"""
Task Document Model for Beanie ODM 🐉
Replaces the previous Pydantic-only schemas with a full Document model
"""
from beanie import Document, PydanticObjectId
from pydantic import Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class PriorityLevel(str, Enum):
    """Task priority levels"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class Task(Document):
    """
    Task document model for MongoDB via Beanie ODM 🐉
    
    This replaces our previous TaskOut/TaskCreate schemas and handles
    all MongoDB operations directly through the model.
    """
    # Core task fields
    title: str = Field(..., description="Task title (required)")
    description: Optional[str] = Field(None, description="Task description")
    priority: PriorityLevel = Field(..., description="Priority level")
    deadline: date = Field(..., description="Task deadline")
    completed: bool = Field(default=False, description="Completion status")
    
    # Relationships and metadata
    label_ids: List[str] = Field(default_factory=list, description="Associated label IDs")
    user_id: Optional[str] = Field(None, description="Owner user ID (for future auth)")
    
    # Timestamps (Beanie handles these automatically with auto-generation)
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())
    
    def dict(self, **kwargs):
        """Override dict method to return 'id' instead of '_id' 🐉"""
        data = super().dict(**kwargs)
        if '_id' in data:
            data['id'] = str(data.pop('_id'))
        return data
    
    def model_dump(self, **kwargs):
        """Override model_dump for Pydantic v2 compatibility 🐉"""
        data = super().model_dump(**kwargs)
        if '_id' in data:
            data['id'] = str(data.pop('_id'))
        return data
    
    class Settings:
        """Beanie document settings 🐉"""
        name = "tasks"  # MongoDB collection name
        
        # Indexes for performance (based on project notes)
        indexes = [
            "user_id",  # Single field index for user queries
            [("user_id", 1), ("completed", 1)],  # Compound index for filtering
            [("user_id", 1), ("deadline", 1)],   # Compound index for deadline sorting
            "label_ids",  # Multikey index for label filtering
        ]

# Input schemas for API endpoints (still Pydantic BaseModel, not Document)
from pydantic import BaseModel

class TaskCreateRequest(BaseModel):
    """Schema for creating a new task (API input) 🐉"""
    title: str = Field(..., description="Task title (required)")
    description: Optional[str] = Field(None, description="Task description")  
    priority: PriorityLevel = Field(..., description="Priority level")
    deadline: date = Field(..., description="Task deadline")

class TaskUpdateRequest(BaseModel):
    """Schema for updating a task (API input) 🐉"""
    title: Optional[str] = Field(None, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: Optional[PriorityLevel] = Field(None, description="Priority level")
    deadline: Optional[date] = Field(None, description="Task deadline")
    completed: Optional[bool] = Field(None, description="Completion status")
    label_ids: Optional[List[str]] = Field(None, description="Associated label IDs")
