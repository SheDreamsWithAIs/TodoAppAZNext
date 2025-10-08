"""
Authentication Schemas 🐉
Input/Output schemas for user authentication endpoints
"""
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import datetime

class SignupIn(BaseModel):
    """Schema for user signup request 🐉"""
    email: EmailStr = Field(..., description="User email address")
    password: constr(min_length=8) = Field(..., description="Password (minimum 8 characters)")

class LoginIn(BaseModel):
    """Schema for user login request 🐉"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class UserOut(BaseModel):
    """Schema for user output (excludes password_hash for security) 🐉"""
    id: str = Field(..., description="User ID")
    email: EmailStr = Field(..., description="User email address")
    created_at: datetime = Field(..., description="Account creation timestamp")
