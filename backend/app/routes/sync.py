from fastapi import APIRouter, File, UploadFile, Form, BackgroundTasks
from app.services.vision_service import VisionService

router = APIRouter()
vision_model = VisionService()

@router.post("/auto-sync")
async def handle_auto_sync(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    photo_creation_date: str = Form(...) # The timestamp from the user's gallery
):
    """
    Called periodically/silently by the Expo app to sync new photos.
    """
    image_bytes = await image.read()
    
    # 1. Ask AI What it is
    prediction = vision_model.predict(image_bytes)
    
    # 2. Add to the auto-collection process (e.g. your Hybrid Date routing system)
    # If the user took a "Moni International" board exam picture, the prediction 
    # would help route that here.
    
    print(f"ðŸ“¸ Auto-Synced Background Photo. AI labeled it: '{prediction}'")
    print(f"â° Taken on: {photo_creation_date}")
    
    # Note: If it was 'noise', you would just ignore/delete the file here!
    
    return {"status": "success", "ai_label": prediction}