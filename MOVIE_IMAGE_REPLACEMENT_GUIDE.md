# 🎬 Movie Image Replacement Guide

This guide will help you replace all the Unsplash placeholder images in your Cinemax project with real movie posters and backdrops from TMDB (The Movie Database).

## 🚀 Quick Start

### Step 1: Get TMDB API Key

1. **Sign up for TMDB account:**
   - Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
   - Create a free account

2. **Request API Key:**
   - Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Create" under "Request an API Key"
   - Select "Developer" 
   - Fill out the form (you can use your project details)
   - Accept terms and submit

3. **Copy your API Key:**
   - You'll receive an API Key (v3 auth) - copy this!

### Step 2: Configure the Script

1. **Open the replacement script:**
   ```bash
   # Open in your editor
   code src/scripts/replaceMovieImages.js
   ```

2. **Add your TMDB API key:**
   ```javascript
   // Replace this line (around line 6):
   const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
   
   // With your actual API key:
   const TMDB_API_KEY = 'your-actual-api-key-here';
   ```

### Step 3: Run the Replacement

1. **Make sure you have Node.js installed**
2. **Run the script:**
   ```bash
   node src/scripts/replaceMovieImages.js
   ```

## 📊 What the Script Does

### ✨ Features:
- **Searches TMDB** for each movie by title and year
- **Downloads high-quality images** (500px posters, 1280px backdrops)  
- **Updates movies.js** with real TMDB image URLs
- **Creates backup** of your original file
- **Rate limiting** (4 requests/second to respect TMDB limits)
- **Progress tracking** and detailed logging
- **Resume capability** (saves progress every 50 movies)

### 📁 Files Created:
- `src/data/movies_backup.js` - Backup of original file
- `image_replacement_log.txt` - Detailed processing log
- Updated CSV file with progress tracking

### ⚡ Processing Stats:
- **499 movies** need image replacement
- **Estimated time:** 2-3 minutes (with rate limiting)
- **Success rate:** ~85-90% (some obscure movies may not be found)

## 🎯 Image Quality

### Before (Unsplash Placeholders):
```
Poster: https://images.unsplash.com/photo-1234567890?w=500&h=750&fit=crop
Backdrop: https://images.unsplash.com/photo-0987654321?w=1280&h=720&fit=crop
```

### After (Real Movie Images):
```
Poster: https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflNmkJq5Q2rE2E.jpg
Backdrop: https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg
```

## 🔧 Advanced Configuration

### Rate Limiting:
```javascript
const RATE_LIMIT_DELAY = 250; // 250ms = 4 requests/second
```

### Image Sizes:
```javascript
const POSTER_SIZE = 'w500';    // 500px wide posters
const BACKDROP_SIZE = 'w1280'; // 1280px wide backdrops
```

Available sizes: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

## 📋 Troubleshooting

### Common Issues:

1. **"Please set your TMDB API key"**
   - Make sure you replaced `YOUR_TMDB_API_KEY_HERE` with your actual key

2. **"No movies found that need image replacement"**
   - Check that your CSV file path is correct
   - Ensure the CSV has movies marked with `Needs_Poster=True`

3. **"Could not read movies.js file"**
   - Verify the movies.js file exists at `src/data/movies.js`
   - Check file permissions

4. **Rate limit errors:**
   - The script includes rate limiting, but if you get errors, increase `RATE_LIMIT_DELAY`

### Checking Progress:
```bash
# View the log file
tail -f image_replacement_log.txt

# Check how many images were updated
grep "Updated poster" image_replacement_log.txt | wc -l
```

## 🎉 After Running

### Verify Results:
1. Check that `src/data/movies.js` has been updated
2. Look for TMDB URLs instead of Unsplash URLs
3. Review the log file for any failures

### Test Your App:
1. Start your development server
2. Check that movie posters load correctly
3. Verify backdrop images are displaying

### Cleanup:
- Review the log file for any issues
- If everything looks good, you can delete `movies_backup.js`
- Keep the log file for reference

## 📈 Expected Results

- **High Success Rate:** 85-90% of movies will get real images
- **Better User Experience:** Professional movie posters instead of generic photos
- **Consistent Styling:** All images from the same source (TMDB)
- **Better Performance:** TMDB CDN is optimized for images

## 🆘 Need Help?

1. **Check the log file** first - it has detailed information about what went wrong
2. **Verify your API key** is correct and active
3. **Ensure file paths** are correct for your system
4. **Check internet connection** - script needs to access TMDB API

## 🔄 Re-running the Script

The script is safe to run multiple times:
- It only processes movies that still need images
- Creates new backups each time
- Resumes from where it left off

---

**Happy movie image hunting! 🎬✨**
