from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.database import create_db_and_tables, get_session
from app.routes import auth, files, classify, duplicates
from config import settings

# Initialize app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Filox: Smart Academic File Manager with AI Classification",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    """Initialize database and models on startup"""
    create_db_and_tables()
    print("✅ Database initialized")
    print("✅ Loading ML models...")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    print("🛑 Shutting down Filox API")


# Health check endpoint
@app.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "service": "Filox API",
        "version": settings.api_version,
    }


# Include routers
app.include_router(auth.router)
app.include_router(files.router)
app.include_router(classify.router)
app.include_router(duplicates.router)


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to Filox API",
        "docs": "/docs",
        "version": settings.api_version,
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
