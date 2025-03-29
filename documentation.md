# Quran Explorer - Documentation

## Overview
Quran Explorer is a web application that allows users to read, listen to, and study the Quran. The application is built using HTML, CSS, and JavaScript, with data provided by the fawazahmed0/quran-api.

## Features
- Browse the Quran by Surah, Juz, or Page
- Read Arabic text with translations in multiple languages
- Listen to audio recitations of verses
- Search for specific words or phrases in the Quran
- Bookmark favorite verses for quick access
- Customize display settings (font size, Arabic font, theme)
- Responsive design for all device sizes

## Technical Implementation

### API Integration
The website uses the fawazahmed0/quran-api, which provides:
- Quran text in Arabic (Uthmani script)
- Translations in 90+ languages
- Audio recitations from popular reciters
- Metadata about surahs, juzs, and pages

API endpoints used:
- `/editions` - Lists all available editions
- `/editions/{editionName}` - Get the whole Quran/translation
- `/editions/{editionName}/{ChapterNo}` - Get a specific chapter
- `/editions/{editionName}/{ChapterNo}/{VerseNo}` - Get a specific verse

### Local Testing
For local testing without a server, the application includes a fallback mechanism that uses sample data when the API cannot be accessed due to CORS restrictions. This ensures the website can be demonstrated even in a local environment.

### File Structure
- `index.html` - Main HTML structure
- `css/styles.css` - CSS styling
- `js/app.js` - JavaScript functionality

### Browser Compatibility
The website is compatible with modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

### Responsive Design
The website uses a responsive design approach with:
- Flexible layouts using CSS Grid and Flexbox
- Mobile-first media queries
- Adjustable font sizes for better readability
- Collapsible sidebar for smaller screens

## User Guide

### Navigation
- Use the tabs in the sidebar to switch between Surah, Juz, and Page views
- Click on a Surah, Juz, or Page in the list to load it
- Use the navigation buttons in the reader header to move between surahs

### Reading
- Arabic text is displayed with proper right-to-left alignment
- Translations appear below each verse
- Verse numbers are shown for easy reference

### Audio
- Click the play button next to a verse to hear its recitation
- Use the audio player at the bottom to control playback
- Adjust playback speed using the dropdown menu

### Customization
- Toggle between light and dark mode using the moon/sun icon
- Change the Arabic font in the settings panel
- Select your preferred translation from the dropdown
- Adjust font size using the plus and minus buttons

### Bookmarks
- Click the bookmark icon next to a verse to save it
- Access your bookmarks from the bookmarks section in the sidebar
- Click on a bookmark to navigate directly to that verse

### Search
- Enter keywords in the search bar at the top
- Results will show verses containing the search terms
- Click "Go to verse" to navigate to a specific result

## Deployment
The website can be deployed to any web server or hosting service. Simply upload all files maintaining the directory structure.

## Future Enhancements
Potential future improvements include:
- Offline support using Service Workers
- User accounts for saving preferences across devices
- Advanced search with filters
- Tafsir (commentary) integration
- Social sharing features

## Credits
- Quran data provided by [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
