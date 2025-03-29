# GitHub Pages Deployment Guide for Quran Explorer

This guide will help you deploy the Quran Explorer website to GitHub Pages so it will be 100% functional.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "quran-explorer")
4. Make sure the repository is set to "Public"
5. Click "Create repository"

## Step 2: Upload the Website Files

### Option 1: Using GitHub Web Interface

1. In your new repository, click on "uploading an existing file"
2. Drag and drop all the files and folders from the extracted zip file
3. Click "Commit changes"

### Option 2: Using Git Command Line

1. Open a terminal or command prompt
2. Navigate to the directory containing the extracted website files
3. Run the following commands:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your GitHub username and repository name.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for GitHub Pages to build your site

## Step 4: Update SEO Meta Tags

After your site is deployed, you'll need to update the SEO meta tags in the `index.html` file:

1. Go to your repository on GitHub
2. Open the `index.html` file
3. Click the edit button (pencil icon)
4. Find the following meta tags and update them with your actual GitHub Pages URL:

```html
<meta property="og:url" content="https://yourusername.github.io/quran-explorer/">
<meta property="twitter:url" content="https://yourusername.github.io/quran-explorer/">
<link rel="canonical" href="https://yourusername.github.io/quran-explorer/">
```

Replace `yourusername` and `quran-explorer` with your GitHub username and repository name.

5. Commit the changes

## Step 5: Generate and Upload Images

1. Open the `img/generate_images.html` file in a web browser
2. Right-click on each generated image and select "Save Image As..."
3. Save the favicon as `img/favicon.png`
4. Save the preview image as `img/quran-explorer-preview.jpg`
5. Upload these images to the `img` folder in your GitHub repository

## Step 6: Verify Your Website

1. Visit your GitHub Pages URL: `https://yourusername.github.io/repository-name/`
2. Test all functionality:
   - Browse through surahs, juz, and pages
   - Play audio recitations
   - Test search functionality
   - Try bookmarking verses
   - Test different settings (font size, translations, etc.)

## Troubleshooting

If you encounter any issues:

1. **CORS Errors**: The website is designed to use CDN-based API endpoints that should work with GitHub Pages. If you still see CORS errors in the console, make sure you've uploaded the latest version of the JavaScript files.

2. **Missing Images**: If the favicon or preview images aren't showing up, make sure you've generated and uploaded them to the correct location.

3. **404 Errors**: If you get a 404 error when visiting your GitHub Pages URL, make sure GitHub Pages is enabled and that you're using the correct URL format.

## SEO Optimization

The website already includes comprehensive SEO meta tags, but for even better search engine visibility:

1. Consider adding a `sitemap.xml` file
2. Register your site with Google Search Console
3. Share your website on social media to generate backlinks

Your Quran Explorer website should now be fully functional on GitHub Pages!
