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
├── index.html    # Main HTML entry point
├── styles.css    # Custom CSS styles (dark mode, animations, etc.)
├── app.js        # React application (JSX, uses Babel for transpilation)
└── README.md     # This file
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
- **Google Embeds** - Embed Docs, Sheets, Slides (requires proper hosting)
- **PDF Viewing** - Embed PDFs from URLs or Google Drive
- **Local Storage** - Data persists in browser

## Data Storage

Currently uses `localStorage` for persistence:
- `note-app-data-v1` - All notebooks, tabs, pages, and blocks
- `note-app-settings-v1` - Theme and display preferences

**Future:** Will integrate with Google Drive API for cloud storage ("Zero-Database" architecture).

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
