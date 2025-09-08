# 🎬 CineMax - Modern Movie Streaming Platform

A beautiful, responsive movie streaming platform built with React, Vite, and Tailwind CSS. Browse movies, view detailed information, get personalized recommendations, and manage your watchlist.

![CineMax Preview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=CineMax+Movie+Platform)

## ✨ Features

- **🎯 Dynamic Movie Details**: Each movie card navigates to its unique detail page
- **🔍 Advanced Search**: Search movies by title, director, cast, or genre  
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, cinema-inspired design with smooth animations
- **⭐ Rating System**: Rate movies and see aggregated ratings
- **📚 Watchlist Management**: Add/remove movies from your personal watchlist
- **🎭 Genre Filtering**: Browse movies by different genres
- **🔥 Trending Movies**: Discover what's popular and highly-rated
- **🤖 Smart Recommendations**: Get personalized movie suggestions
- **🎪 Hero Carousel**: Featured movies with auto-rotating showcase

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router v6 for navigation
- **Icons**: Lucide React icons
- **State Management**: React useState and useEffect
- **Data**: Local JSON database with 50+ curated movies

## 🚀 Live Demo

**🌐 [View Live Site](YOUR_NETLIFY_URL_WILL_GO_HERE)**

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cinemax-movie-platform.git
   cd cinemax-movie-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
cinemax/
├── public/
│   ├── assets/images/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── AppIcon.jsx
│   │   └── AppImage.jsx
│   ├── pages/
│   │   ├── home-dashboard/
│   │   ├── movie-details/
│   │   ├── movie-browse/
│   │   ├── search-results/
│   │   ├── login/
│   │   └── register/
│   ├── data/
│   │   ├── movies.js      # Movie database
│   │   └── movieUtils.js  # Helper functions
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│   ├── utils/
│   ├── App.jsx
│   ├── Routes.jsx
│   └── index.jsx
├── package.json
├── vite.config.mjs
└── tailwind.config.js
```

## 🎨 Key Components

### Movie Details Navigation
- **Dynamic Routing**: `/movie-details/:id` for unique movie pages
- **Real Data Integration**: Uses comprehensive movie database
- **Similar Movies**: Smart recommendation algorithm

### Movie Database
- 50+ carefully curated movies with complete metadata
- High-quality poster and backdrop images
- Detailed cast, crew, and production information
- Genre classification and ratings

### Search & Discovery
- **Multi-field Search**: Title, director, cast, synopsis
- **Genre Filtering**: Action, Drama, Sci-Fi, Horror, etc.
- **Smart Sorting**: By rating, year, popularity
- **Trending Algorithm**: Weighted scoring system

## 🚢 Deployment

### Netlify (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Deploy!

### Manual Deployment
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Movie data inspired by popular cinema databases
- Images sourced from Unsplash and TMDB
- Icons from Lucide React
- Built with modern React best practices

## 📞 Contact

**Developer**: CineMax Team
**Email**: developer@cinemax.com
**Project Link**: https://github.com/yourusername/cinemax-movie-platform

---

⭐ **Star this repo if you found it helpful!** ⭐


