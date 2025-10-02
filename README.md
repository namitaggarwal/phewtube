# phewTube - YouTube-like Web Application

A complete front-end-only YouTube clone built with HTML5, CSS3, Bootstrap, jQuery, and vanilla JavaScript. This static web application closely matches YouTube's UI and provides a fully functional video platform experience without requiring a backend server.

## 🎯 Features

### Core Functionality
- **Home Feed**: Responsive video grid with thumbnails, titles, channel info, and view counts
- **Video Watch Page**: Full video player with comments, likes/dislikes, and suggested videos
- **Search**: Real-time search functionality across video titles, descriptions, and channels
- **Channel Pages**: Dedicated channel pages with video listings and channel information
- **Upload Interface**: Simulated video upload with form validation and progress tracking

### Interactive Features
- **Like/Dislike System**: Persistent like/dislike states using localStorage
- **Subscribe System**: Channel subscription management with localStorage persistence
- **Comments**: Add comments to videos (client-side only)
- **Watch History**: Automatic tracking of viewed videos
- **Watch Later**: Save videos for later viewing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Hash-based Routing**: Client-side navigation without page refreshes
- **Local Storage**: Persistent user preferences and interactions
- **Responsive UI**: Bootstrap-based responsive design matching YouTube's layout
- **Accessibility**: Semantic HTML5 and keyboard navigation support
- **Performance**: Lazy loading and optimized asset delivery

## 🚀 Quick Start

### Method 1: Direct File Opening
1. Download/clone this repository
2. Open `web/index.html` in your web browser
3. Start exploring the application!

### Method 2: Local Server (Recommended)
If you encounter CORS issues with video playback or want the best experience:

```bash
# Using Python 3
cd web
python -m http.server 8000

# Using Python 2
cd web
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
cd web
npx http-server -p 8000

# Using PHP
cd web
php -S localhost:8000
```

Then open: http://localhost:8000

## 📁 Project Structure

```
web/
├── index.html              # Main application file with all pages
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles matching YouTube UI
│   ├── js/
│   │   ├── data.js         # Sample video data and data management
│   │   └── app.js          # Main application logic and routing
│   └── img/
│       └── user-avatar.svg # User avatar placeholder
└── README.md               # This file
```

## 🎨 Design & UI

The application closely matches YouTube's current design:
- **Header**: Logo, search bar, and user menu
- **Sidebar**: Collapsible navigation with Home, Trending, Subscriptions, etc.
- **Video Grid**: Responsive card layout with hover effects
- **Watch Page**: Video player with suggested videos sidebar
- **Typography**: YouTube-like fonts and spacing
- **Colors**: YouTube's red theme and color palette

## 💾 Data Management

### Sample Data
The application includes 12 sample videos with:
- Realistic titles and descriptions
- Channel information with avatars
- View counts and upload dates
- Sample comments and replies
- Various categories (Music, Gaming, Education, etc.)

### Local Storage
User interactions are persisted using localStorage:
- Liked/disliked videos
- Subscribed channels
- Watch history
- Watch later list

### Data Structure
```javascript
// Video Object
{
    id: 'vid_001',
    title: 'Video Title',
    description: 'Video description...',
    channel: {
        id: 'ch_001',
        name: 'Channel Name',
        avatar: 'avatar-url',
        subscribers: '1M subscribers'
    },
    thumbnailUrl: 'thumbnail-url',
    videoUrl: 'video-url',
    views: 1000000,
    uploadedAt: '2024-01-15T10:30:00Z',
    duration: '12:34',
    category: 'education',
    likes: 45672,
    dislikes: 1234,
    comments: [...]
}
```

## 🔧 Technical Implementation

### Routing System
- Hash-based routing (`#/watch?v=videoId`)
- Browser back/forward button support
- Bookmarkable URLs

### Responsive Breakpoints
- **Desktop**: > 1024px (full sidebar)
- **Tablet**: 768px - 1024px (collapsible sidebar)
- **Mobile**: < 768px (overlay sidebar)

### Video Integration
Uses public domain videos from Google's sample collection:
- Big Buck Bunny
- Sintel
- Tears of Steel
- And other Creative Commons videos

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- HTML5 video element

## 🎮 Usage Guide

### Navigation
- **Home**: Browse all videos with sorting options (Latest, Most viewed, Trending)
- **Search**: Use the search bar to find videos by title, description, or channel
- **Watch**: Click any video to open the watch page
- **Subscribe**: Click subscribe buttons to follow channels
- **Like/Dislike**: Use thumbs up/down buttons on videos
- **Comments**: Add comments on the watch page

### Features Demo
1. **Browse Videos**: Start on the home page and browse the video grid
2. **Watch a Video**: Click any video thumbnail to start watching
3. **Interact**: Try liking, subscribing, and commenting
4. **Search**: Use the search bar to find specific content
5. **Upload**: Click the + icon to simulate uploading a video

### Mobile Experience
- Tap the hamburger menu to access the sidebar
- Use the mobile search icon for quick search access
- All features work on touch devices

## 🛠️ Customization

### Adding Videos
Edit `assets/js/data.js` to add more sample videos:

```javascript
SAMPLE_VIDEOS.push({
    id: 'vid_new',
    title: 'Your Video Title',
    // ... other properties
});
```

### Styling Changes
Modify `assets/css/styles.css` to customize:
- Color scheme (change CSS variables in `:root`)
- Layout spacing
- Component styling
- Responsive breakpoints

### Functionality Extensions
Extend `assets/js/app.js` to add:
- New page types
- Additional user interactions
- Enhanced search features
- More sophisticated routing

## 🎯 Limitations & Workarounds

### Static-Only Constraints
Since this is a front-end-only application:

**Video Upload**: 
- Limitation: No real file upload to server
- Workaround: Simulated upload with progress bar, adds entry to local data

**Video Storage**: 
- Limitation: Can't store user-uploaded videos
- Workaround: Uses placeholder URLs and sample videos

**User Authentication**: 
- Limitation: No real user accounts
- Workaround: Single simulated user with localStorage persistence

**Real-time Features**: 
- Limitation: No real-time comments or live data
- Workaround: Client-side comment system with local storage

### CORS Issues
If videos don't play when opening `index.html` directly:
- Use a local server (see Quick Start Method 2)
- Some browsers block local file video playback for security

## 🔍 Development Notes

### Code Organization
- **index.html**: Single-page application with all views
- **styles.css**: Organized by component with clear sections
- **data.js**: Centralized data management and utilities
- **app.js**: Event handling, routing, and UI updates

### Performance Considerations
- Lazy loading for video thumbnails
- Efficient DOM manipulation with jQuery
- Minimal external dependencies
- Optimized CSS with component-based organization

### Accessibility Features
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly structure
- Focus management for interactive elements

## 🚀 Future Enhancements

Potential improvements for a production version:
- Real backend integration
- User authentication system
- Video upload and processing
- Real-time comments and notifications
- Advanced search with filters
- Playlist management
- Video analytics
- Content moderation tools

## 📄 License

This project is created for educational and demonstration purposes. The sample videos used are from public domain sources. The UI design is inspired by YouTube but is an independent implementation.

## 🤝 Contributing

This is a demonstration project, but suggestions and improvements are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the browser console for error messages
- Ensure you're using a modern browser
- Try using a local server if videos don't play
- Verify all files are in the correct directory structure

---

**phewTube** - A complete YouTube-like experience in your browser! 🎬
