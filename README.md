# Filox - Academic File Manager

A smart mobile app that helps students manage phone storage by classifying files by academic period.

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Google OAuth credentials

python main.py
# API runs on http://localhost:8000
```

Visit `http://localhost:8000/docs` for interactive API documentation.

### 2. Frontend Setup (React Native)

```bash
cd mobile
npm install
# Configure app.json with your settings

npx expo start
# Press 'i' for iOS or 'a' for Android
```

### 3. ML Model Training

```bash
cd ml_training
pip install -r requirements.txt

# Organize training data:
# dataset/academic/ - academic photos (notes, textbooks, diagrams)
# dataset/noise/ - non-academic photos (selfies, food, etc)
# dataset/current_semester/ - photos from current semester

python train.py
# Model saved to outputs/academic_classifier_v1.pt
```

Then copy the trained model:
```bash
cp outputs/academic_classifier_v1.pt ../backend/app/ml/models/
```

## Project Structure

```
filox/
├── backend/                 # FastAPI server
│   ├── app/
│   │   ├── models.py       # Database schemas
│   │   ├── schemas.py      # Request/response models
│   │   ├── routes/         # API endpoints
│   │   ├── ml/             # ML models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── main.py             # FastAPI app
│   └── requirements.txt
│
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── services/       # API & file system
│   │   ├── store/          # Redux state
│   │   └── utils/
│   └── app.json
│
├── ml_training/            # Model training
│   ├── train.py            # Training script
│   ├── dataset/            # Training images
│   └── outputs/            # Trained models
│
└── docs/                   # Documentation
```

## Key Features

✨ **Classification**: AI-powered image classification to identify academic vs noise files
📁 **Collections**: Organize photos by semester/academic period
🔍 **Duplicate Detection**: Find and remove duplicate files
💾 **Safe Deletion**: Manual review before any file deletion
📊 **Storage Insights**: See what's taking up space

## Environment Variables

Create `.env` in backend/:

```
DEBUG=True
DATABASE_URL=sqlite:///./filox.db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key
```

## API Documentation

Once running, visit `http://localhost:8000/docs` for:
- Interactive API explorer
- Live endpoint testing
- Request/response examples

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details
