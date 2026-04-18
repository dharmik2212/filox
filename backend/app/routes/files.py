from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime
import hashlib
import os

from app.database import get_session
from app.models import User, File as FileModel
from app.schemas import FileResponse, FileMetadata
from app.utils.auth import get_current_user
from app.utils.file_utils import extract_metadata, compute_file_hash

router = APIRouter(prefix="/files", tags=["files"])

# Temporary upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=FileResponse)
async def upload_file(
    file: UploadFile = File(...),
    semester_tag: str = "Unknown",
    is_current_semester: bool = False,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Upload and analyze a file
    
    POST /files/upload
    - Extracts metadata
    - Computes hash for duplicate detection
    - Stores file info in database
    """
    try:
        # Save file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # Compute file hash
        file_hash = compute_file_hash(file_path)
        
        # Extract metadata
        file_size = os.path.getsize(file_path)
        file_type = file.filename.split(".")[-1].lower()
        metadata = extract_metadata(file_path)
        
        # Check if file already exists for this user
        statement = select(FileModel).where(
            (FileModel.user_id == current_user.id)
            & (FileModel.file_hash == file_hash)
        )
        existing = session.exec(statement).first()
        if existing:
            raise HTTPException(status_code=409, detail="File already exists")
        
        # Create file record
        db_file = FileModel(
            user_id=current_user.id,
            file_hash=file_hash,
            file_name=file.filename,
            file_size=file_size,
            file_path=file_path,
            file_type=file_type,
            metadata_json=str(metadata),
            semester_tag=semester_tag,
            is_current_semester=is_current_semester,
        )
        
        session.add(db_file)
        session.commit()
        session.refresh(db_file)
        
        return FileResponse.model_validate(db_file)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@router.get("/list", response_model=list[FileResponse])
async def list_files(
    semester_tag: str = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get all files for current user, optionally filtered by semester"""
    statement = select(FileModel).where(
        (FileModel.user_id == current_user.id)
        & (FileModel.is_deleted == False)
    )
    
    if semester_tag:
        statement = statement.where(FileModel.semester_tag == semester_tag)
    
    files = session.exec(statement).all()
    return files


@router.get("/{file_id}", response_model=FileResponse)
async def get_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Get single file details"""
    db_file = session.get(FileModel, file_id)
    if not db_file or db_file.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse.model_validate(db_file)


@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Mark file as deleted (soft delete)"""
    db_file = session.get(FileModel, file_id)
    if not db_file or db_file.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="File not found")
    
    db_file.is_deleted = True
    db_file.deleted_at = datetime.utcnow()
    session.add(db_file)
    session.commit()
    
    return {"status": "deleted", "file_id": file_id}
