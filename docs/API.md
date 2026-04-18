# Filox API Endpoints

Base URL: `http://localhost:8000`

## Authentication

### Google Login
```http
POST /auth/google
Content-Type: application/json

{
  "id_token": "google_id_token_from_client"
}

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "expires_in": 86400
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "current_semester": "Fall 2024",
  "created_at": "2024-01-15T10:30:00"
}
```

### Update Current Semester
```http
PUT /auth/semester
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "semester": "Fall 2024"
}

Response:
{
  "status": "updated",
  "current_semester": "Fall 2024"
}
```

## Files

### Upload File
```http
POST /files/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: <binary image data>
semester_tag: "Fall 2024"
is_current_semester: true

Response:
{
  "id": 123,
  "file_name": "photo.jpg",
  "file_size": 1024000,
  "file_type": "jpg",
  "semester_tag": "Fall 2024",
  "is_current_semester": true,
  "created_at": "2024-01-15T10:30:00"
}
```

### List Files
```http
GET /files/list?semester_tag=Fall%202024
Authorization: Bearer {access_token}

Response:
[
  {
    "id": 1,
    "file_name": "notes.jpg",
    "file_size": 512000,
    "semester_tag": "Fall 2024"
  },
  ...
]
```

### Get File Details
```http
GET /files/{file_id}
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "file_name": "notes.jpg",
  "file_size": 512000,
  "file_type": "jpg",
  "semester_tag": "Fall 2024",
  "is_current_semester": true,
  "is_archived": false,
  "created_at": "2024-01-15T10:30:00"
}
```

### Delete File (Soft Delete)
```http
DELETE /files/{file_id}
Authorization: Bearer {access_token}

Response:
{
  "status": "deleted",
  "file_id": 1
}
```

## Classification

### Classify Single File
```http
POST /classify/single
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "file_id": 123
}

Response:
{
  "file_id": 123,
  "class_label": "academic",
  "confidence": 0.92,
  "reasoning": "Contains textbook-like formatting with ~92% confidence",
  "model_version": "1.0"
}
```

### Batch Classify Files
```http
POST /classify/batch
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "file_ids": [1, 2, 3, 4, 5]
}

Response:
{
  "results": [
    {
      "file_id": 1,
      "class_label": "academic",
      "confidence": 0.92,
      "reasoning": "..."
    },
    ...
  ],
  "total_processed": 5,
  "errors": null
}
```

### Get Classification
```http
GET /classify/{file_id}
Authorization: Bearer {access_token}

Response:
{
  "file_id": 1,
  "class_label": "academic",
  "confidence": 0.92,
  "reasoning": "...",
  "model_version": "1.0"
}
```

## Duplicates

### Detect Duplicates
```http
POST /duplicates/detect
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "file_ids": [1, 2, 3, 4, 5],
  "similarity_threshold": 0.85
}

Response:
{
  "duplicate_pairs": [
    {
      "id": 1,
      "file1_id": 1,
      "file2_id": 2,
      "file1_name": "photo1.jpg",
      "file2_name": "photo1_copy.jpg",
      "overall_similarity": 0.98,
      "detection_method": "hybrid"
    },
    ...
  ],
  "total_duplicates_found": 3,
  "total_files_scanned": 5
}
```

### List All Duplicates
```http
GET /duplicates/list
Authorization: Bearer {access_token}

Response:
[
  {
    "id": 1,
    "file1_id": 1,
    "file2_id": 2,
    "file1_name": "photo1.jpg",
    "file2_name": "photo1_copy.jpg",
    "overall_similarity": 0.98,
    "detection_method": "hybrid"
  },
  ...
]
```

## Health Check

```http
GET /health

Response:
{
  "status": "healthy",
  "service": "Filox API",
  "version": "1.0.0"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User not authorized to access resource
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflicts (e.g., file already exists)
- `500 Internal Server Error` - Server error

## Authentication Headers

All endpoints (except `/health` and `/auth/google`) require:

```
Authorization: Bearer {access_token}
```

Where `{access_token}` is obtained from the `/auth/google` endpoint.

## Rate Limiting (Planned)

Coming in Phase 2:
- 100 requests per minute per user
- 10 classification requests per minute (GPU intensive)
- 5 duplicate detection scans per minute

## Webhooks (Planned)

Coming in Phase 3:
- `files.uploaded` - File successfully uploaded
- `classification.completed` - File classified
- `duplicates.found` - Duplicates detected
