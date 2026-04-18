import os
import json
import shutil
from datetime import datetime

class SmartCategorizer:
    """
    Step 2 of the AI-Powered Academic Image Categorizer pipeline.
    This reads the metadata (date created) of an image that has already been 
    deemed 'Academic' by the Vision CNN, and figures out which semester it 
    belongs to based on the Web-Scraped University Calendar.
    """
    def __init__(self, user_profile_path="config/user_profile.json"):
        self.profile_path = user_profile_path
        self.term_calendars = self._load_term_calendar()
        
    def _load_term_calendar(self):
        try:
            with open(self.profile_path, "r") as f:
                data = json.load(f)
                return data.get("term_dates", [])
        except Exception as e:
            print(f"âš ï¸  Could not load user profile: {e}")
            return []

    def get_creation_date(self, image_path):
        """
        Extract the image creation date.
        WhatsApp and similar apps strip EXIF data entirely.
        Thus, OS file creation time is the most robust fallback.
        """
        try:
            # First try OS modification/creation. For WhatsApp forwards, 
            # modification time is often the moment it was downloaded.
            timestamp = os.path.getmtime(image_path)
            # Create a localized datetime
            date_created = datetime.fromtimestamp(timestamp)
            return date_created
        except Exception as e:
            print(f"â Œ Failed to extract date for {image_path}: {e}")
            return None

    def find_matching_term(self, date_obj: datetime):
        """
        Matches a datetime object against the LLM-scraped term dates from the university.
        """
        for term in self.term_calendars:
            start = datetime.strptime(term["start_date"], "%Y-%m-%d")
            end = datetime.strptime(term["end_date"], "%Y-%m-%d")
            
            # If the photo was taken within this University semester
            if start <= date_obj <= end:
                return term["term_name"]
                
        return "Unknown_Term"

    def process_academic_image(self, image_path, dry_run=True):
        """
        Takes an image that the Vision Model already flagged as Academic,
        finds its date, matches it to the scraped calendar, and routes it.
        """
        filename = os.path.basename(image_path)
        date_created = self.get_creation_date(image_path)
        
        if not date_created:
            return
            
        # Call Step D: Compare against Web Scraped Calendar
        term_folder = self.find_matching_term(date_created)
        date_str = date_created.strftime("%Y-%m-%d")
        
        print(f"ðŸ“„ {filename} (Taken: {date_str}) âž¡ï¸  Mapped to: {term_folder}")
        
        if not dry_run:
            # We would usually move it into a matched directory
            # dst = os.path.join("categorized", term_folder, filename)
            # shutil.move(image_path, dst)
            pass

if __name__ == "__main__":
    # Test the pipeline
    import sys
    
    # Just creating a temporary dummy file to test the OS modification date extraction
    test_file = "dummy_test_photo.jpg"
    with open(test_file, "w") as f:
        f.write("mock image data")
        
    print("====================================")
    print("ðŸ§  RUNNING SMART CATEGORIZER TEST  ðŸ§ ")
    print("====================================")
    
    categorizer = SmartCategorizer()
    categorizer.process_academic_image(test_file, dry_run=True)
    
    # Clean up the dummy file
    os.remove(test_file)