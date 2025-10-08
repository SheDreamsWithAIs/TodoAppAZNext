from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class LabelCreate(BaseModel):
    """Schema for creating a new label 🐉"""
    name: str = Field(..., min_length=1, max_length=50, description="Label name (1-50 characters)")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="Hex color code (optional, e.g., #FF5733)")

class LabelUpdate(BaseModel):
    """Schema for updating a label 🐉"""
    name: Optional[str] = Field(None, min_length=1, max_length=50, description="Label name (1-50 characters)")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="Hex color code (e.g., #FF5733)")

class LabelOut(BaseModel):
    """Schema for label output 🐉"""
    id: str = Field(..., description="Label ID")
    user_id: str = Field(..., description="Owner user ID")
    name: str = Field(..., description="Label display name")
    name_normalized: str = Field(..., description="Normalized name for uniqueness checking")
    color: Optional[str] = Field(None, description="Hex color code")
    created_at: datetime = Field(..., description="Label creation timestamp")

class LabelInDB(BaseModel):
    """Schema for label as stored in database 🐉"""
    id: str = Field(..., description="Label ID")
    user_id: str = Field(..., description="Owner user ID")
    name: str = Field(..., description="Label display name")
    name_normalized: str = Field(..., description="Normalized name (lowercase, trimmed)")
    color: Optional[str] = Field(None, description="Hex color code")
    created_at: datetime = Field(..., description="Label creation timestamp")
