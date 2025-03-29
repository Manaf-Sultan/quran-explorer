# Quran API Comparison

## AlQuran.cloud API

### Features
- Free to use
- HTTP GET method with JSON responses
- Multiple endpoints for different Quran content retrieval
- Text and audio editions available

### Endpoints
- GET Edition - Available text and audio editions
- GET Quran - Get a complete Quran edition
- GET Juz - Get a Juz of the Quran
- GET Surah - Get a Surah of the Quran
- GET Ayah - Get an Ayah of the Quran
- GET Search - Search the text of the Quran
- GET Manzil - Get a Manzil of the Quran
- GET Ruku - Get a Ruku of the Quran
- GET Page - Get a Page of the Quran
- GET Hizb Quarter - Get a Hizb Quarter of the Quran
- GET Sajda - Get all verses requiring Sajda/Prostration
- GET Meta - Get meta data about Surahs, Pages, Hizbs and Juzs

### Example URLs
- http://api.alquran.cloud/v1/edition
- http://api.alquran.cloud/v1/quran/en.asad
- http://api.alquran.cloud/v1/quran/quran-uthmani

### Pros
- Well-documented API
- Comprehensive endpoints for different Quran divisions
- Supports both text and audio editions
- Search functionality

## fawazahmed0/quran-api

### Features
- Free & Blazing Fast response (CDN-based)
- No Rate limits
- 90+ languages & 440+ Translations including Latin/roman translations

### Endpoints
- /editions - Lists all available editions
- /editions/{editionName} - Get the whole Quran/translation
- /editions/{editionName}/{ChapterNo} - Get a specific chapter
- /editions/{editionName}/{ChapterNo}/{VerseNo} - Get a specific verse
- /editions/{editionName}/juzs/{juzNo} - Get a specific juz
- /editions/{editionName}/rukus/{rukuNo} - Get a specific ruku
- /editions/{editionName}/pages/{pageNo} - Get a specific page
- /editions/{editionName}/manzils/{manzilNo} - Get a specific manzil
- /editions/{editionName}/maqras/{maqraNo} - Get a specific maqra
- /info - Get all details about Quran structure
- /fonts - Lists available Arabic fonts

### Example URLs
- https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions.json
- https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan.json
- https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ben-muhiuddinkhan-la/5.json

### Pros
- Extensive language support (90+ languages)
- Large collection of translations (440+)
- Latin/Roman script versions available
- CDN-based for fast response
- No rate limits
- Font resources included

## Recommendation

Based on the evaluation of both APIs, **fawazahmed0/quran-api** appears to be the better choice for our Quran website project for the following reasons:

1. **Extensive language support**: With 90+ languages and 440+ translations, it provides much broader accessibility for users worldwide.

2. **No rate limits**: This ensures our website can handle any amount of traffic without API restrictions.

3. **CDN-based delivery**: Using jsDelivr CDN ensures fast response times globally.

4. **Latin/Roman script options**: Provides transliteration options which makes the Quran accessible to those who cannot read Arabic script.

5. **Font resources**: Includes Arabic font resources which will help with proper display of Arabic text.

6. **Simple implementation**: The URL structure is straightforward and easy to implement in JavaScript.

The AlQuran.cloud API is also a good option with comprehensive endpoints, but the fawazahmed0/quran-api offers more translations and better performance characteristics for our needs.
