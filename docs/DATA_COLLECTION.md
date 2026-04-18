# Data Collection Guide for Filox Training

## Overview

To train the Filox classifier effectively, you need to collect ~900 labeled images across 3 categories. Here's a practical guide.

## Quick Collection Strategies

### Strategy 1: Crowdsource from Friends (Fastest 🚀)

**Time**: 1-2 days  
**Effort**: Low  
**Quality**: High

1. **Create collection form** (Google Forms or Typeform)
   - Ask 10-20 friends to contribute photos
   - Request ~40-50 photos per person
   - Categories to submit:
     - 15-20 academic (notes, textbooks, assignments)
     - 15-20 personal (selfies, food, parties)
     - 10 from their current semester

2. **Collect photos** (1-2 days)
   - Request via email/messaging
   - Incentive: "I'm building an app to help students - be an early tester!"

3. **Organize files**
   ```
   dataset/
   ├── academic/ (150-200 images)
   ├── noise/ (150-200 images)
   └── current_semester/ (50-100 images)
   ```

**Pros**: Diverse real-world data, authentic variety  
**Cons**: Requires coordination

---

### Strategy 2: Download from Public Sources (Easiest ⚡)

**Time**: 3-4 hours  
**Effort**: Medium  
**Quality**: Moderate

#### Academic Images

```bash
# Use bing-image-downloader
pip install bing-image-downloader

python -c "
from bing_image_downloader import downloader

queries = [
    'university lecture slides pdf screenshot',
    'textbook page scan',
    'classroom whiteboard notes',
    'student assignment paper',
    'educational diagram',
    'class notes handwritten',
    'exam paper content'
]

for query in queries:
    downloader.download(
        query, 
        limit=30,
        output_dir='dataset/academic',
        adult_filter_off=True,
        force_replace=False
    )
"
```

#### Noise Images

```bash
python -c "
from bing_image_downloader import downloader

queries = [
    'selfie people',
    'food photography',
    'landscape nature',
    'party celebration',
    'casual social media photos',
    'random objects',
    'dog cat animals'
]

for query in queries:
    downloader.download(
        query,
        limit=30,
        output_dir='dataset/noise',
        adult_filter_off=True,
        force_replace=False
    )
"
```

#### Current Semester Images (Use Your Own)

- Screenshots from your current courses
- Your notes/assignments
- Class photos from this semester
- Textbooks you're currently using

**Pros**: Fast, no manual work  
**Cons**: Lower diversity, possible duplicates

---

### Strategy 3: Hybrid Approach (Recommended) ✅

**Time**: 2-3 days  
**Effort**: Low-Medium  
**Quality**: High

**Phase 1: Download Base Dataset (4 hours)**
- Use Bing Image Downloader for 300 images per category
- Remove obvious duplicates/corrupted files

**Phase 2: Crowdsource Additions (1-2 days)**
- Ask 5-10 friends for 50 images each
- Adds diversity & authenticity

**Phase 3: Quality Review (2-4 hours)**
- Manual review & organize by quality
- Remove ~20% lowest quality images
- Organize into folders

**Result**: 900+ diverse, high-quality images

---

## Dataset Organization

After collection, organize like this:

```
ml_training/
├── dataset/
│   ├── academic/           # 250-300 images
│   │   ├── 01_textbook.jpg
│   │   ├── 02_notes.png
│   │   ├── 03_assignment.jpg
│   │   └── ... (247+ more)
│   │
│   ├── noise/              # 250-300 images
│   │   ├── 01_selfie.jpg
│   │   ├── 02_food.jpg
│   │   ├── 03_landscape.png
│   │   └── ... (247+ more)
│   │
│   └── current_semester/   # 100-150 images
│       ├── 01_class_photo.jpg
│       ├── 02_current_notes.jpg
│       └── ... (98+ more)
│
└── verify_dataset.py        # Quality check script
```

### Folder Organization Tips

✅ **One image per file** (no collages)  
✅ **Clear naming** (optional: descriptive names help debugging)  
✅ **50:50 balance** within categories (mix photos, screenshots, documents)  
✅ **Vary image quality** (include some blurry, dark, bright photos)  
❌ **Avoid** exact duplicates, corrupted files, watermarks

---

## Dataset Validation

Before training, run this validation script:

```python
# verify_dataset.py
import os
from PIL import Image
from collections import defaultdict

categories = ['academic', 'noise', 'current_semester']
dataset_path = 'dataset'

stats = defaultdict(int)
errors = []

for category in categories:
    cat_path = os.path.join(dataset_path, category)
    if not os.path.exists(cat_path):
        errors.append(f"Missing folder: {category}")
        continue
    
    for filename in os.listdir(cat_path):
        filepath = os.path.join(cat_path, filename)
        try:
            img = Image.open(filepath)
            img.verify()
            stats[category] += 1
        except Exception as e:
            errors.append(f"Bad file: {filename} - {e}")

print("=== Dataset Statistics ===")
for cat, count in stats.items():
    print(f"{cat}: {count} images")

print(f"\nTotal images: {sum(stats.values())}")

if errors:
    print(f"\n⚠️  {len(errors)} issues found:")
    for error in errors[:10]:
        print(f"  - {error}")
else:
    print("\n✅ Dataset is valid!")

# Check balance
if stats:
    avg = sum(stats.values()) / len(stats)
    for cat, count in stats.items():
        pct = (count / sum(stats.values())) * 100
        print(f"{cat}: {pct:.1f}%")
```

Run it:
```bash
python verify_dataset.py
```

Expected output:
```
=== Dataset Statistics ===
academic: 280 images
noise: 290 images
current_semester: 120 images

Total images: 690

✅ Dataset is valid!
academic: 37.0%
noise: 38.3%
current_semester: 24.7%
```

---

## Minimal Dataset (MVP)

If you're in a hurry, minimum viable dataset:

```
academic/: 100 images
  - Mix of textbook pages, notes, assignments, diagrams
  
noise/: 100 images
  - Selfies, food, landscapes, random objects
  
current_semester/: 50 images
  - Your current class materials
```

**Total: 250 images**

This will achieve ~75-80% accuracy. Not ideal, but functional.

---

## Iterative Improvement

### Iteration 1: MVP (Day 1)
- Quick crowdsource: 250 images
- Train model: 80-85% accuracy
- Deploy to beta testers

### Iteration 2: Expansion (Week 2)
- Collect 500+ additional images
- Focus on edge cases users report
- Retrain: 85-90% accuracy

### Iteration 3: Refinement (Month 2)
- Users send misclassified images
- Active learning: retrain with top 200 misclassifications
- Target: 90%+ accuracy

---

## Sources for Images

### Academic
- [ArXiv.org](https://arxiv.org) - Research papers (screenshot)
- [MIT OpenCourseWare](https://ocw.mit.edu) - Lecture slides (via Google search)
- [wikimedia commons](https://commons.wikimedia.org) - Educational diagrams
- [Google Scholar](https://scholar.google.com) - Papers & citations
- [GitHub](https://github.com) - Student projects & assignments
- Reddit: r/learnprogramming, r/HomeworkHelp

### Noise (Personal Photos)
- [Unsplash](https://unsplash.com) - High-quality photos
- [Pexels](https://pexels.com) - Diverse photo library
- [Everystockphoto](https://www.everystockphoto.com) - Creative Commons
- Your own phone camera roll (recommended)

### Tools
- **Batch download**: `bing-image-downloader`, `youtube-dl` (for screenshots)
- **Image conversion**: `imagemagick`, `ffmpeg`
- **Organization**: `exiftool` for batch renaming

---

## Ethical Considerations

- ✅ **Use your own photos** - authentic data
- ✅ **Get permission** - crowdsourced photos need consent
- ✅ **Use open licenses** - only CC0, CC-BY, CC-BY-SA
- ❌ **Don't scrape** without permission
- ❌ **Don't use people's photos** (privacy)
- ❌ **Don't use student IDs** in photos

When collecting from friends:
```
"I'm collecting photos for ML training to build Filox.
Do you consent to your photos being used for:
- Training an AI classifier
- Internal testing only
- Never shared publicly

Your photos will be deleted after model training."
```

---

## Quality Checklist

Before training, verify:

- [ ] All images open without errors
- [ ] No duplicate files
- [ ] ~300 academic images
- [ ] ~300 noise images
- [ ] ~100 current_semester images
- [ ] Mix of formats (JPG, PNG)
- [ ] Mix of qualities (some blurry, some clear)
- [ ] No watermarks on >90% of images
- [ ] Clear visual differences between categories
- [ ] No extremely large files (>10MB)
- [ ] Balanced distribution (within 10% of even split)

---

**Total time to collect 900 images: 1-3 days**  
**Time investment: Low-Medium**  
**Result: High-quality training data** ✅
