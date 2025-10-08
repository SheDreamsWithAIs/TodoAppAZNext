from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for creating a new user 🐉"""
    email: EmailStr = Field(..., description="User email address (must be unique)")
    password: str = Field(..., min_length=6, description="User password (minimum 6 characters)")
    name: Optional[str] = Field(None, description="User display name (optional)")

class UserLogin(BaseModel):
    """Schema for user login 🐉"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class UserOut(BaseModel):
    """Schema for user output (excludes password_hash) 🐉"""
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email address")
    name: Optional[str] = Field(None, description="User display name")
    created_at: datetime = Field(..., description="Account creation timestamp")

class UserInDB(BaseModel):
    """Schema for user as stored in database (includes password_hash) 🐉"""
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email address")
    password_hash: str = Field(..., description="Hashed password")
    name: Optional[str] = Field(None, description="User display name")
    created_at: datetime = Field(..., description="Account creation timestamp")
