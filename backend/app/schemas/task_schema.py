from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date

class TaskCreate(BaseModel):
    title: str = Field(..., description="Task title (required)")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = Field(..., description="Priority level", pattern="^(high|medium|low)$")
    deadline: date = Field(..., description="Task deadline")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: Optional[str] = Field(None, description="Priority level", pattern="^(high|medium|low)$")
    deadline: Optional[date] = Field(None, description="Task deadline")
    completed: Optional[bool] = Field(None, description="Completion status")
    label_ids: Optional[List[str]] = Field(None, description="Associated label IDs")

class TaskOut(BaseModel):
    id: str = Field(..., description="Task ID")
    title: str = Field(..., description="Task title")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = Field(..., description="Priority level")
    deadline: date = Field(..., description="Task deadline")
    completed: bool = Field(..., description="Completion status")
    label_ids: List[str] = Field(default_factory=list, description="Associated label IDs")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
