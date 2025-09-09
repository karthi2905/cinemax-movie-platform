# 🚀 Quick Start: Replace Movie Images

Replace all 499 placeholder images with real movie posters and backdrops in 3 easy steps!

## Step 1: Get TMDB API Key (2 minutes)

1. **Sign up:** [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. **Get API Key:** [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
3. **Copy your API Key** (looks like: `abcd1234efgh5678ijkl9012mnop3456`)

## Step 2: Configure (30 seconds)

Open `src/scripts/replaceMovieImages.js` and replace:
```javascript
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
```

With your actual key:
```javascript
const TMDB_API_KEY = 'abcd1234efgh5678ijkl9012mnop3456';
```

## Step 3: Run (2-3 minutes)

```bash
# Test first (recommended)
npm run test-tmdb

# Replace all images
npm run replace-images
```

## ✨ What Happens:

- **499 movies** get real posters and backdrops from TMDB
- **Automatic backup** of your original file
- **Progress tracking** every 50 movies
- **Detailed logs** of what was updated

## 🎯 Result:

**Before:**
```
poster: "https://images.unsplash.com/photo-1234567890?w=500&h=750&fit=crop"
```

**After:**
```
poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflNmkJq5Q2rE2E.jpg"
```

---

**Need help?** See `MOVIE_IMAGE_REPLACEMENT_GUIDE.md` for detailed instructions.
