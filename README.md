# Strata

A modern, block-based note-taking web application with Google Drive integration. Built with Vite + React + Tailwind CSS.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Google API credentials
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

## File Structure

```
Strata/
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── .env.example         # Environment variables template
├── src/
│   ├── App.jsx          # Main React application
│   ├── main.jsx         # React entry point
│   ├── index.css        # Tailwind + custom styles
│   ├── components/
│   │   ├── blocks/      # Block components (ContentBlock, ListBlock, etc.)
│   │   ├── embeds/      # Google Drive embed components
│   │   ├── icons/       # Icon components
│   │   ├── pages/       # Page type components (Canvas, Table, Mermaid, Map)
│   │   └── ui/          # UI components (SlashMenu, Toolbar, etc.)
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities, constants, Google API integration
├── public/              # Static assets
├── dist/                # Production build output (generated)
└── config.example.js    # Legacy config template (for upgrading users)
```

## Features

- **Notebooks, Tabs, and Pages** - Organize your notes hierarchically
- **Block-based editor** - Headings, images, videos, links, dividers
- **Slash commands** - Type `/` to quickly insert block types
- **Drag and drop** - Reorder blocks with visual indicators
- **Dark mode** - Full dark mode support with system preference or manual toggle
- **Favorites** - Star pages for quick access
- **Tab color cycling** - New tabs automatically cycle through colors
- **Responsive tabs** - Fish-eye hover effect when tabs overflow
- **Google Drive Integration** - Cloud storage with automatic sync, parallel page loading, and same-device cache for fast return visits
- **Google Drive File Embedding** - Embed Docs, Sheets, Slides via `/gdoc` command
- **PDF Viewing** - Embed PDFs from URLs or Google Drive
- **Canvas Pages** - Infinite canvas with freeform drawing, text containers, image pasting, pan/zoom with state persistence
- **Code Pages** - Mermaid, HTML, JavaScript, or Python (Pyodide): code-type label in header, paste/edit code, zoom/pan for Mermaid; HTML/JS in iframes that fill the page; Python runs via Pyodide (lazy-loaded), stdout/stderr capture, offline viewer support
- **Local Storage Fallback** - Works offline without Google sign-in

## Data Storage

Strata supports **Google Drive** as the primary storage backend, with localStorage as a fallback for offline use.

### Google Drive Integration

**Storage Architecture:**
- **Structure File** (`strata_structure.json`): Stored in root folder "Strata Notebooks"
  - Single source of truth with flat nodes map (UID → Node Data) and trash array
  - Each node contains: `uid`, `type` (notebook/tab/page), `name`, `parentUid`, `driveId`, and `appProperties`
  - Files are tagged with `appProperties.strataUID` for UID-based lookup
- **Folder Structure**: Mirrors your Notebook/Tab hierarchy in "My Drive"
  - Root folder: `Strata Notebooks`
  - Each Notebook → Drive folder
  - Each Tab → Drive folder (nested under Notebook folder)
  - Each Page → JSON file with content (named by `driveId`)
- **Portable Backup**: Download the entire `Strata Notebooks` folder as a ZIP
  - Includes `index.html` offline viewer
  - Open locally in any browser without internet
  - `strata_structure.json` contains full structure metadata
  - Files are named by their `driveId` for reliable lookup

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
   - Copy `.env.example` to `.env.local`
   - Set `VITE_GOOGLE_CLIENT_ID` to your OAuth Client ID
   - Set `VITE_GOOGLE_API_KEY` to your API Key

5. **Build and Deploy:**
   - Run `npm run build` to create production build in `dist/`
   - Deploy the `dist/` folder to GitHub Pages or your static host
   - Users will sign in with Google on first use

### Same-Device Cache (v2.6.4+)

When signed in, Strata caches loaded notebook data to `sessionStorage` and `localStorage` (24h). Returning to the app on the same device shows cached data immediately, then refreshes from Drive in the background.

### Fallback Mode

If not signed in, app uses `localStorage`:
- `note-app-data-v1` - All notebooks, tabs, pages, and blocks
- `note-app-settings-v1` - Theme and display preferences

## Deployment to GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to GitHub Pages (or configure GitHub Actions to build automatically)
3. Enable GitHub Pages in repository settings, pointing to the build output
4. Access at `https://yourusername.github.io/repo-name/`

## Known Limitations

- **Google Embeds**: May have CORS issues on some hosting setups
- **OAuth Origins**: Must configure allowed origins in Google Cloud Console

## License & Attribution

This project is licensed under the **Apache License 2.0**.

### Giving Credit

I put a lot of work into my open-source projects! If you use this code in your 
own project, please provide attribution by:

1. Keeping the `NOTICE` file intact in your repository.
2. Linking back to [chrismooredesigns.com](https://chrismooredesigns.com) or 
   my GitHub profile if the project is displayed publicly.

## Version History

- **v2.7.3** - Fixed Drive URL pages appearing blank after reset: syncGooglePageLink now sets strata_pageType and strata_icon on Drive files; loadFromDriveStructure derives page type from JSON content when file properties are missing (fixes existing link files).
- **v2.7.2** - strata_index.json as primary: removed manifest.json, strata_index stores Drive IDs for stable load; boot reads strata_index first, falls back to strata_structure then folder scan; sync improvements (error notifications, 2s debounce); createDriveShortcut/getDriveItem 404 handling; favicon; reconciler.js loaded.
- **v2.7.1** - License attribution: NOTICE file, README License & Attribution section; todo checkbox fix (controlled checkbox, immediate data sync in editor).
- **v2.6.8** - Removed /ul, /ol, /todo block types; block editor simplified for production use
- **v2.6.7** - Keyboard nav: Ctrl+Left/Right cycle tabs, Ctrl+Alt+Up/Down cycle notebooks
- **v2.6.6** - Keyboard nav fixes: Ctrl+Up/Down no longer skips two pages (page-div handler ignores Ctrl), fixed crash when navigating to last page (rowsForEditor Array.isArray guard)
- **v2.6.5** - Keyboard navigation: Ctrl+Up/Down to cycle pages (replacing Ctrl+Tab), Ctrl+1-0 for tabs, Ctrl+Alt+1-0 for notebooks
- **v2.6.4** - Drive load and cache: parallelized page content fetches in loadFromDriveStructure (batched, 10 concurrent), same-device cache for Drive data (sessionStorage + localStorage, 24h), embed container min-height to fix Google "page too small" error, driveLinkFileId preserved for Google pages
- **v2.6.3** - Map block enhancements: address field persistence with reverse geocoding, improved geocoding flexibility (partial addresses, multiple result handling), automatic marker placement on geocode, real-time zoom and lock updates, fixed `/map` command timing issue, fixed map block dragging on canvas pages
- **v2.6.2** - UID-based structure system: implemented new StrataStructure format with flat nodes map and UID-based file operations. Added migration script, reconciler for remote-first boot, and updated offline viewer to use strata_structure.json
- **v2.6.1** - Fixed Drive data loading: notebooks/tabs now correctly load from Drive after login instead of reverting to localStorage
- **v2.6.0** - Fixed duplicate folder creation race condition, added Drive cleanup button in settings to remove old temporary files, fixed missing API function errors
- **v2.5.9** - Reorganized page type menu: reordered menu items with improved grouping (Block Page, Canvas, Database, Code Page, Google Suite, Drive, PDF), updated UI layout for better organization
- **v2.5.8** - Database page type: new table/database page type with customizable columns (text, number, boolean, select), add/remove rows and columns, vertical add-column bar on right edge (mouseover), row delete buttons on left side, full table editing interface
- **v2.5.7** - Canvas grid alignment fix: grid background now locks to canvas coordinate system during zoom-to-mouse operations, ensuring grid dots remain aligned with content at all zoom levels.
- **v2.5.6** - Code Page: Python (Pyodide) support; lazy-load Pyodide, run Python, capture stdout/stderr; Python branch in offline viewer.
- **v2.5.5** - Code Page: code-type label (Mermaid / HTML / JavaScript) in header; HTML/JS rendered iframes fill the page body.
- **v2.5.4** - Mermaid page type: diagram pages with header (icon, name, star, edit), pencil-edit modal for Mermaid code, zoom/pan controls (ZoomIn/ZoomOut, scale %, Fit), Alt+wheel zoom-at-cursor, wheel pan (Shift+wheel horizontal), drag-to-pan, viewport persistence (`mermaidViewport`), Drive sync; offline viewer supports Mermaid.
- **v2.5.3** - Performance and UX overhaul: active-page slice for faster typing, React.memo + stable callbacks on ContentBlock/BlockComponent, contentEditable fix (no dangerouslySetInnerHTML), useLayoutEffect for Ctrl+Enter focus, throttled block DnD, min-h-0 scroll fixes, condensed sidebar horizontal-scroll fix, tab/sidebar/empty-state polish. Pure helpers (getActiveContext, updatePageInData, getDropIndicatorClass). Single-file build: app + styles inlined into index.html.
- **v2.5.2** - Fixed canvas coordinate system: corrected zoom-to-mouse calculation, viewport bounds calculation, and coordinate transformations to account for canvas-background offset; fixed live drawing path visibility during pen tool usage
- **v2.5.1** - Fixed canvas rendering issue: reverted dynamic grid that caused blank canvas screens, restored fixed 50000px grid, fixed live drawing path positioning for real-time feedback
- **v2.5.0** - Canvas pages: infinite canvas with freeform drawing, text containers, image pasting, pan/zoom controls, transform state persistence per page, title syncing with page list
- **v2.4.7** - Block menu "Change type" dropdown (transfer content between types); fix /div and list transfer when changing block types; zoom for Docs/Sheets preview only, fixed window (width and height), contents scale within
- **v2.4.6** - Fixed /div slash command not creating divider blocks (stale closure race condition)
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
