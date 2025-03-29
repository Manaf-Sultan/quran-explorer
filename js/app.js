/**
 * Quran Explorer - Main JavaScript
 * Author: Quran Explorer Team
 * Description: JavaScript functionality for the Quran Explorer website
 * GitHub Pages Compatible Version
 */

// Configuration
const CONFIG = {
    // API endpoints that work with GitHub Pages (using CDN)
    API_BASE: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1',
    AUDIO_BASE: 'https://cdn.islamic.network/quran/audio/128',
    // Fallback to local data if API fails
    USE_FALLBACK: true,
    // Version for cache busting
    VERSION: '1.0.0',
    // Default settings
    DEFAULTS: {
        translation: 'en.asad',
        reciter: 'ar.alafasy',
        arabicFont: 'Amiri',
        fontSize: 'medium',
        darkMode: false
    }
};

// Global variables
let currentSurah = 1;
let currentAyah = 1;
let currentTranslation = 'en.asad';
let currentReciter = 'ar.alafasy';
let audioPlayer = null;
let surahs = [];
let bookmarks = [];
let isDarkMode = false;
let fontSize = 'medium';
let arabicFont = 'Amiri';
let useLocalData = true; // Set to true for local testing without API calls

// DOM Elements
const elements = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    cacheElements();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load settings from local storage
    loadSettings();
    
    // Initialize the application
    init();
});

// Cache DOM elements for better performance
function cacheElements() {
    elements.surahTab = document.getElementById('surah-tab');
    elements.juzTab = document.getElementById('juz-tab');
    elements.pageTab = document.getElementById('page-tab');
    elements.tabButtons = document.querySelectorAll('.tab-button');
    elements.surahList = document.querySelector('.surah-list');
    elements.juzList = document.querySelector('.juz-list');
    elements.pageList = document.querySelector('.page-list');
    elements.themeToggle = document.querySelector('.theme-toggle');
    elements.languageSelect = document.getElementById('language-select');
    elements.searchInput = document.getElementById('search-input');
    elements.searchButton = document.getElementById('search-button');
    elements.arabicFontSelect = document.getElementById('arabic-font');
    elements.translationSelect = document.getElementById('translation');
    elements.decreaseFontBtn = document.getElementById('decrease-font');
    elements.increaseFontBtn = document.getElementById('increase-font');
    elements.fontSizeValue = document.getElementById('font-size-value');
    elements.reciterSelect = document.getElementById('reciter');
    elements.bookmarksList = document.querySelector('.bookmarks-list');
    elements.surahNameArabic = document.getElementById('surah-name-arabic');
    elements.surahNameEnglish = document.getElementById('surah-name-english');
    elements.verseCount = document.getElementById('verse-count');
    elements.revelationType = document.getElementById('revelation-type');
    elements.previousSurahBtn = document.getElementById('previous-surah');
    elements.playSurahBtn = document.getElementById('play-surah');
    elements.nextSurahBtn = document.getElementById('next-surah');
    elements.versesContainer = document.querySelector('.verses-container');
    elements.audioPlayBtn = document.getElementById('audio-play');
    elements.audioPrevBtn = document.getElementById('audio-prev');
    elements.audioNextBtn = document.getElementById('audio-next');
    elements.progressFill = document.querySelector('.progress-fill');
    elements.currentTime = document.getElementById('current-time');
    elements.totalTime = document.getElementById('total-time');
    elements.audioRepeatBtn = document.getElementById('audio-repeat');
    elements.playbackSpeedSelect = document.getElementById('playback-speed');
    elements.audioVolumeBtn = document.getElementById('audio-volume');
}

// Initialize event listeners
function initEventListeners() {
    // Tab navigation
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Font size controls
    elements.decreaseFontBtn.addEventListener('click', decreaseFontSize);
    elements.increaseFontBtn.addEventListener('click', increaseFontSize);
    
    // Surah navigation
    elements.previousSurahBtn.addEventListener('click', () => navigateSurah(currentSurah - 1));
    elements.nextSurahBtn.addEventListener('click', () => navigateSurah(currentSurah + 1));
    elements.playSurahBtn.addEventListener('click', toggleSurahPlayback);
    
    // Audio controls
    elements.audioPlayBtn.addEventListener('click', toggleAudioPlayback);
    elements.audioPrevBtn.addEventListener('click', playPreviousAyah);
    elements.audioNextBtn.addEventListener('click', playNextAyah);
    elements.audioRepeatBtn.addEventListener('click', toggleRepeat);
    elements.playbackSpeedSelect.addEventListener('change', changePlaybackSpeed);
    elements.audioVolumeBtn.addEventListener('click', toggleMute);
    
    // Settings changes
    elements.arabicFontSelect.addEventListener('change', changeArabicFont);
    elements.translationSelect.addEventListener('change', changeTranslation);
    elements.reciterSelect.addEventListener('change', changeReciter);
    
    // Search
    elements.searchButton.addEventListener('click', performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize the application
async function init() {
    try {
        // Fetch Quran metadata
        await fetchQuranMetadata();
        
        // Load bookmarks from local storage
        loadBookmarks();
        
        // Load the first surah by default
        await loadSurah(currentSurah);
        
        // Initialize audio player
        initAudioPlayer();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize the application. Please try again later.');
        
        // Fallback to local data
        useLocalData = true;
        loadLocalData();
    }
}

// Load local data for testing
function loadLocalData() {
    // Sample surah data
    surahs = [
        { chapter: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', versesCount: 7, revelationType: 'Meccan' },
        { chapter: 2, name: 'البقرة', englishName: 'Al-Baqarah', versesCount: 286, revelationType: 'Medinan' },
        { chapter: 3, name: 'آل عمران', englishName: 'Aal-Imran', versesCount: 200, revelationType: 'Medinan' },
        { chapter: 4, name: 'النساء', englishName: 'An-Nisa', versesCount: 176, revelationType: 'Medinan' },
        { chapter: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', versesCount: 120, revelationType: 'Medinan' }
    ];
    
    // Populate surah list
    populateSurahList();
    
    // Load sample surah
    loadSampleSurah();
}

// Load sample surah for testing
function loadSampleSurah() {
    // Sample verses for Al-Fatihah
    const arabicVerses = [
        { verse: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
        { verse: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
        { verse: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ' },
        { verse: 4, text: 'مَالِكِ يَوْمِ الدِّينِ' },
        { verse: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
        { verse: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
        { verse: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' }
    ];
    
    const translationVerses = [
        { verse: 1, text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
        { verse: 2, text: 'All praise is due to Allah, Lord of the worlds.' },
        { verse: 3, text: 'The Entirely Merciful, the Especially Merciful.' },
        { verse: 4, text: 'Sovereign of the Day of Recompense.' },
        { verse: 5, text: 'It is You we worship and You we ask for help.' },
        { verse: 6, text: 'Guide us to the straight path.' },
        { verse: 7, text: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' }
    ];
    
    // Update surah header
    const surah = surahs.find(s => s.chapter === currentSurah);
    elements.surahNameArabic.textContent = surah.name;
    elements.surahNameEnglish.textContent = surah.englishName;
    elements.verseCount.textContent = surah.versesCount;
    elements.revelationType.textContent = surah.revelationType;
    
    // Render verses
    renderVerses(arabicVerses, translationVerses);
}

// Load settings from local storage
function loadSettings() {
    // Load theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Load font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        fontSize = savedFontSize;
        elements.fontSizeValue.textContent = getFontSizeLabel(fontSize);
        document.documentElement.style.setProperty('--font-size-arabic', getFontSizeValue(fontSize));
    }
    
    // Load Arabic font preference
    const savedArabicFont = localStorage.getItem('arabicFont');
    if (savedArabicFont) {
        arabicFont = savedArabicFont;
        elements.arabicFontSelect.value = arabicFont;
        document.documentElement.style.setProperty('--arabic-font', `'${arabicFont}', serif`);
    }
    
    // Load translation preference
    const savedTranslation = localStorage.getItem('translation');
    if (savedTranslation) {
        currentTranslation = savedTranslation;
        elements.translationSelect.value = currentTranslation;
    }
    
    // Load reciter preference
    const savedReciter = localStorage.getItem('reciter');
    if (savedReciter) {
        currentReciter = savedReciter;
        elements.reciterSelect.value = currentReciter;
    }
}

// Load bookmarks from local storage
function loadBookmarks() {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
        bookmarks = JSON.parse(savedBookmarks);
        renderBookmarks();
    }
}

// Save bookmarks to local storage
function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Render bookmarks in the sidebar
function renderBookmarks() {
    if (bookmarks.length === 0) {
        elements.bookmarksList.innerHTML = '<p class="empty-message">No bookmarks yet.</p>';
        return;
    }
    
    let html = '';
    bookmarks.forEach(bookmark => {
        html += `
            <div class="bookmark-item" data-surah="${bookmark.surah}" data-ayah="${bookmark.ayah}">
                <div class="bookmark-info">
                    <span class="bookmark-surah">${bookmark.surahName}</span>
                    <span class="bookmark-ayah">Ayah ${bookmark.ayah}</span>
                </div>
                <button class="remove-bookmark" data-surah="${bookmark.surah}" data-ayah="${bookmark.ayah}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    elements.bookmarksList.innerHTML = html;
    
    // Add event listeners to bookmark items
    document.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-bookmark')) {
                const surah = parseInt(item.getAttribute('data-surah'));
                const ayah = parseInt(item.getAttribute('data-ayah'));
                navigateToAyah(surah, ayah);
            }
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-bookmark').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const surah = parseInt(button.getAttribute('data-surah'));
            const ayah = parseInt(button.getAttribute('data-ayah'));
            removeBookmark(surah, ayah);
        });
    });
}

// Add a bookmark
function addBookmark(surah, ayah, surahName) {
    // Check if bookmark already exists
    const exists = bookmarks.some(b => b.surah === surah && b.ayah === ayah);
    if (!exists) {
        bookmarks.push({ surah, ayah, surahName });
        saveBookmarks();
        renderBookmarks();
        showNotification('Bookmark added');
    }
}

// Remove a bookmark
function removeBookmark(surah, ayah) {
    bookmarks = bookmarks.filter(b => !(b.surah === surah && b.ayah === ayah));
    saveBookmarks();
    renderBookmarks();
    
    // Update bookmark icon in the verse
    const bookmarkButton = document.querySelector(`.verse-item[data-surah="${surah}"][data-ayah="${ayah}"] .bookmark-verse`);
    if (bookmarkButton) {
        bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i>';
    }
    
    showNotification('Bookmark removed');
}

// Fetch Quran metadata
async function fetchQuranMetadata() {
    try {
        if (useLocalData) {
            loadLocalData();
            return;
        }
        
        const url = `${CONFIG.API_BASE}/info.json?v=${CONFIG.VERSION}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store surahs data
        surahs = data.chapters;
        
        // Populate surah list
        populateSurahList();
        
        // Populate juz list
        populateJuzList(data.juzs);
        
        // Populate page list
        populatePageList(data.pages);
        
    } catch (error) {
        console.error('Error fetching Quran metadata:', error);
        showError('Failed to load Quran data. Falling back to local data.');
        useLocalData = true;
        loadLocalData();
    }
}

// Populate surah list in the sidebar
function populateSurahList() {
    let html = '';
    surahs.forEach(surah => {
        html += `
            <div class="surah-item" data-surah="${surah.chapter}">
                <span class="surah-number">${surah.chapter}</span>
                <div class="surah-name">
                    <span class="arabic">${surah.name}</span>
                    <span class="english">${surah.englishName}</span>
                </div>
                <span class="verse-count">${surah.versesCount} verses</span>
            </div>
        `;
    });
    
    elements.surahList.innerHTML = html;
    
    // Add event listeners to surah items
    document.querySelectorAll('.surah-item').forEach(item => {
        item.addEventListener('click', () => {
            const surah = parseInt(item.getAttribute('data-surah'));
            navigateSurah(surah);
        });
    });
}

// Populate juz list in the sidebar
function populateJuzList(juzs) {
    if (!juzs) {
        elements.juzList.innerHTML = '<p class="empty-message">Juz data not available in offline mode.</p>';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= 30; i++) {
        const juz = juzs[i] || { verse: { start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 7 } } };
        html += `
            <div class="juz-item" data-juz="${i}">
                <span class="juz-number">${i}</span>
                <div class="juz-range">
                    <span>Surah ${juz.verse.start.chapter}:${juz.verse.start.verse} to ${juz.verse.end.chapter}:${juz.verse.end.verse}</span>
                </div>
            </div>
        `;
    }
    
    elements.juzList.innerHTML = html;
    
    // Add event listeners to juz items
    document.querySelectorAll('.juz-item').forEach(item => {
        item.addEventListener('click', () => {
            const juz = parseInt(item.getAttribute('data-juz'));
            loadJuz(juz);
        });
    });
}

// Populate page list in the sidebar
function populatePageList(pages) {
    if (!pages) {
        elements.pageList.innerHTML = '<p class="empty-message">Page data not available in offline mode.</p>';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= 604; i++) {
        const page = pages[i] || { verse: { start: { chapter: 1, verse: 1 }, end: { chapter: 1, verse: 7 } } };
        html += `
            <div class="page-item" data-page="${i}">
                <span class="page-number">${i}</span>
                <div class="page-range">
                    <span>Surah ${page.verse.start.chapter}:${page.verse.start.verse} to ${page.verse.end.chapter}:${page.verse.end.verse}</span>
                </div>
            </div>
        `;
    }
    
    elements.pageList.innerHTML = html;
    
    // Add event listeners to page items
    document.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = parseInt(item.getAttribute('data-page'));
            loadPage(page);
        });
    });
}

// Load a specific surah
async function loadSurah(surahNumber) {
    if (surahNumber < 1 || surahNumber > 114) {
        return;
    }
    
    try {
        // Update current surah
        currentSurah = surahNumber;
        
        // Show loading state
        elements.versesContainer.innerHTML = '<div class="loading">Loading surah...</div>';
        
        if (useLocalData) {
            loadSampleSurah();
            return;
        }
        
        // Fetch surah data
        const arabicUrl = `${CONFIG.API_BASE}/editions/quran-uthmani/${surahNumber}.json?v=${CONFIG.VERSION}`;
        const translationUrl = `${CONFIG.API_BASE}/editions/${currentTranslation}/${surahNumber}.json?v=${CONFIG.VERSION}`;
        
        const [arabicResponse, translationResponse] = await Promise.all([
            fetch(arabicUrl),
            fetch(translationUrl)
        ]);
        
        if (!arabicResponse.ok || !translationResponse.ok) {
            throw new Error('Failed to fetch surah data');
        }
        
        const arabicData = await arabicResponse.json();
        const translationData = await translationResponse.json();
        
        // Update surah header
        const surah = surahs.find(s => s.chapter === surahNumber);
        elements.surahNameArabic.textContent = surah.name;
        elements.surahNameEnglish.textContent = surah.englishName;
        elements.verseCount.textContent = surah.versesCount;
        elements.revelationType.textContent = surah.revelationType;
        
        // Render verses
        renderVerses(arabicData.chapter.verses, translationData.chapter.verses);
        
        // Highlight current surah in the list
        document.querySelectorAll('.surah-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.getAttribute('data-surah')) === surahNumber) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
    } catch (error) {
        console.error('Error loading surah:', error);
        showError('Failed to load surah. Falling back to sample data.');
        useLocalData = true;
        loadSampleSurah();
    }
}

// Render verses in the content area
function renderVerses(arabicVerses, translationVerses) {
    let html = '';
    
    // Show bismillah except for Surah 1 and 9
    if (currentSurah !== 1 && currentSurah !== 9) {
        html += `
            <div class="bismillah">
                <p class="arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
        `;
    }
    
    html += '<div class="verses-container">';
    
    arabicVerses.forEach((verse, index) => {
        const verseNumber = verse.verse || index + 1;
        const translationVerse = translationVerses[index];
        const isBookmarked = bookmarks.some(b => b.surah === currentSurah && b.ayah === verseNumber);
        
        html += `
            <div class="verse-item" data-surah="${currentSurah}" data-ayah="${verseNumber}">
                <div class="verse-header">
                    <span class="verse-number">${verseNumber}</span>
                    <div class="verse-actions">
                        <button class="play-verse" data-surah="${currentSurah}" data-ayah="${verseNumber}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="bookmark-verse" data-surah="${currentSurah}" data-ayah="${verseNumber}">
                            <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                        </button>
                        <button class="share-verse" data-surah="${currentSurah}" data-ayah="${verseNumber}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <p class="arabic-text">${verse.text}</p>
                <p class="translation-text">${translationVerse.text}</p>
            </div>
        `;
    });
    
    html += '</div>';
    
    elements.versesContainer.innerHTML = html;
    
    // Add event listeners to verse actions
    document.querySelectorAll('.play-verse').forEach(button => {
        button.addEventListener('click', () => {
            const surah = parseInt(button.getAttribute('data-surah'));
            const ayah = parseInt(button.getAttribute('data-ayah'));
            playAyah(surah, ayah);
        });
    });
    
    document.querySelectorAll('.bookmark-verse').forEach(button => {
        button.addEventListener('click', () => {
            const surah = parseInt(button.getAttribute('data-surah'));
            const ayah = parseInt(button.getAttribute('data-ayah'));
            const surahName = `${surahs.find(s => s.chapter === surah).englishName}`;
            
            if (bookmarks.some(b => b.surah === surah && b.ayah === ayah)) {
                removeBookmark(surah, ayah);
                button.innerHTML = '<i class="far fa-bookmark"></i>';
            } else {
                addBookmark(surah, ayah, surahName);
                button.innerHTML = '<i class="fas fa-bookmark"></i>';
            }
        });
    });
    
    document.querySelectorAll('.share-verse').forEach(button => {
        button.addEventListener('click', () => {
            const surah = parseInt(button.getAttribute('data-surah'));
            const ayah = parseInt(button.getAttribute('data-ayah'));
            shareAyah(surah, ayah);
        });
    });
}

// Navigate to a specific surah
function navigateSurah(surahNumber) {
    if (surahNumber < 1 || surahNumber > 114) {
        return;
    }
    
    loadSurah(surahNumber);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to a specific ayah
function navigateToAyah(surah, ayah) {
    if (currentSurah !== surah) {
        loadSurah(surah).then(() => {
            scrollToAyah(ayah);
        });
    } else {
        scrollToAyah(ayah);
    }
}

// Scroll to a specific ayah
function scrollToAyah(ayah) {
    const verseElement = document.querySelector(`.verse-item[data-surah="${currentSurah}"][data-ayah="${ayah}"]`);
    if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        verseElement.classList.add('highlight');
        setTimeout(() => {
            verseElement.classList.remove('highlight');
        }, 2000);
    }
}

// Load a specific juz
async function loadJuz(juzNumber) {
    if (juzNumber < 1 || juzNumber > 30) {
        return;
    }
    
    if (useLocalData) {
        showNotification('Juz navigation is not available in offline mode');
        return;
    }
    
    try {
        // Show loading state
        elements.versesContainer.innerHTML = '<div class="loading">Loading juz...</div>';
        
        // Fetch juz data
        const response = await fetch(`${CONFIG.API_BASE}/info.json?v=${CONFIG.VERSION}`);
        const data = await response.json();
        
        const juz = data.juzs[juzNumber];
        const startSurah = juz.verse.start.chapter;
        const startVerse = juz.verse.start.verse;
        
        // Load the starting surah
        await loadSurah(startSurah);
        
        // Scroll to the starting verse
        scrollToAyah(startVerse);
        
        // Highlight current juz in the list
        document.querySelectorAll('.juz-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.getAttribute('data-juz')) === juzNumber) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
    } catch (error) {
        console.error('Error loading juz:', error);
        showError('Failed to load juz. Please try again later.');
    }
}

// Load a specific page
async function loadPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > 604) {
        return;
    }
    
    if (useLocalData) {
        showNotification('Page navigation is not available in offline mode');
        return;
    }
    
    try {
        // Show loading state
        elements.versesContainer.innerHTML = '<div class="loading">Loading page...</div>';
        
        // Fetch page data
        const response = await fetch(`${CONFIG.API_BASE}/info.json?v=${CONFIG.VERSION}`);
        const data = await response.json();
        
        const page = data.pages[pageNumber];
        const startSurah = page.verse.start.chapter;
        const startVerse = page.verse.start.verse;
        
        // Load the starting surah
        await loadSurah(startSurah);
        
        // Scroll to the starting verse
        scrollToAyah(startVerse);
        
        // Highlight current page in the list
        document.querySelectorAll('.page-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.getAttribute('data-page')) === pageNumber) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
    } catch (error) {
        console.error('Error loading page:', error);
        showError('Failed to load page. Please try again later.');
    }
}

// Initialize audio player
function initAudioPlayer() {
    audioPlayer = new Audio();
    
    // Audio events
    audioPlayer.addEventListener('timeupdate', updateAudioProgress);
    audioPlayer.addEventListener('ended', handleAudioEnded);
    audioPlayer.addEventListener('canplay', () => {
        elements.totalTime.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('error', () => {
        showError('Failed to load audio. Please try again later.');
    });
}

// Play a specific ayah
function playAyah(surah, ayah) {
    // Update current ayah
    currentAyah = ayah;
    
    // Construct audio URL
    const reciterCode = currentReciter.split('.')[1];
    const audioUrl = `${CONFIG.AUDIO_BASE}/${reciterCode}/${surah}/${ayah}.mp3`;
    
    // Set audio source
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    
    // Play audio
    audioPlayer.play()
        .then(() => {
            // Update play button icon
            elements.audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Highlight current verse
            highlightCurrentVerse();
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            showError('Failed to play audio. Please try again later.');
        });
}

// Toggle audio playback
function toggleAudioPlayback() {
    if (audioPlayer.paused) {
        audioPlayer.play()
            .then(() => {
                elements.audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                showError('Failed to play audio. Please try again later.');
            });
    } else {
        audioPlayer.pause();
        elements.audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Toggle surah playback
function toggleSurahPlayback() {
    if (audioPlayer.paused) {
        // Start playing from the first verse
        playAyah(currentSurah, 1);
        elements.playSurahBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        elements.playSurahBtn.innerHTML = '<i class="fas fa-play"></i>';
        elements.audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Play previous ayah
function playPreviousAyah() {
    if (currentAyah > 1) {
        playAyah(currentSurah, currentAyah - 1);
    } else if (currentSurah > 1) {
        const previousSurah = currentSurah - 1;
        const previousSurahVerseCount = surahs.find(s => s.chapter === previousSurah).versesCount;
        loadSurah(previousSurah).then(() => {
            playAyah(previousSurah, previousSurahVerseCount);
        });
    }
}

// Play next ayah
function playNextAyah() {
    const currentSurahVerseCount = surahs.find(s => s.chapter === currentSurah).versesCount;
    
    if (currentAyah < currentSurahVerseCount) {
        playAyah(currentSurah, currentAyah + 1);
    } else if (currentSurah < 114) {
        const nextSurah = currentSurah + 1;
        loadSurah(nextSurah).then(() => {
            playAyah(nextSurah, 1);
        });
    }
}

// Handle audio ended event
function handleAudioEnded() {
    // Reset play button icon
    elements.audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Check if repeat is enabled
    if (elements.audioRepeatBtn.classList.contains('active')) {
        // Replay the current ayah
        playAyah(currentSurah, currentAyah);
    } else {
        // Play next ayah
        playNextAyah();
    }
}

// Update audio progress
function updateAudioProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentTime.textContent = formatTime(audioPlayer.currentTime);
}

// Format time in MM:SS format
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Toggle repeat mode
function toggleRepeat() {
    elements.audioRepeatBtn.classList.toggle('active');
}

// Change playback speed
function changePlaybackSpeed() {
    const speed = parseFloat(elements.playbackSpeedSelect.value);
    audioPlayer.playbackRate = speed;
}

// Toggle mute
function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    elements.audioVolumeBtn.innerHTML = audioPlayer.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

// Highlight current verse being played
function highlightCurrentVerse() {
    // Remove highlight from all verses
    document.querySelectorAll('.verse-item').forEach(item => {
        item.classList.remove('playing');
    });
    
    // Add highlight to current verse
    const currentVerse = document.querySelector(`.verse-item[data-surah="${currentSurah}"][data-ayah="${currentAyah}"]`);
    if (currentVerse) {
        currentVerse.classList.add('playing');
        currentVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Switch between tabs
function switchTab(tab) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show selected tab content
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
    
    // Update active tab button
    elements.tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-tab') === tab) {
            button.classList.add('active');
        }
    });
}

// Toggle theme (light/dark mode)
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    elements.themeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    // Save preference to local storage
    localStorage.setItem('darkMode', isDarkMode);
}

// Change Arabic font
function changeArabicFont() {
    arabicFont = elements.arabicFontSelect.value;
    document.documentElement.style.setProperty('--arabic-font', `'${arabicFont}', serif`);
    
    // Save preference to local storage
    localStorage.setItem('arabicFont', arabicFont);
}

// Change translation
function changeTranslation() {
    currentTranslation = elements.translationSelect.value;
    
    // Reload current surah with new translation
    loadSurah(currentSurah);
    
    // Save preference to local storage
    localStorage.setItem('translation', currentTranslation);
}

// Change reciter
function changeReciter() {
    currentReciter = elements.reciterSelect.value;
    
    // Save preference to local storage
    localStorage.setItem('reciter', currentReciter);
}

// Decrease font size
function decreaseFontSize() {
    const sizes = ['smallest', 'smaller', 'small', 'medium', 'large', 'larger', 'largest'];
    const currentIndex = sizes.indexOf(fontSize);
    
    if (currentIndex > 0) {
        fontSize = sizes[currentIndex - 1];
        updateFontSize();
    }
}

// Increase font size
function increaseFontSize() {
    const sizes = ['smallest', 'smaller', 'small', 'medium', 'large', 'larger', 'largest'];
    const currentIndex = sizes.indexOf(fontSize);
    
    if (currentIndex < sizes.length - 1) {
        fontSize = sizes[currentIndex + 1];
        updateFontSize();
    }
}

// Update font size
function updateFontSize() {
    elements.fontSizeValue.textContent = getFontSizeLabel(fontSize);
    document.documentElement.style.setProperty('--font-size-arabic', getFontSizeValue(fontSize));
    
    // Save preference to local storage
    localStorage.setItem('fontSize', fontSize);
}

// Get font size label
function getFontSizeLabel(size) {
    const labels = {
        'smallest': 'Smallest',
        'smaller': 'Smaller',
        'small': 'Small',
        'medium': 'Medium',
        'large': 'Large',
        'larger': 'Larger',
        'largest': 'Largest'
    };
    
    return labels[size] || 'Medium';
}

// Get font size value
function getFontSizeValue(size) {
    const values = {
        'smallest': '1.25rem',
        'smaller': '1.5rem',
        'small': '1.75rem',
        'medium': '2rem',
        'large': '2.25rem',
        'larger': '2.5rem',
        'largest': '2.75rem'
    };
    
    return values[size] || '2rem';
}

// Perform search
async function performSearch() {
    const query = elements.searchInput.value.trim();
    
    if (!query) {
        return;
    }
    
    if (useLocalData) {
        showNotification('Search is not available in offline mode');
        return;
    }
    
    try {
        // Show loading state
        elements.versesContainer.innerHTML = '<div class="loading">Searching...</div>';
        
        // Fetch search results
        // Note: Since the API doesn't have a direct search endpoint, we'll implement a client-side search
        // by loading all translations and filtering them
        
        const response = await fetch(`${CONFIG.API_BASE}/editions/${currentTranslation}.json?v=${CONFIG.VERSION}`);
        const data = await response.json();
        
        // Filter verses that contain the search query
        const results = [];
        
        data.quran.forEach(surah => {
            surah.verses.forEach(verse => {
                if (verse.text.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        surah: surah.chapter,
                        ayah: verse.verse,
                        text: verse.text,
                        surahName: surahs.find(s => s.chapter === surah.chapter).englishName
                    });
                }
            });
        });
        
        // Render search results
        renderSearchResults(query, results);
        
    } catch (error) {
        console.error('Error performing search:', error);
        showError('Failed to perform search. Please try again later.');
    }
}

// Render search results
function renderSearchResults(query, results) {
    if (results.length === 0) {
        elements.versesContainer.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
        return;
    }
    
    let html = `
        <div class="search-results">
            <h2>Search Results for "${query}"</h2>
            <p>${results.length} results found</p>
            <div class="results-list">
    `;
    
    results.forEach(result => {
        html += `
            <div class="result-item" data-surah="${result.surah}" data-ayah="${result.ayah}">
                <div class="result-header">
                    <span class="result-location">${result.surahName} ${result.ayah}</span>
                    <button class="go-to-verse" data-surah="${result.surah}" data-ayah="${result.ayah}">
                        <i class="fas fa-arrow-right"></i> Go to verse
                    </button>
                </div>
                <p class="result-text">${result.text}</p>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    elements.versesContainer.innerHTML = html;
    
    // Add event listeners to result items
    document.querySelectorAll('.go-to-verse').forEach(button => {
        button.addEventListener('click', () => {
            const surah = parseInt(button.getAttribute('data-surah'));
            const ayah = parseInt(button.getAttribute('data-ayah'));
            navigateToAyah(surah, ayah);
        });
    });
}

// Share ayah
function shareAyah(surah, ayah) {
    const verseElement = document.querySelector(`.verse-item[data-surah="${surah}"][data-ayah="${ayah}"]`);
    
    if (!verseElement) {
        return;
    }
    
    const arabicText = verseElement.querySelector('.arabic-text').textContent;
    const translationText = verseElement.querySelector('.translation-text').textContent;
    const surahName = surahs.find(s => s.chapter === surah).englishName;
    
    const shareText = `${arabicText}\n\n${translationText}\n\n- Quran ${surahName} ${ayah}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: `Quran ${surahName} ${ayah}`,
            text: shareText,
            url: window.location.href
        })
        .catch(error => {
            console.error('Error sharing:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback share method (copy to clipboard)
function fallbackShare(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
    
    // Show notification
    showNotification('Copied to clipboard');
}

// Show notification
function showNotification(message) {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = 'var(--primary-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show error message
function showError(message) {
    showNotification(`Error: ${message}`);
}
