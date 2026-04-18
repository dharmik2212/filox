import hashlib
import json
from PIL import Image
from datetime import datetime
import os


def compute_file_hash(file_path: str) -> str:
    """Compute SHA256 hash of a file for duplicate detection"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def extract_metadata(file_path: str) -> dict:
    """Extract file metadata (EXIF, size, etc)"""
    metadata = {}
    
    try:
        # File basic info
        metadata["file_size"] = os.path.getsize(file_path)
        metadata["file_created"] = datetime.fromtimestamp(
            os.path.getctime(file_path)
        ).isoformat()
        metadata["file_modified"] = datetime.fromtimestamp(
            os.path.getmtime(file_path)
        ).isoformat()
        
        # Image metadata (if applicable)
        if file_path.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
            try:
                with Image.open(file_path) as img:
                    metadata["image_width"] = img.width
                    metadata["image_height"] = img.height
                    metadata["image_format"] = img.format
                    
                    # EXIF data
                    if hasattr(img, "_getexif") and img._getexif():
                        metadata["exif"] = str(img._getexif())
            except Exception as e:
                metadata["image_error"] = str(e)
    
    except Exception as e:
        metadata["error"] = str(e)
    
    return metadata
