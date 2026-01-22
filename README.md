# Strata

A modern, block-based note-taking web application designed to be hosted on GitHub Pages or any static file server.

## Quick Start

1. Open `index.html` in a web browser (or serve with a local server)
2. For local development, use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (npx)
   npx serve
   
   # VS Code Live Server extension
   ```

## File Structure

```
Strata/
├── index.html          # Main HTML entry point
├── styles.css          # Custom CSS styles (dark mode, animations, etc.)
├── app.js              # React application (JSX, uses Babel for transpilation)
├── google-api.js       # Google Drive API helper module
├── config.js           # Google API credentials (create from config.example.js)
├── config.example.js  # Template for config.js
├── .gitignore          # Excludes config.js from git
└── README.md           # This file
```

## Features

- **Notebooks, Tabs, and Pages** - Organize your notes hierarchically
- **Block-based editor** - Headings, lists, todos, images, videos, links, dividers
- **Slash commands** - Type `/` to quickly insert block types
- **Drag and drop** - Reorder blocks with visual indicators
- **Dark mode** - Full dark mode support with system preference or manual toggle
- **Favorites** - Star pages for quick access
- **Tab color cycling** - New tabs automatically cycle through colors
- **Responsive tabs** - Fish-eye hover effect when tabs overflow (condenses tabs, expands on hover)
- **Google Drive Integration** - Cloud storage with automatic sync
- **Google Drive File Embedding** - Embed Docs, Sheets, Slides via `/gdoc` command
- **File Uploads** - Drag & drop images/PDFs to upload to Drive folders
- **PDF Viewing** - Embed PDFs from URLs or Google Drive
- **Local Storage Fallback** - Works offline without Google sign-in

## Data Storage

Strata now supports **Google Drive** as the primary storage backend, with localStorage as a fallback for offline use.

### Google Drive Integration

**Storage Architecture:**
- **Manifest File** (`strata_manifest.json`): Stored in Google Drive's `appDataFolder` (hidden, app-specific)
  - Contains all notebooks, tabs, pages, blocks, and settings
  - Automatically synced with debounced saves (500ms)
- **Folder Structure**: Mirrors your Notebook/Tab hierarchy in "My Drive"
  - Root folder: `Strata Notebooks`
  - Each Notebook → Drive folder
  - Each Tab → Drive folder (nested under Notebook folder)
  - Uploaded files (images, PDFs) → Stored in Tab folders

**Setup Instructions:**

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google Drive API"

2. **Configure OAuth 2.0:**
   - Go to "APIs & Services" → "Credentials"
   - Create "OAuth 2.0 Client ID" (Web application)
   - Add authorized JavaScript origins:
     - `http://localhost:8000` (for local testing)
     - `https://yourusername.github.io` (for GitHub Pages)
   - Add authorized redirect URIs (same as origins)

3. **Create API Key:**
   - In "Credentials", create an "API Key"
   - Restrict to "Google Drive API" (optional but recommended)

4. **Configure the App:**
   - Copy `config.example.js` to `config.js`
   - Replace `YOUR_CLIENT_ID_HERE` with your OAuth Client ID
   - Replace `YOUR_API_KEY_HERE` with your API Key

5. **Deploy:**
   - Ensure `config.js` is in `.gitignore` (already configured)
   - Deploy to GitHub Pages or your static host
   - Users will sign in with Google on first use

**Features:**
- Automatic data migration from localStorage on first Google sign-in
- Real-time sync to Google Drive (debounced)
- Folder structure mirrors Notebook/Tab organization
- File uploads (drag & drop images/PDFs) → Stored in Drive
- Google Drive file embedding (`/gdoc` command)

**Fallback Mode:**
- If not signed in, app uses `localStorage`:
  - `note-app-data-v1` - All notebooks, tabs, pages, and blocks
  - `note-app-settings-v1` - Theme and display preferences

## Deployment to GitHub Pages

1. Move these files to the root of your GitHub Pages repo (or a `/docs` folder)
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/repo-name/`

## Known Limitations

- **Google Embeds**: May have CORS issues on some hosting setups
- **Babel in Browser**: For production, consider a build step to pre-compile JSX
- **No offline support**: Could add a service worker for PWA functionality

## Version History

- **v1.0.3** - Dark mode improvements, tab overflow fixes, UI refinements
- **v1.0.2** - Tab color cycling, fish-eye hover effect for tabs
- **v1.0.1** - Initial release with core features

## Future Enhancements

- [ ] Google Drive API integration for cloud storage
- [ ] User authentication (Google Sign-In)
- [ ] Collaborative editing
- [ ] Export/Import functionality
- [ ] Mobile-responsive improvements
