# Filox Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Gallery    │  │  Cleanup     │      │
│  │ (Collections)│  │ (w/ Badges)  │  │ (Duplicates) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▲                 ▲                   ▲              │
└─────────┼─────────────────┼───────────────────┼──────────────┘
          │                 │                   │
          │ HTTP/REST       │ (Bearer Token)    │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│              FASTAPI BACKEND (Python)                       │
│  ┌────────────Routes───────────────────────────────────┐   │
│  │  /auth/google      - Google OAuth login             │   │
│  │  /files/upload     - Upload file + metadata         │   │
│  │  /classify/batch   - Batch classify images          │   │
│  │  /duplicates/detect - Find duplicate files          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────ML Pipeline───────────────────────────────┐   │
│  │  CNN Classifier (MobileNetV3)                       │   │
│  │    Input: Image → Features → Classification Head    │   │
│  │    Output: [academic|noise|current_semester]        │   │
│  │    Confidence: 0.0-1.0                              │   │
│  │                                                      │   │
│  │  Duplicate Detector                                 │   │
│  │    Hash-based: SHA256 (100% match)                 │   │
│  │    Perceptual: DHash (visual similarity)            │   │
│  │    Feature: ORB/SIFT (detailed matching)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────Database (SQLModel)───────────────────────┐   │
│  │  Users         - User profiles, current semester    │   │
│  │  Files         - File metadata, hashes, tags        │   │
│  │  Classifications - AI predictions, confidence       │   │
│  │  DuplicatePairs - Duplicate detection results       │   │
│  │  AuditLog      - All destructive actions            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          ▲
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│           DATABASE                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SQLite (development) / PostgreSQL (production)    │   │
│  │  Stores: Users, Files, Classifications, Audit Log  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
Mobile App → Google OAuth Button
    ↓
Google OAuth Dialog (user login)
    ↓
Backend: /auth/google (verify ID token)
    ↓
JWT Token created + Database user record
    ↓
Mobile stores token in AsyncStorage
    ↓
All subsequent requests include: Authorization: Bearer {token}
```

### 2. File Classification Flow
```
Mobile: Access device photos (MediaLibrary)
    ↓
Backend: POST /files/upload (upload metadata + thumbnail)
    ↓
Backend: Compute file hash (for duplicates)
    ↓
Backend: PUT /classify/batch (send file paths)
    ↓
ML Classifier: Load image → Extract features → Predict class
    ↓
Backend: Save classification to database
    ↓
Mobile: Receive results + display classification badges
```

### 3. Duplicate Detection Flow
```
Mobile: User taps "Scan for Duplicates"
    ↓
Backend: POST /duplicates/detect (pass file IDs)
    ↓
Duplicate Detector:
  - Hash-based: Compare SHA256 hashes (fast, 100% accurate)
  - Perceptual: Compare DHashes (medium speed, visual similarity)
  - Feature: ORB feature matching (slow, high accuracy)
    ↓
Backend: Save duplicate pairs to database
    ↓
Mobile: Display duplicate pairs with confidence scores
    ↓
User: Review and select which copies to delete
    ↓
Backend: Mark files as deleted (soft delete, reversible)
```

## Component Details

### Backend Routes

#### Authentication (`app/routes/auth.py`)
- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user profile
- `PUT /auth/semester` - Update current semester

#### Files (`app/routes/files.py`)
- `POST /files/upload` - Upload file
- `GET /files/list` - List files (optionally filtered by semester)
- `GET /files/{id}` - Get single file details
- `DELETE /files/{id}` - Mark file as deleted

#### Classification (`app/routes/classify.py`)
- `POST /classify/single` - Classify one file
- `POST /classify/batch` - Classify multiple files
- `GET /classify/{file_id}` - Get existing classification

#### Duplicates (`app/routes/duplicates.py`)
- `POST /duplicates/detect` - Detect duplicates
- `GET /duplicates/list` - List all detected duplicates

### ML Components

#### CNN Classifier (`app/ml/classifier.py`)
- Uses MobileNetV3-Small (lightweight for mobile inference)
- Transfer learning from ImageNet
- 3-class output: [academic, noise, current_semester]
- Confidence scores for each prediction

#### Duplicate Detector (`app/ml/duplicate_detector.py`)
- SHA256 hashing for exact duplicates (O(1) lookup)
- Perceptual hashing (DHashing) for visual similarity
- Feature matching (ORB) for detailed comparison
- Composite similarity score

### Mobile Components

#### Screens
- **DashboardScreen**: Collections by semester
- **GalleryScreen**: Grid of photos with classification badges
- **AnalysisScreen**: Duplicate detection & cleanup
- **SettingsScreen**: User preferences & app info
- **FileReviewScreen**: Individual file detail & actions

#### Services
- **AuthService**: Google OAuth integration
- **FileSystemService**: Access device photos
- **ClassificationAPI**: Call classification endpoints
- **DuplicateDetectorAPI**: Call duplicate detection

#### State Management (Redux)
- `authSlice`: Authentication state
- `filesSlice`: Files list & selection
- `classificationSlice`: Classification results
- `duplicatesSlice`: Duplicate pairs

## Database Schema

### Users Table
```
id: Primary Key
google_id: String (unique)
email: String (unique)
name: String
profile_picture_url: String
current_semester: String
created_at: DateTime
updated_at: DateTime
```

### Files Table
```
id: Primary Key
user_id: Foreign Key (Users)
file_hash: String (SHA256)
file_name: String
file_size: Integer
file_path: String
file_type: String
metadata_json: JSON
date_taken: DateTime
semester_tag: String (indexed)
is_current_semester: Boolean
is_archived: Boolean
archived_at: DateTime
is_deleted: Boolean
deleted_at: DateTime
created_at: DateTime
updated_at: DateTime
```

### Classifications Table
```
id: Primary Key
user_id: Foreign Key (Users)
file_id: Foreign Key (Files)
class_label: String (academic|noise|current_semester)
confidence: Float (0.0-1.0)
model_version: String
reasoning: String
created_at: DateTime
```

### DuplicatePairs Table
```
id: Primary Key
user_id: Foreign Key (Users)
file1_id: Foreign Key (Files)
file2_id: Foreign Key (Files)
hash_match: Boolean
perceptual_hash_similarity: Float
visual_similarity: Float
overall_similarity: Float
detection_method: String (hash|perceptual|visual)
created_at: DateTime
```

## Deployment Architecture

### Local Development
```
Backend: localhost:8000
Mobile: Expo on device/simulator
Database: SQLite (filox.db)
```

### Production
```
Backend: Railway/Render/AWS
  - FastAPI + Gunicorn
  - PostgreSQL database
  - Redis for caching (optional)
  
Mobile: App Stores (iOS/Android)
  - Build via EAS (Expo)
  - Code signing configured
  - Auto-updates enabled
```

## Security Considerations

1. **Authentication**: JWT tokens with 24-hour expiration
2. **Authorization**: All endpoints verify user ownership
3. **File Safety**: Soft deletes only (never hard delete without permission)
4. **Privacy**: Photos never leave device unless explicitly accessed
5. **Data Protection**: HTTPS for all API calls
6. **Rate Limiting**: Implement to prevent abuse (add: `slowapi`)

## Performance Optimizations

1. **Classification**: MobileNetV3-Small for fast inference (~50ms)
2. **Duplicate Detection**: Hash-based first (O(1)), then perceptual if needed
3. **Database**: Indexed queries on `user_id`, `semester_tag`, `file_hash`
4. **Caching**: Redis for frequent queries (add in Phase 2)
5. **Pagination**: Limit file list responses to 50 items
6. **Compression**: Gzip API responses
