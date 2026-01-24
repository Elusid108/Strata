# Strata

A modern, block-based note-taking web application with Google Drive integration. Designed to be hosted on GitHub Pages or any static file server.

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
├── config.example.js   # Template for config.js
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
- **Responsive tabs** - Fish-eye hover effect when tabs overflow
- **Google Drive Integration** - Cloud storage with automatic sync
- **Google Drive File Embedding** - Embed Docs, Sheets, Slides via `/gdoc` command
- **PDF Viewing** - Embed PDFs from URLs or Google Drive
- **Local Storage Fallback** - Works offline without Google sign-in

## Data Storage

Strata supports **Google Drive** as the primary storage backend, with localStorage as a fallback for offline use.

### Google Drive Integration

**Storage Architecture:**
- **Manifest File** (`strata_manifest.json`): Stored in Google Drive's `appDataFolder` (hidden, app-specific)
  - Contains all notebooks, tabs, pages, blocks, and settings
  - Automatically synced with debounced saves
- **Folder Structure**: Mirrors your Notebook/Tab hierarchy in "My Drive"
  - Root folder: `Strata Notebooks`
  - Each Notebook → Drive folder
  - Each Tab → Drive folder (nested under Notebook folder)
  - Each Page → JSON file with content
- **Portable Backup**: Download the entire `Strata Notebooks` folder as a ZIP
  - Includes `index.html` offline viewer
  - Open locally in any browser without internet
  - `manifest.json` contains full structure metadata

### Setup Instructions

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

3. **Create API Key:**
   - In "Credentials", create an "API Key"
   - Restrict to "Google Drive API" (recommended)

4. **Configure the App:**
   - Copy `config.example.js` to `config.js`
   - Replace `YOUR_CLIENT_ID_HERE` with your OAuth Client ID
   - Replace `YOUR_API_KEY_HERE` with your API Key

5. **Deploy:**
   - Ensure `config.js` is in `.gitignore` (already configured)
   - Deploy to GitHub Pages or your static host
   - Users will sign in with Google on first use

### Fallback Mode

If not signed in, app uses `localStorage`:
- `note-app-data-v1` - All notebooks, tabs, pages, and blocks
- `note-app-settings-v1` - Theme and display preferences

## Deployment to GitHub Pages

1. Move these files to the root of your GitHub Pages repo (or a `/docs` folder)
2. Enable GitHub Pages in repository settings
3. Access at `https://yourusername.github.io/repo-name/`

## Known Limitations

- **Google Embeds**: May have CORS issues on some hosting setups
- **Babel in Browser**: For production, consider a build step to pre-compile JSX
- **OAuth Origins**: Must configure allowed origins in Google Cloud Console

## Version History

- **v2.4.5** - Zoom controls for embedded Google Docs/Sheets/Slides pages
- **v2.4.4** - Fixed Google Drive data loading when duplicate manifest files exist (now loads most recently modified)
- **v2.4.3** - Header and sidebar UI refinements, improved URL editing, active-only icon controls, bottom toolbar alignment
- **v2.4.2** - Session-wide page caching, always-dark sidebar, tab dark mode colors, double-click to edit tab names, new pages start with empty block
- **v2.4.1** - iOS-style Edit/Preview toggle fix, page caching for faster switching, light mode color fixes, Enter key to finish editing page names
- **v2.4.0** - Edit/Preview toggle for Google pages, Drive import modal with URL paste, default to Edit mode for embeds
- **v2.3.1** - Fix sync triggers, Drive reconciliation, delete/rename sync fixes
- **v2.3.0** - Portable backup with offline viewer, one-way sync (notebook as master)
- **v2.2.0** - Two-way Drive sync, sync status UI improvements
- **v2.1.0** - Drive folder mirroring, page content sync
- **v2.0.0** - Google Drive integration, cloud sync, Drive file embedding
- **v1.0.5** - Tab overflow detection fixes
- **v1.0.4** - Tab condensing improvements, selected tab positioning
- **v1.0.3** - Dark mode improvements, tab overflow fixes, UI refinements
- **v1.0.2** - Tab color cycling, fish-eye hover effect for tabs
- **v1.0.1** - Initial release with core features

## Future Enhancements

- [x] Google Drive API integration for cloud storage
- [x] User authentication (Google Sign-In)
- [x] Export/Import functionality (downloadable folder with offline viewer)
- [ ] Collaborative editing
- [ ] Mobile-responsive improvements
