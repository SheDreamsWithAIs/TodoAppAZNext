"""
User Document Model for Beanie ODM 🐉
Handles user authentication and account management
"""
from beanie import Document, Indexed
from pydantic import Field, EmailStr
from datetime import datetime, UTC
from typing import Optional

class User(Document):
    """
    User document model for MongoDB via Beanie ODM 🐉
    
    Handles user registration and authentication with secure password storage.
    """
    # Email with unique index for authentication
    email: Indexed(EmailStr, unique=True) = Field(..., description="User email address (unique)")
    
    # Secure password storage - never store raw passwords!
    password_hash: str = Field(..., description="Bcrypt hashed password")
    
    # Account metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC), description="Account creation timestamp")
    
    class Settings:
        """Beanie document settings 🐉"""
        name = "users"  # MongoDB collection name
        
        # Indexes for performance and uniqueness
        indexes = [
            "email",  # Unique index on email (handled by Indexed type above)
        ]
