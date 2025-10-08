"""
Label Document Model for Beanie ODM
"""
from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime


class Label(Document):
    """Label document for MongoDB via Beanie ODM"""

    user_id: Optional[str] = Field(None, description="Owner user ID")
    name: str = Field(..., min_length=1, max_length=50)
    name_normalized: str = Field(..., description="Lowercased, trimmed name for uniqueness")
    color: Optional[str] = Field(None, description="Hex color like #f97316")

    created_at: datetime = Field(default_factory=lambda: datetime.now())

    def dict(self, **kwargs):
        data = super().dict(**kwargs)
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return data

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return data

    class Settings:
        name = "labels"
        indexes = [
            [("user_id", 1), ("name_normalized", 1)],
            "user_id",
        ]


