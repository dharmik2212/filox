from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import json


class User(SQLModel, table=True):
    """User model for storing user information"""
    id: Optional[int] = Field(default=None, primary_key=True)
    google_id: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    current_semester: str = Field(default="Unknown")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    files: List["File"] = Relationship(back_populates="user")
    classifications: List["Classification"] = Relationship(back_populates="user")


class File(SQLModel, table=True):
    """File metadata model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    file_hash: str = Field(index=True)  # SHA256 hash for duplicate detection
    file_name: str
    file_size: int  # in bytes
    file_path: str
    file_type: str  # jpg, pdf, png, etc
    
    # Metadata
    metadata_json: str = Field(default="{}")  # Store EXIF, MIME, etc as JSON
    date_taken: Optional[datetime] = None
    
    # Semester/Academic Tagging
    semester_tag: str = Field(index=True)  # e.g., "Fall 2024", "Spring 2024"
    is_current_semester: bool = Field(default=False)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    is_archived: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    archived_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    
    # Relationships
    user: User = Relationship(back_populates="files")
    classifications: List["Classification"] = Relationship(back_populates="file")


class Classification(SQLModel, table=True):
    """AI Classification results for files"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    file_id: int = Field(foreign_key="file.id", index=True)
    
    # Classification Results
    class_label: str = Field(index=True)  # "academic", "noise", or "current_semester"
    confidence: float  # 0.0 to 1.0
    model_version: str  # Track which model made this prediction
    
    # Additional metadata
    reasoning: Optional[str] = None  # Explanation of classification
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: User = Relationship(back_populates="classifications")
    file: File = Relationship(back_populates="classifications")


class DuplicatePair(SQLModel, table=True):
    """Records detected duplicate file pairs"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    file1_id: int = Field(foreign_key="file.id")
    file2_id: int = Field(foreign_key="file.id")
    
    # Similarity metrics
    hash_match: bool  # 100% duplicate (same SHA256)
    perceptual_hash_similarity: float  # 0.0 to 1.0
    visual_similarity: float  # 0.0 to 1.0
    overall_similarity: float  # Composite score
    
    # Detection method
    detection_method: str  # "hash", "perceptual", "visual"
    
    # Timestamp
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuditLog(SQLModel, table=True):
    """Audit trail for all destructive actions"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    action: str  # "archive", "delete", "restore", "classify"
    file_id: Optional[int] = Field(foreign_key="file.id")
    details_json: str = Field(default="{}")  # Additional details as JSON
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
