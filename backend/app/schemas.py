from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ============ Auth Schemas ============
class GoogleLoginRequest(BaseModel):
    """Request body for Google OAuth login"""
    id_token: str


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserProfile(BaseModel):
    """User profile information"""
    id: int
    email: str
    name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    current_semester: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ File Schemas ============
class FileMetadata(BaseModel):
    """File metadata for storage"""
    file_name: str
    file_size: int
    file_type: str
    date_taken: Optional[datetime] = None
    semester_tag: str
    is_current_semester: bool = False


class FileResponse(BaseModel):
    """File response with classification"""
    id: int
    file_name: str
    file_size: int
    file_type: str
    semester_tag: str
    is_current_semester: bool
    is_archived: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ Classification Schemas ============
class ClassificationRequest(BaseModel):
    """Request to classify an image"""
    file_id: int
    # Or for inference without saving:
    # image_base64: Optional[str] = None
    # image_url: Optional[str] = None


class ClassificationResponse(BaseModel):
    """Classification result"""
    file_id: int
    class_label: str  # "academic", "noise", "current_semester"
    confidence: float  # 0.0 to 1.0
    reasoning: Optional[str] = None
    model_version: str
    
    class Config:
        from_attributes = True


class BatchClassificationRequest(BaseModel):
    """Classify multiple files at once"""
    file_ids: List[int]


class BatchClassificationResponse(BaseModel):
    """Batch classification results"""
    results: List[ClassificationResponse]
    total_processed: int
    errors: Optional[List[str]] = None


# ============ Duplicate Detection Schemas ============
class DuplicatePairResponse(BaseModel):
    """Duplicate file pair"""
    id: int
    file1_id: int
    file2_id: int
    file1_name: str
    file2_name: str
    overall_similarity: float  # 0.0 to 1.0
    detection_method: str
    
    class Config:
        from_attributes = True


class DuplicateDetectionRequest(BaseModel):
    """Request to find duplicates"""
    file_ids: List[int]
    similarity_threshold: float = 0.85  # Only return pairs above this threshold


class DuplicateDetectionResponse(BaseModel):
    """Duplicate detection results"""
    duplicate_pairs: List[DuplicatePairResponse]
    total_duplicates_found: int
    total_files_scanned: int
    

# ============ Action Schemas ============
class ArchiveRequest(BaseModel):
    """Request to archive files"""
    file_ids: List[int]
    reason: Optional[str] = None


class DeleteRequest(BaseModel):
    """Request to delete files"""
    file_ids: List[int]
    reason: Optional[str] = None
    confirm: bool = True  # Require confirmation


class ActionResponse(BaseModel):
    """Generic action response"""
    success: bool
    message: str
    affected_files: int


# ============ Collection Schemas ============
class SemesterCollection(BaseModel):
    """Collection of files grouped by semester"""
    semester_tag: str
    file_count: int
    total_size_bytes: int
    created_at: datetime
    last_modified: datetime
    academic_files: int
    noise_files: int
    current_semester_files: int


class DashboardStats(BaseModel):
    """Dashboard statistics"""
    total_files: int
    total_storage_bytes: int
    total_semesters: int
    collections: List[SemesterCollection]
    duplicate_count: int
    noise_files_count: int
