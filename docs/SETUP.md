# Setup Guide - Filox Development Environment

## Prerequisites

- Python 3.9+ (for backend & ML)
- Node.js 16+ (for mobile)
- Git
- Expo CLI (for React Native)

## Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/filox.git
cd filox
```

## Step 2: Backend Setup

### Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with:
- `GOOGLE_CLIENT_ID` - Get from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - Get from Google Cloud Console
- `SECRET_KEY` - Generate a random string

### Initialize Database

```bash
python -c "from app.database import create_db_and_tables; create_db_and_tables()"
```

### Run Backend Server

```bash
python main.py
```

✅ API is running at `http://localhost:8000`  
📚 API docs at `http://localhost:8000/docs`

## Step 3: Mobile App Setup

### Install Mobile Dependencies

```bash
cd ../mobile  # Back to project root, then go to mobile
npm install
```

### Start Expo Developer Server

```bash
npx expo start
```

### Run on Device/Simulator

- **iOS**: Press `i` (requires macOS + Xcode)
- **Android**: Press `a` (requires Android Studio)
- **Web**: Press `w` (browser preview)

## Step 4: ML Model Training (Optional)

### Prepare Training Data

1. Create `ml_training/dataset/academic/` folder
2. Create `ml_training/dataset/noise/` folder
3. Create `ml_training/dataset/current_semester/` folder

4. Add representative images to each folder:
   - **academic/**: Textbooks, notes, assignments, diagrams (~200 images)
   - **noise/**: Selfies, food, random photos (~200 images)
   - **current_semester/**: Current semester photos (~100 images)

### Train Model

```bash
cd ml_training
python -m venv venv
# Activate venv (same as backend)
pip install -r requirements.txt

python train.py
```

The trained model will be saved to `outputs/academic_classifier_v1.pt`

### Deploy Trained Model

```bash
cp outputs/academic_classifier_v1.pt ../backend/app/ml/models/
```

## Database Setup

Filox supports two database options:

### SQLite (Development)
- Automatically created on first run
- No additional setup needed
- File: `filox.db`

### PostgreSQL (Production)

```bash
# Create PostgreSQL database
createdb filox_db

# Update .env
DATABASE_URL=postgresql://user:password@localhost/filox_db

# Run migrations
alembic upgrade head
```

## Testing Backend API

### Health Check
```bash
curl http://localhost:8000/health
```

### Get API Documentation
```bash
curl http://localhost:8000/docs
```

### Test Classification Endpoint
```bash
curl -X POST http://localhost:8000/classify/single \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"file_id": 1}'
```

## Troubleshooting

### Backend Won't Start
- Check Python version: `python --version` (should be 3.9+)
- Try: `pip install -r requirements.txt --upgrade`
- Check port 8000 is not in use: `lsof -i :8000`

### Mobile App Won't Connect to Backend
- Check backend is running on correct IP
- Update API URL in `mobile/src/services/api.ts`
- Check CORS settings in `backend/main.py`

### Model Training Issues
- Ensure images are in correct folders
- Try with smaller batch size in `ml_training/train.py`
- Use CPU instead of GPU if out of memory

## Next Steps

1. ✅ Setup complete!
2. Customize the Tailwind color scheme in `mobile/`
3. Collect training data and train the ML model
4. Deploy backend to cloud (Railway, Render, AWS)
5. Build and deploy mobile apps to app stores
