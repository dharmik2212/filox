import os
import json
from datetime import datetime
from duckduckgo_search import DDGS
from pydantic import BaseModel

class TermDates(BaseModel):
    term_name: str
    start_date: str
    end_date: str

class AcademicScraper:
    def __init__(self):
        self.ddgs = DDGS()
    
    def scrape_term_dates(self, institution_name: str, education_level: str = "university", course_name: str = "", current_year: str = None) -> list[TermDates]:
        """
        Scrapes and extracts term dates using DuckDuckGo Search API.
        Works for both University (Semesters/Quarters) and K-12 Schools (Trimesters/Marking Periods).
        """
        if current_year is None:
            current_year = str(datetime.now().year)

        education_level_lower = education_level.lower()
        is_k12 = any(term in education_level_lower for term in ["school", "high school", "middle", "primary", "std", "grade", "standard", "class"])

        # Adjust query based on if it is a school or university
        if is_k12:
            search_query = f"{institution_name} academic calendar term dates grading period {current_year}"
        else:
            search_query = f"{institution_name} {course_name} academic calendar term dates fall spring winter {current_year}"
        
        print(f"ðŸ”Ž Searching for: {search_query}")

        results = ""
        try:
            # Get top 3 search results
            search_results = self.ddgs.text(search_query, max_results=3)
            for res in search_results:
                results += res['body'] + "\n"
        except Exception as e:
            print(f"âš ï¸  Search failed: {e}")
            return self._get_fallback_dates(institution_name, current_year)

        # ---------------------------------------------------------
        # LLM MOCK: Simulating recognizing K-12 trimesters vs University semesters
        # ---------------------------------------------------------
        print(f"ðŸ§  LLM parsing search results for {institution_name}...")
        
        if is_k12:
            extracted_dates = [
                TermDates(term_name=f"Semester 1 (Fall) {current_year}", start_date=f"{current_year}-09-05", end_date=f"{current_year}-01-25"),
                TermDates(term_name=f"Semester 2 (Spring) {int(current_year)+1}", start_date=f"{int(current_year)+1}-01-30", end_date=f"{int(current_year)+1}-06-20")
            ]
        else:
            extracted_dates = [
                TermDates(term_name=f"Fall {current_year}", start_date=f"{current_year}-08-25", end_date=f"{current_year}-12-15"),
                TermDates(term_name=f"Spring {int(current_year)+1}", start_date=f"{int(current_year)+1}-01-10", end_date=f"{int(current_year)+1}-05-15"),
                TermDates(term_name=f"Summer {int(current_year)+1}", start_date=f"{int(current_year)+1}-06-01", end_date=f"{int(current_year)+1}-08-10")
            ]
        
        return extracted_dates
        
    def _get_fallback_dates(self, institution_name: str, year: str) -> list[TermDates]:
        return [
            TermDates(term_name=f"Semester 1 {year}", start_date=f"{year}-08-01", end_date=f"{year}-12-20"),
            TermDates(term_name=f"Semester 2 {int(year)+1}", start_date=f"{int(year)+1}-01-05", end_date=f"{int(year)+1}-05-30")
        ]

if __name__ == "__main__":
    scraper = AcademicScraper()
    
    print("\n--- Testing University Setup ---")
    dates_uni = scraper.scrape_term_dates("Stanford University", "University", "Computer Science", "2025")
    for d in dates_uni:
        print(f"{d.term_name}: {d.start_date} to {d.end_date}")
        
    print("\n--- Testing High School Setup ---")
    dates_hs = scraper.scrape_term_dates("Lincoln High School", "High School", "", "2025")
    for d in dates_hs:
        print(f"{d.term_name}: {d.start_date} to {d.end_date}")