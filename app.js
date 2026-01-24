  const { useState, useEffect, useRef } = React;

  // --- App Version ---
  const APP_VERSION = "2.4.5";

  // --- Offline Viewer HTML Generator ---
  const generateOfflineViewerHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strata Notebooks - Offline Viewer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
        .container { display: flex; height: 100vh; }
        .sidebar { width: 280px; background: #1f2937; color: white; overflow-y: auto; flex-shrink: 0; }
        .sidebar-header { padding: 16px; border-bottom: 1px solid #374151; font-weight: bold; font-size: 18px; }
        .notebook { margin: 8px; }
        .notebook-header { padding: 8px 12px; background: #374151; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .notebook-header:hover { background: #4b5563; }
        .notebook-header.active { background: #3b82f6; }
        .tab { margin-left: 16px; margin-top: 4px; }
        .tab-header { padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .tab-header:hover { background: #374151; }
        .tab-header.active { background: #4b5563; }
        .page { margin-left: 32px; }
        .page-item { padding: 4px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #9ca3af; }
        .page-item:hover { background: #374151; color: white; }
        .page-item.active { background: #3b82f6; color: white; }
        .main { flex: 1; overflow-y: auto; background: white; }
        .page-content { max-width: 800px; margin: 0 auto; padding: 40px; }
        .page-title { font-size: 32px; font-weight: bold; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .block { margin-bottom: 8px; line-height: 1.6; }
        .block-h1 { font-size: 28px; font-weight: bold; margin-top: 24px; margin-bottom: 12px; }
        .block-h2 { font-size: 24px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
        .block-h3 { font-size: 20px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; }
        .block-h4 { font-size: 16px; font-weight: bold; margin-top: 12px; margin-bottom: 6px; }
        .block-ul, .block-ol { padding-left: 24px; }
        .block-todo { display: flex; align-items: center; gap: 8px; }
        .block-todo input { width: 18px; height: 18px; }
        .block-divider { border-top: 1px solid #e5e7eb; margin: 16px 0; }
        .block-image img { max-width: 100%; border-radius: 8px; }
        .block-link a { color: #3b82f6; text-decoration: none; }
        .block-link a:hover { text-decoration: underline; }
        .block-video iframe { width: 100%; aspect-ratio: 16/9; border: none; border-radius: 8px; }
        .google-link { padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 8px 0; }
        .google-link a { color: #3b82f6; font-weight: 500; }
        .loading { text-align: center; padding: 40px; color: #666; }
        .error { text-align: center; padding: 40px; color: #dc2626; }
        .empty { text-align: center; padding: 60px; color: #9ca3af; }
        @media (max-width: 768px) {
            .sidebar { width: 100%; position: fixed; bottom: 0; height: auto; max-height: 50vh; z-index: 100; }
            .main { margin-bottom: 200px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="sidebar-header">📓 Strata Notebooks</div>
            <div id="nav"></div>
        </div>
        <div class="main">
            <div id="content" class="loading">Loading...</div>
        </div>
    </div>
    <script>
        let manifest = null;
        let currentNotebook = null;
        let currentTab = null;
        let currentPage = null;

        async function loadManifest() {
            try {
                const response = await fetch('manifest.json');
                if (!response.ok) throw new Error('Could not load manifest.json');
                manifest = await response.json();
                renderNav();
                if (manifest.notebooks.length > 0) {
                    selectNotebook(manifest.notebooks[0]);
                } else {
                    document.getElementById('content').innerHTML = '<div class="empty">No notebooks found</div>';
                }
            } catch (e) {
                document.getElementById('content').innerHTML = '<div class="error">Error: ' + e.message + '<br><br>Make sure manifest.json is in the same folder as index.html</div>';
            }
        }

        function renderNav() {
            const nav = document.getElementById('nav');
            nav.innerHTML = manifest.notebooks.map(nb => \`
                <div class="notebook">
                    <div class="notebook-header" onclick="selectNotebook(manifest.notebooks.find(n => n.id === '\${nb.id}'))" id="nb-\${nb.id}">
                        <span>\${nb.icon || '📓'}</span>
                        <span>\${nb.name}</span>
                    </div>
                    <div class="tabs" id="tabs-\${nb.id}" style="display: none;">
                        \${nb.tabs.map(tab => \`
                            <div class="tab">
                                <div class="tab-header" onclick="selectTab(manifest.notebooks.find(n => n.id === '\${nb.id}'), '\${tab.id}')" id="tab-\${tab.id}">
                                    <span>\${tab.icon || '📋'}</span>
                                    <span>\${tab.name}</span>
                                </div>
                                <div class="pages" id="pages-\${tab.id}" style="display: none;">
                                    \${tab.pages.map(page => \`
                                        <div class="page">
                                            <div class="page-item" onclick="selectPage('\${nb.id}', '\${tab.id}', '\${page.id}')" id="page-\${page.id}">
                                                <span>\${page.icon || '📄'}</span>
                                                <span>\${page.name}</span>
                                            </div>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`).join('');
        }

        function selectNotebook(nb) {
            document.querySelectorAll('.notebook-header').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tabs').forEach(el => el.style.display = 'none');
            document.getElementById('nb-' + nb.id).classList.add('active');
            document.getElementById('tabs-' + nb.id).style.display = 'block';
            currentNotebook = nb;
            if (nb.tabs.length > 0) selectTab(nb, nb.tabs[0].id);
        }

        function selectTab(nb, tabId) {
            const tab = nb.tabs.find(t => t.id === tabId);
            document.querySelectorAll('.tab-header').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.pages').forEach(el => el.style.display = 'none');
            document.getElementById('tab-' + tabId).classList.add('active');
            document.getElementById('pages-' + tabId).style.display = 'block';
            currentTab = tab;
            if (tab.pages.length > 0) selectPage(nb.id, tabId, tab.pages[0].id);
        }

        async function selectPage(nbId, tabId, pageId) {
            document.querySelectorAll('.page-item').forEach(el => el.classList.remove('active'));
            document.getElementById('page-' + pageId).classList.add('active');
            
            const nb = manifest.notebooks.find(n => n.id === nbId);
            const tab = nb.tabs.find(t => t.id === tabId);
            const page = tab.pages.find(p => p.id === pageId);
            currentPage = page;

            if (page.type && page.type !== 'block') {
                // Google Doc/Sheet/Slides or external link
                const link = page.webViewLink || page.embedUrl || '#';
                document.getElementById('content').innerHTML = \`
                    <div class="page-content">
                        <h1 class="page-title"><span>\${page.icon || '📄'}</span> \${page.name}</h1>
                        <div class="google-link">
                            <p>This is a linked Google file.</p>
                            <p><a href="\${link}" target="_blank">Open in Google Drive →</a></p>
                        </div>
                    </div>
                \`;
                return;
            }

            // Load block page content
            try {
                const filePath = nb.folder + '/' + tab.folder + '/' + page.file;
                const response = await fetch(filePath);
                if (!response.ok) throw new Error('Could not load page');
                const pageData = await response.json();
                renderPage(page, pageData);
            } catch (e) {
                document.getElementById('content').innerHTML = '<div class="error">Could not load page: ' + e.message + '</div>';
            }
        }

        function renderPage(pageMeta, pageData) {
            const content = pageData.content || pageData.rows || [];
            let html = '<div class="page-content">';
            html += '<h1 class="page-title"><span>' + (pageMeta.icon || '📄') + '</span> ' + pageMeta.name + '</h1>';
            
            function renderBlocks(rows) {
                let blocksHtml = '';
                for (const row of rows) {
                    if (!row.columns) continue;
                    for (const col of row.columns) {
                        if (!col.blocks) continue;
                        for (const block of col.blocks) {
                            blocksHtml += renderBlock(block);
                        }
                    }
                }
                return blocksHtml;
            }

            function renderBlock(block) {
                const c = block.content || '';
                switch (block.type) {
                    case 'h1': return '<div class="block block-h1">' + c + '</div>';
                    case 'h2': return '<div class="block block-h2">' + c + '</div>';
                    case 'h3': return '<div class="block block-h3">' + c + '</div>';
                    case 'h4': return '<div class="block block-h4">' + c + '</div>';
                    case 'ul': return '<ul class="block block-ul"><li>' + c + '</li></ul>';
                    case 'ol': return '<ol class="block block-ol"><li>' + c + '</li></ol>';
                    case 'todo': return '<div class="block block-todo"><input type="checkbox" ' + (block.checked ? 'checked' : '') + ' disabled> <span>' + c + '</span></div>';
                    case 'divider': return '<div class="block-divider"></div>';
                    case 'image': return block.url ? '<div class="block block-image"><img src="' + block.url + '" alt=""></div>' : '';
                    case 'video': return block.url ? '<div class="block block-video"><iframe src="https://www.youtube.com/embed/' + getYouTubeId(block.url) + '" allowfullscreen></iframe></div>' : '';
                    case 'link': return '<div class="block block-link"><a href="' + (block.url || '#') + '" target="_blank">' + (c || block.url || 'Link') + '</a></div>';
                    default: return c ? '<div class="block">' + c + '</div>' : '';
                }
            }

            function getYouTubeId(url) {
                const match = url.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([^#&?]*)/);
                return match ? match[1] : '';
            }

            if (Array.isArray(content)) {
                html += renderBlocks(content);
            }
            html += '</div>';
            document.getElementById('content').innerHTML = html;
        }

        // Start
        loadManifest();
    <\/script>
</body>
</html>`;
  };

  // --- Internal Icon Components ---
  const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );

  const Plus = (props) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
  const Trash2 = (props) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
  const GripVertical = (props) => <IconBase {...props}><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></IconBase>;
  const ImageIcon = (props) => <IconBase {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconBase>;
  const Youtube = (props) => <IconBase {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></IconBase>;
  const Type = (props) => <IconBase {...props}><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></IconBase>;
  const LinkIcon = (props) => <IconBase {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></IconBase>;
  const ChevronRight = (props) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>;
  const Book = (props) => <IconBase {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></IconBase>;
  const Settings = (props) => <IconBase {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></IconBase>;
  const X = (props) => <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>;
  const Minus = (props) => <IconBase {...props}><path d="M5 12h14"/></IconBase>;
  const AlertCircle = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconBase>;
  const ZoomIn = (props) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></IconBase>;
  const ZoomOut = (props) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></IconBase>;
  const MoreVertical = (props) => <IconBase {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></IconBase>;
  const List = (props) => <IconBase {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></IconBase>;
  const ListOrdered = (props) => <IconBase {...props}><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></IconBase>;
  const Heading1 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></IconBase>;
  const Heading2 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></IconBase>;
  const Heading3 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></IconBase>;
  const Heading4 = (props) => <IconBase {...props}><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 10v4h4"/><path d="M21 10v8"/></IconBase>;
  const AlignLeft = (props) => <IconBase {...props}><line x1="17" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></IconBase>;
  const Bold = (props) => <IconBase {...props}><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></IconBase>;
  const Italic = (props) => <IconBase {...props}><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></IconBase>;
  const Underline = (props) => <IconBase {...props}><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></IconBase>;
  const CheckSquare = (props) => <IconBase {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></IconBase>;
  const Image = (props) => <IconBase {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></IconBase>;
  const Moon = (props) => <IconBase {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></IconBase>;
  const GoogleG = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
  const Sun = (props) => <IconBase {...props}><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></IconBase>;
  const Monitor = (props) => <IconBase {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></IconBase>;
  const Columns = (props) => <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/></IconBase>;
  const Minimize2 = (props) => <IconBase {...props}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></IconBase>;
  const Maximize2 = (props) => <IconBase {...props}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></IconBase>;
  const Star = ({ size = 24, className = "", filled = false, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  const Edit3 = (props) => <IconBase {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></IconBase>;
  const FolderOpen = (props) => <IconBase {...props}><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></IconBase>;
  const FilePlus = (props) => <IconBase {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></IconBase>;

  // --- Constants & Utilities ---
  const COLORS = [
    { name: 'gray', label: 'Gray' }, { name: 'red', label: 'Red' }, { name: 'orange', label: 'Orange' },
    { name: 'amber', label: 'Amber' }, { name: 'green', label: 'Green' }, { name: 'teal', label: 'Teal' },
    { name: 'blue', label: 'Blue' }, { name: 'indigo', label: 'Indigo' }, { name: 'purple', label: 'Purple' },
    { name: 'pink', label: 'Pink' },
  ];

  const SLASH_COMMANDS = [
    { cmd: 'h1', aliases: ['h1', 'header1', 'heading1'], label: 'Heading 1', desc: 'Large section heading', type: 'h1' },
    { cmd: 'h2', aliases: ['h2', 'header2', 'heading2'], label: 'Heading 2', desc: 'Medium section heading', type: 'h2' },
    { cmd: 'h3', aliases: ['h3', 'header3', 'heading3'], label: 'Heading 3', desc: 'Small section heading', type: 'h3' },
    { cmd: 'h4', aliases: ['h4', 'header4', 'heading4'], label: 'Heading 4', desc: 'Tiny section heading', type: 'h4' },
    { cmd: 'ul', aliases: ['ul', 'list', 'bullet', 'bullets'], label: 'Bullet List', desc: 'Unordered list', type: 'ul' },
    { cmd: 'ol', aliases: ['ol', 'num', 'ordered', 'numbered'], label: 'Numbered List', desc: 'Ordered list', type: 'ol' },
    { cmd: 'todo', aliases: ['todo', 'check', 'task', 'checkbox'], label: 'To-do', desc: 'Checkbox item', type: 'todo' },
    { cmd: 'img', aliases: ['img', 'image', 'pic', 'picture'], label: 'Image', desc: 'Embed an image', type: 'image' },
    { cmd: 'vid', aliases: ['vid', 'video', 'youtube'], label: 'Video', desc: 'Embed YouTube video', type: 'video' },
    { cmd: 'link', aliases: ['link', 'url', 'bookmark'], label: 'Link', desc: 'Web bookmark', type: 'link' },
    { cmd: 'div', aliases: ['div', 'divider', 'hr', 'line'], label: 'Divider', desc: 'Horizontal line', type: 'divider' },
    { cmd: 'gdoc', aliases: ['gdoc', 'gdrive', 'google'], label: 'Google Drive File', desc: 'Embed Google Doc/Sheet/Slide', type: 'gdoc' },
  ];

  const BG_COLORS = {
      gray: 'bg-gray-100 dark:bg-gray-700',
      red: 'bg-red-100 dark:bg-red-900',
      orange: 'bg-orange-100 dark:bg-orange-900',
      amber: 'bg-amber-100 dark:bg-amber-900',
      green: 'bg-green-100 dark:bg-green-900',
      teal: 'bg-teal-100 dark:bg-teal-900',
      blue: 'bg-blue-100 dark:bg-blue-900',
      indigo: 'bg-indigo-100 dark:bg-indigo-900',
      purple: 'bg-purple-100 dark:bg-purple-900',
      pink: 'bg-pink-100 dark:bg-pink-900',
  };

  const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "👩‍🦱", "👩‍🦳", "👩‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️", "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♂️", "🧏‍♀️", "🙇", "🙇‍♂️", "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", "👨‍🏫", "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", "👮", "👮‍♂️", "👮‍♀️", "🕵", "🕵‍♂️", "🕵‍♀️", "💂", "💂‍♂️", "💂‍♀️", "👷", "👷‍♂️", "👷‍♀️", "🤴", "👸", "👳", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "🤵‍♂️", "🤵‍♀️", "👰", "👰‍♂️", "👰‍♀️", "🤰", "🤱", "👩‍🍼", "👨‍🍼", "🧑‍🍼", "👼", "🎅", "🤶", "🧑‍🎄", "🦸", "🦸‍♂️", "🦸‍♀️", "🦹", "🦹‍♂️", "🦹‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "💆", "💆‍♂️", "💆‍♀️", "💇", "💇‍♂️", "💇‍♀️", "🚶", "🚶‍♂️", "🚶‍♀️", "🧍", "🧍‍♂️", "🧍‍♀️", "🧎", "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", "🏃", "🏃‍♂️", "🏃‍♀️", "💃", "🕺", "🕴", "👯", "👯‍♂️", "👯‍♀️", "🧖", "🧖‍♂️", "🧖‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🤺", "🏇", "⛷", "🏂", "🏌", "🏌‍♂️", "🏌‍♀️", "🏄", "🏄‍♂️", "🏄‍♀️", "🚣", "🚣‍♂️", "🚣‍♀️", "🏊", "🏊‍♂️", "🏊‍♀️", "⛹", "⛹‍♂️", "⛹‍♀️", "🏋", "🏋‍♂️", "🏋‍♀️", "🚴", "🚴‍♂️", "🚴‍♀️", "🚵", "🚵‍♂️", "🚵‍♀️", "🤸", "🤸‍♂️", "🤸‍♀️", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️", "🤾", "🤾‍♂️", "🤾‍♀️", "🤹", "🤹‍♂️", "🤹‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🛀", "🛌", "📄", "📁", "📂", "💼", "📝", "🗓", "📅", "📇", "📉", "📈", "📊", "📋", "📌", "📍", "📎", "📏", "📐", "✂️", "🗂", "🗃", "🗄", "🗑", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝", "🔨", "🪓", "⛏", "🔧", "🔩", "🧱", "⚙️", "🗜", "⚖️", "🔗", "⛓", "🧰", "🧲", "🪜", "🩸", "💉", "💊", "🩹", "🩺", "🔭", "🔬", "🦠", "🧬", "🧪", "🧫", "🧹", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🪞", "🪟", "🛏", "🛋", "🪑", "🚪", "🛎", "🖼", "🧭", "🗺", "⛱", "🗿", "🛍", "🛒", "👓", "🕶", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🎒", "🎒", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑", "🪖", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙", "🎚", "🎛", "🎤", "🎧", "📻", "🎷", "🪗", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "🥁", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥", "🖨", "⌨️", "🖱", "🖲", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞", "📽", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞", "📑", "🔖", "🏷", "💰", "🪙", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "✉️", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳", "✏️", "✒️", "🖋", "🖊", "🖌", "🖍", "📝", "💼", "📁", "📂", "🗂", "📅", "📆", "🗒", "🗓", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇", "📏", "📐", "✂️", "🗃", "🗄", "🗑", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝", "🔨", "🪓", "⛏", "🔧", "🔩", "🧱", "⚙️", "🗜", "⚖️", "🔗", "⛓", "🧰", "🧲", "🪜", "⚗️", "🔭", "🔬", "🕳", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰", "🚿", "🛁", "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🛎", "🔑", "🗝", "🚪", "🪑", "🛋", "🛏", "🛌", "🧸", "🪆", "🖼", "🪞", "🪟", "🛍", "🛒", "🎁", "🎈", "🎏", "🎀", "🪄", "🪅", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷", "🪧", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃", "📄", "📑", "🧾", "📊", "📈", "📉", "🗒", "🗓", "📆", "📅", "🗑", "📇", "🗃", "🗳", "🗄", "📋", "📁", "📂", "🗂", "🗞", "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🔗", "📎", "🖇", "📐", "📏", "🧮", "📌", "📍", "✂️", "🖊", "🖋", "✒️", "🖌", "🖍", "📝", "✏️", "🔍", "🔎", "🔏", "🔐", "🔒", "🔓"];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Get next tab color by cycling through COLORS array
  const getNextTabColor = (existingTabs) => {
      if (!existingTabs || existingTabs.length === 0) return COLORS[0].name;
      const lastTabColor = existingTabs[existingTabs.length - 1].color;
      const currentIndex = COLORS.findIndex(c => c.name === lastTabColor);
      const nextIndex = (currentIndex + 1) % COLORS.length;
      return COLORS[nextIndex].name;
  };

  const INITIAL_DATA = {
    notebooks: [
      {
        id: 'nb1', name: 'My First Notebook', icon: '📓', activeTabId: 'tab1',
        tabs: [
          {
            id: 'tab1', name: 'General', icon: '📋', color: 'blue', activePageId: 'page1',
            pages: [
              {
                id: 'page1', 
                name: 'Welcome', 
                createdAt: Date.now(),
                icon: '👋',
                cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
                rows: [
                  {
                    id: 'row1', columns: [
                      {
                        id: 'col1', blocks: [
                          { id: 'blk1', type: 'h1', content: 'Welcome to your new Note App!' },
                          { id: 'blk2', type: 'text', content: 'Try <b>bolding</b> or <i>italicizing</i> this text using standard keyboard shortcuts.' },
                          { id: 'blk3', type: 'text', content: 'Type / to see available commands like /h1, /todo, /img, etc.' },
                          { id: 'blk4', type: 'todo', content: 'Try checking this item', checked: false }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  function getYouTubeID(url) {
      if (!url) return '';
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[8].length === 11) ? match[8] : '';
  }

  // --- Components ---

  const ImageLightbox = ({ src, onClose }) => {
      const [scale, setScale] = useState(1);
      return (
          <div className="fixed inset-0 z-[10001] bg-black/95 flex flex-col animate-fade-in backdrop-blur-sm">
              <div className="flex justify-end p-6">
                  <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"><X size={24} /></button>
              </div>
              <div className="flex-1 flex items-center justify-center overflow-hidden p-8" onClick={onClose}>
                  <img src={src} alt="Full screen" className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
                      style={{ transform: `scale(${scale})`, cursor: scale > 1 ? 'zoom-out' : 'zoom-in' }}
                      onClick={(e) => { e.stopPropagation(); setScale(prev => prev === 1 ? 2.5 : 1); }} />
              </div>
          </div>
      )
  }

  const ContentBlock = ({ html, tagName, className, placeholder, onChange, onInsertBelow, onInsertTextBelow, onExitList, blockId, autoFocusId, onFocus, onConvert }) => {
      const contentEditableRef = useRef(null);
      const isLocked = useRef(false); 
      const initialHtml = useRef(html);
      const [slashMenu, setSlashMenu] = useState({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });

      const processHtml = (rawHtml, tag) => {
          if ((tag === 'ul' || tag === 'ol')) {
              if (!rawHtml || rawHtml.trim() === '' || rawHtml === '<br>') return '<li></li>';
              if (!rawHtml.includes('<li>')) return `<li>${rawHtml}</li>`;
          }
          return rawHtml;
      };

      const safeHtml = processHtml(html, tagName);
      initialHtml.current = processHtml(initialHtml.current, tagName);

      // Filter slash commands based on input
      const filteredCommands = slashMenu.open ? SLASH_COMMANDS.filter(cmd => 
          cmd.aliases.some(alias => alias.startsWith(slashMenu.filter.toLowerCase())) ||
          cmd.label.toLowerCase().includes(slashMenu.filter.toLowerCase())
      ) : [];

      useEffect(() => {
          if (contentEditableRef.current && !isLocked.current) {
               if (contentEditableRef.current.innerHTML !== safeHtml) {
                   contentEditableRef.current.innerHTML = safeHtml;
               }
          }
      }, [safeHtml]);

      useEffect(() => {
          if (autoFocusId === blockId && contentEditableRef.current) {
              contentEditableRef.current.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(contentEditableRef.current);
              range.collapse(false);
              sel.removeAllRanges();
              sel.addRange(range);
          }
      }, [autoFocusId, blockId]);

      const getCaretPosition = () => {
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
              const range = sel.getRangeAt(0).cloneRange();
              range.collapse(true);
              const rect = range.getClientRects()[0];
              if (rect) return { top: rect.bottom + 5, left: rect.left };
          }
          if (contentEditableRef.current) {
              const rect = contentEditableRef.current.getBoundingClientRect();
              return { top: rect.bottom + 5, left: rect.left };
          }
          return { top: 0, left: 0 };
      };

      const selectSlashCommand = (cmd) => {
          setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
          onConvert(cmd.type);
      };

      const handleInput = (e) => {
          isLocked.current = true;
          const text = e.currentTarget.innerText;
          onChange(e.currentTarget.innerHTML);
          
          // Check for slash command trigger
          if (text.startsWith('/')) {
              const filter = text.substring(1);
              const position = getCaretPosition();
              setSlashMenu({ open: true, filter, selectedIndex: 0, position });
          } else {
              if (slashMenu.open) setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
          }
      };
      
      const handleBlur = () => { 
          isLocked.current = false;
          // Delay closing to allow click on menu items
          setTimeout(() => setSlashMenu(prev => ({ ...prev, open: false })), 150);
      };
      const handleFocus = () => { if (onFocus) onFocus(); }

      const handleKeyDown = (e) => {
          // Handle slash menu navigation
          if (slashMenu.open && filteredCommands.length > 0) {
              if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSlashMenu(prev => ({ ...prev, selectedIndex: (prev.selectedIndex + 1) % filteredCommands.length }));
                  return;
              }
              if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSlashMenu(prev => ({ ...prev, selectedIndex: prev.selectedIndex === 0 ? filteredCommands.length - 1 : prev.selectedIndex - 1 }));
                  return;
              }
              if (e.key === 'Enter' || e.key === 'Tab') {
                  e.preventDefault();
                  selectSlashCommand(filteredCommands[slashMenu.selectedIndex]);
                  return;
              }
              if (e.key === 'Escape') {
                  e.preventDefault();
                  setSlashMenu({ open: false, filter: '', selectedIndex: 0, position: { top: 0, left: 0 } });
                  return;
              }
          }

          if (e.key === 'Enter') {
              // Slash commands (fallback for when menu is closed but text starts with /)
              if (contentEditableRef.current) {
                  const text = contentEditableRef.current.innerText.trim();
                  if (text.startsWith('/')) {
                      const cmd = text.substring(1).toLowerCase();
                      const matchedCmd = SLASH_COMMANDS.find(c => c.aliases.includes(cmd));
                      if (matchedCmd) {
                          e.preventDefault();
                          onConvert(matchedCmd.type);
                          return;
                      }
                  }
              }

              // Standard behavior for text blocks and lists
              if (!e.shiftKey) {
                 if (tagName !== 'ul' && tagName !== 'ol') {
                     // For regular text blocks, Enter creates a new block below
                     // But if we have onExitList and content is empty, exit the list instead
                     if (onExitList && contentEditableRef.current) {
                         const text = contentEditableRef.current.innerText.trim();
                         if (text === '') {
                             e.preventDefault();
                             onExitList();
                             return;
                         }
                     }
                     e.preventDefault();
                     onInsertBelow();
                     return;
                 }
                 // For ul/ol lists, check if we should exit the list (double-enter on blank last item)
                 if (tagName === 'ul' || tagName === 'ol') {
                     const selection = window.getSelection();
                     if (selection.rangeCount > 0) {
                         // Find the current li element
                         let currentNode = selection.anchorNode;
                         let currentLi = null;
                         while (currentNode && currentNode !== contentEditableRef.current) {
                             if (currentNode.nodeName === 'LI') {
                                 currentLi = currentNode;
                                 break;
                             }
                             currentNode = currentNode.parentNode;
                         }
                         
                         if (currentLi) {
                             const liText = currentLi.innerText.trim();
                             const allLis = contentEditableRef.current.querySelectorAll('li');
                             const isLastLi = allLis.length > 0 && allLis[allLis.length - 1] === currentLi;
                             
                             // If current li is blank and is the last one, exit the list
                             if (liText === '' && isLastLi) {
                                 e.preventDefault();
                                 // Remove the blank li
                                 currentLi.remove();
                                 // Update the content
                                 onChange(contentEditableRef.current.innerHTML);
                                 // Create a new text block below
                                 onInsertBelow();
                                 return;
                             }
                         }
                     }
                 }
              }
          }

          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              // Use onInsertTextBelow if available (for todo blocks), otherwise onInsertBelow
              if (onInsertTextBelow) {
                  onInsertTextBelow();
              } else {
                  onInsertBelow();
              }
              return;
          }
          if (e.key === 'Tab') {
              e.preventDefault();
              if (tagName === 'ul' || tagName === 'ol') document.execCommand(e.shiftKey ? 'outdent' : 'indent', false, null);
          }
          if ((e.ctrlKey || e.metaKey)) {
              switch(e.key.toLowerCase()) {
                  case 'b': e.preventDefault(); document.execCommand('bold', false, null); break;
                  case 'i': e.preventDefault(); document.execCommand('italic', false, null); break;
                  case 'u': e.preventDefault(); document.execCommand('underline', false, null); break;
                  default: break;
              }
          }
      };

      const Tag = tagName;
      return (
          <>
              <Tag
                  ref={contentEditableRef}
                  className={tagName === 'ul' || tagName === 'ol' ? 
                      `outline-none pl-5 ml-1 cursor-text list-outside ${className} ${tagName === 'ul' ? 'list-disc' : 'list-decimal'}` : 
                      `outline-none empty:before:content-[attr(placeholder)] empty:before:text-gray-300 cursor-text ${className}`
                  }
                  contentEditable
                  suppressContentEditableWarning
                  placeholder={placeholder}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  dangerouslySetInnerHTML={{ __html: initialHtml.current }}
              />
              {slashMenu.open && filteredCommands.length > 0 && (
                  <div 
                      className="fixed z-[10000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl py-1 min-w-[220px] max-h-[300px] overflow-y-auto animate-fade-in"
                      style={{ top: slashMenu.position.top, left: slashMenu.position.left }}
                  >
                      {filteredCommands.map((cmd, index) => (
                          <div
                              key={cmd.cmd}
                              className={`px-3 py-2 cursor-pointer flex items-center gap-3 ${index === slashMenu.selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onMouseDown={(e) => { e.preventDefault(); selectSlashCommand(cmd); }}
                              onMouseEnter={() => setSlashMenu(prev => ({ ...prev, selectedIndex: index }))}
                          >
                              <span className="text-gray-400 font-mono text-sm">/{cmd.cmd}</span>
                              <div className="flex-1">
                                  <div className="font-medium text-sm dark:text-white">{cmd.label}</div>
                                  <div className="text-xs text-gray-400">{cmd.desc}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </>
      );
  };

  const BlockComponent = ({ block, rowId, colId, onUpdate, onDelete, onInsertBelow, autoFocusId, onRequestFocus, onDragStart, onDragOver, onDrop, dropTarget, isSelected, onHandleClick, onFocus }) => {
      const isTarget = dropTarget && dropTarget.blockId === block.id;
      const indicatorStyle = isTarget ? (() => {
          switch(dropTarget.position) {
              case 'top': return 'border-t-4 border-blue-500 pt-2';
              case 'bottom': return 'border-b-4 border-blue-500 pb-2';
              case 'left': return 'border-l-4 border-blue-500 pl-2';
              case 'right': return 'border-r-4 border-blue-500 pr-2';
              default: return '';
          }
      })() : '';

      const [showLightbox, setShowLightbox] = useState(false);
      const bgClass = block.backgroundColor ? BG_COLORS[block.backgroundColor] : '';
      // Only add bg-blue-50/50 if there's no background color, so selection doesn't obscure block colors
      const borderClass = isSelected 
          ? `ring-2 ring-blue-400 ring-offset-2 ${!block.backgroundColor ? 'bg-blue-50/50' : ''}` 
          : 'hover:bg-gray-50';

      const handleConvert = (newType) => {
          const isMedia = ['image', 'video', 'link'].includes(newType);
          onUpdate({ type: newType, content: isMedia ? '' : '', url: '' });
          // For dividers, auto-insert a text block below for continued typing
          if (newType === 'divider') {
              onInsertBelow();
          } else if (onRequestFocus) {
              // Focus the block after conversion so user can start typing immediately
              onRequestFocus();
          }
      };
      
      const handleMediaKeyDown = (e) => {
          if (e.key === 'Enter') {
              if (e.ctrlKey || e.metaKey) {
                  // Ctrl+Enter -> New block below
                  e.preventDefault();
                  onInsertBelow();
              } else {
                  // Enter -> Confirm input (blur)
                  e.target.blur();
              }
          }
      };

      const renderTextContent = () => {
          const props = {
              html: block.content,
              onChange: (content) => onUpdate({ content }),
              onInsertBelow, blockId: block.id, autoFocusId, onFocus,
              onConvert: handleConvert,
              placeholder: "Type '/' for commands"
          };

          switch (block.type) {
              case 'h1': return <ContentBlock tagName="h1" className="text-3xl font-bold mb-4" {...props} placeholder="Heading 1" />;
              case 'h2': return <ContentBlock tagName="h2" className="text-2xl font-bold mb-3 border-b border-gray-100 pb-1" {...props} placeholder="Heading 2" />;
              case 'h3': return <ContentBlock tagName="h3" className="text-xl font-bold mb-2" {...props} placeholder="Heading 3" />;
              case 'h4': return <ContentBlock tagName="h4" className="text-lg font-semibold mb-2 text-gray-600" {...props} placeholder="Heading 4" />;
              case 'ul': return <ContentBlock tagName="ul" className="mb-2" {...props} />;
              case 'ol': return <ContentBlock tagName="ol" className="mb-2" {...props} />;
              default: return <ContentBlock tagName="div" className="leading-relaxed min-h-[1.5em]" {...props} />;
          }
      };

      return (
          <>
              <div 
                  draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
                  className={`group relative flex gap-2 items-start p-1 rounded transition-all ${indicatorStyle} ${bgClass} ${borderClass}`}
              >
                  <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100 active:cursor-grabbing text-gray-400 block-handle" onClick={onHandleClick}>
                      <GripVertical size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                      {['text', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol'].includes(block.type) && renderTextContent()}
                      
                      {block.type === 'todo' && (
                          <div className="flex items-start gap-2 mb-1">
                              <div className="pt-1 select-none" contentEditable={false}>
                                  <input type="checkbox" checked={block.checked || false} onChange={(e) => onUpdate({ checked: e.target.checked })} className="w-4 h-4 cursor-pointer accent-blue-500 rounded border-gray-300" />
                              </div>
                              <div className={`flex-1 ${block.checked ? 'line-through text-gray-400' : ''}`}>
                                  <ContentBlock tagName="div" className="leading-relaxed min-h-[1.5em]" html={block.content} onChange={(content) => onUpdate({ content })} onInsertBelow={() => onInsertBelow('todo')} onInsertTextBelow={() => onInsertBelow('text')} onExitList={() => handleConvert('text')} blockId={block.id} autoFocusId={autoFocusId} onFocus={onFocus} onConvert={handleConvert} placeholder="To-do item" />
                              </div>
                          </div>
                      )}

                      {block.type === 'image' && (
                          <div className="space-y-2">
                              {block.url ? (
                                  <div className="group/image relative">
                                      <img src={block.url} alt="Content" className="max-w-full rounded shadow-sm max-h-[400px] object-cover hover:scale-[1.02] cursor-zoom-in transition-transform" onClick={() => setShowLightbox(true)} />
                                  </div>
                              ) : (
                                  <div className="bg-gray-100 p-4 rounded text-center border-2 border-dashed border-gray-300">
                                      <input className="w-full p-2 border rounded text-xs mb-2" placeholder="Paste image URL..." onBlur={(e) => onUpdate({ url: e.target.value })} onKeyDown={handleMediaKeyDown} autoFocus/>
                                  </div>
                              )}
                          </div>
                      )}
                      {block.type === 'video' && (
                          <div className="space-y-2">
                              {block.url ? (
                                  <div className="aspect-video w-full rounded overflow-hidden shadow-sm bg-black">
                                      <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeID(block.url)}`} frameBorder="0" allowFullScreen></iframe>
                                  </div>
                              ) : (
                                  <div className="bg-gray-100 p-4 rounded text-center border-2 border-dashed border-gray-300">
                                      <input className="w-full p-2 border rounded text-xs mb-2" placeholder="Paste YouTube URL..." onBlur={(e) => onUpdate({ url: e.target.value })} onKeyDown={handleMediaKeyDown} autoFocus/>
                                  </div>
                              )}
                          </div>
                      )}
                      {block.type === 'link' && (
                          <div className="p-3 bg-blue-50 rounded border border-blue-100 flex items-center gap-3">
                              <LinkIcon size={20} className="text-blue-500"/>
                              <div className="flex-1 min-w-0">
                                  <input className="w-full bg-transparent font-medium text-blue-700 outline-none" value={block.content} onChange={(e) => onUpdate({ content: e.target.value })} onKeyDown={handleMediaKeyDown} placeholder="Link Title" autoFocus/>
                                  <input className="w-full bg-transparent text-xs text-blue-400 outline-none" value={block.url || ''} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://example.com" />
                              </div>
                              {block.url && <a href={block.url} target="_blank" className="p-2 hover:bg-blue-100 rounded text-blue-600"><ChevronRight size={16}/></a>}
                          </div>
                      )}
                      {block.type === 'divider' && <div className="py-2"><hr className="border-t-2 border-gray-200" /></div>}
                      {block.type === 'gdoc' && (
                          <div className="space-y-2">
                              {block.driveFileId ? (
                                  <div className="border rounded overflow-hidden shadow-sm">
                                      {block.mimeType === 'application/vnd.google-apps.document' && (
                                          <iframe 
                                              src={`https://docs.google.com/document/d/${block.driveFileId}/preview`}
                                              className="w-full h-96 border-0"
                                              title="Google Doc"
                                          />
                                      )}
                                      {block.mimeType === 'application/vnd.google-apps.spreadsheet' && (
                                          <iframe 
                                              src={`https://docs.google.com/spreadsheets/d/${block.driveFileId}/preview`}
                                              className="w-full h-96 border-0"
                                              title="Google Sheet"
                                          />
                                      )}
                                      {block.mimeType === 'application/vnd.google-apps.presentation' && (
                                          <iframe 
                                              src={`https://docs.google.com/presentation/d/${block.driveFileId}/preview`}
                                              className="w-full h-96 border-0"
                                              title="Google Slide"
                                          />
                                      )}
                                      {block.webViewLink && (
                                          <div className="p-2 bg-gray-50 border-t flex items-center justify-between">
                                              <a href={block.webViewLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                                  Open in Google Drive
                                              </a>
                                              <button onClick={() => onUpdate({ driveFileId: null, webViewLink: null, mimeType: null })} className="text-xs text-gray-500 hover:text-red-600">
                                                  Remove
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="bg-gray-100 p-4 rounded text-center border-2 border-dashed border-gray-300">
                                      {typeof GoogleAPI !== 'undefined' && isAuthenticated ? (
                                          <button 
                                              onClick={() => {
                                                  GoogleAPI.showDrivePicker((file) => {
                                                      onUpdate({
                                                          driveFileId: file.id,
                                                          webViewLink: file.url,
                                                          mimeType: file.mimeType
                                                      });
                                                  });
                                              }}
                                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                          >
                                              Select Google Drive File
                                          </button>
                                      ) : (
                                          <div className="text-sm text-gray-500">
                                              Sign in with Google to embed Drive files
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
              {showLightbox && block.url && <ImageLightbox src={block.url} onClose={() => setShowLightbox(false)} />}
          </>
      )
  }

  const DEFAULT_SETTINGS = {
    theme: 'light', // 'light', 'dark', 'system'
    maxColumns: 3,
    condensedView: false,
  };

  function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [showSettings, setShowSettings] = useState(false);
    const [data, setData] = useState(INITIAL_DATA);
    const [activeNotebookId, setActiveNotebookId] = useState(null);
    const [activeTabId, setActiveTabId] = useState(null);
    const [activePageId, setActivePageId] = useState(null);
    const [editingPageId, setEditingPageId] = useState(null);
    const [editingTabId, setEditingTabId] = useState(null);
    const [editingNotebookId, setEditingNotebookId] = useState(null);
    const [draggedBlock, setDraggedBlock] = useState(null);
    const [dropTarget, setDropTarget] = useState(null); 
    const [activeTabMenu, setActiveTabMenu] = useState(null); 
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [autoFocusId, setAutoFocusId] = useState(null);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [blockMenu, setBlockMenu] = useState(null);
    const [notification, setNotification] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showCoverInput, setShowCoverInput] = useState(false);
    const [notebookIconPicker, setNotebookIconPicker] = useState(null); // { id, top, left }
    const [tabIconPicker, setTabIconPicker] = useState(null); // { id, top, left }
    const titleInputRef = useRef(null);
    const [shouldFocusTitle, setShouldFocusTitle] = useState(false);
    const shouldFocusPageRef = useRef(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    // Creation flow tracking: { notebookId, tabId, pageId } - tracks IDs created together for Enter flow
    const [creationFlow, setCreationFlow] = useState(null);
    
    // Refs for focusing notebook/tab inputs
    const notebookInputRefs = useRef({});
    const tabInputRefs = useRef({});
    
    // Page type menu and import states
    const [showPageTypeMenu, setShowPageTypeMenu] = useState(false);
    const [showUrlImport, setShowUrlImport] = useState(false);
    const [urlImportValue, setUrlImportValue] = useState('');
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [showEditEmbed, setShowEditEmbed] = useState(false);
    const [showDriveImport, setShowDriveImport] = useState(false);
    const [driveImportUrl, setDriveImportUrl] = useState('');
    const [showDocImport, setShowDocImport] = useState(false);
    const [showSheetImport, setShowSheetImport] = useState(false);
    const [showSlideImport, setShowSlideImport] = useState(false);
    const [docImportUrl, setDocImportUrl] = useState('');
    const [sheetImportUrl, setSheetImportUrl] = useState('');
    const [slideImportUrl, setSlideImportUrl] = useState('');
    const [viewedEmbedPages, setViewedEmbedPages] = useState(new Set());
    const [pageZoomLevels, setPageZoomLevels] = useState({});
    const [editEmbedName, setEditEmbedName] = useState('');
    const [editEmbedUrl, setEditEmbedUrl] = useState('');
    const [editEmbedViewMode, setEditEmbedViewMode] = useState('edit'); // 'edit' or 'preview'
    const [editingEmbedName, setEditingEmbedName] = useState(false);
    const [inlineUrlValue, setInlineUrlValue] = useState(''); // For inline URL editing in header
    const [showAccountPopup, setShowAccountPopup] = useState(false); // Hover popup for Google account
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false); // Sign out confirmation dialog
    
    const tabBarRef = useRef(null);

    // Google Drive authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    
    // Drive sync state
    const [driveRootFolderId, setDriveRootFolderId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    
    // Sync lock refs to prevent concurrent operations
    const syncLockRef = useRef(false);
    const pendingSyncRef = useRef(false);
    const [structureVersion, setStructureVersion] = useState(0); // State-based trigger for structure sync
    const lastContentSyncRef = useRef(Date.now());

    // Initialize Google APIs and check auth status
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (typeof GoogleAPI === 'undefined') {
                    console.warn('Google API not loaded, using localStorage fallback');
                    setIsLoadingAuth(false);
                    return;
                }

                await GoogleAPI.loadGapi();
                await GoogleAPI.initGoogleAuth();
                
                // checkAuthStatus now returns userInfo or null (restores session from storage)
                const userInfo = await GoogleAPI.checkAuthStatus();
                if (userInfo) {
                    setIsAuthenticated(true);
                    setUserEmail(userInfo.email);
                    setUserName(userInfo.name || userInfo.given_name || userInfo.email);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error initializing Google auth:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoadingAuth(false);
            }
        };

        initAuth();
    }, []);

    // Handle sign in
    const handleSignIn = async () => {
        try {
            setIsLoadingAuth(true);
            const userInfo = await GoogleAPI.signIn();
            setIsAuthenticated(true);
            setUserEmail(userInfo.email);
            setUserName(userInfo.name || userInfo.given_name || userInfo.email);
            showNotification('Signed in successfully', 'success');
            // Data loading is handled automatically by useEffect when isAuthenticated changes
        } catch (error) {
            console.error('Sign in error:', error);
            showNotification('Sign in failed', 'error');
        } finally {
            setIsLoadingAuth(false);
        }
    };

    // Handle sign out
    const handleSignOut = () => {
        GoogleAPI.signOut();
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserName(null);
        showNotification('Signed out', 'info');
        // Reload to reset to localStorage
        window.location.reload();
    };

    useEffect(() => {
      const loadData = async () => {
        // Wait for auth to finish loading
        if (isLoadingAuth) return;

        if (isAuthenticated && typeof GoogleAPI !== 'undefined') {
          // Load from Google Drive
          try {
            const manifest = await GoogleAPI.getAppDataFile();
            if (manifest) {
              // Load data from manifest
              if (manifest.data) {
                setData(manifest.data);
                if (manifest.data.notebooks.length > 0) {
                  const firstNb = manifest.data.notebooks[0];
                  setActiveNotebookId(firstNb.id);
                  const tabId = firstNb.activeTabId || firstNb.tabs[0]?.id;
                  setActiveTabId(tabId);
                  if(tabId) {
                     const tab = firstNb.tabs.find(t => t.id === tabId);
                     if(tab) setActivePageId(tab.activePageId || tab.pages[0]?.id);
                  }
                }
              }
              
              // Load settings from manifest
              if (manifest.settings) {
                setSettings({ ...DEFAULT_SETTINGS, ...manifest.settings });
              }
            } else {
              // No manifest found, check for localStorage migration
              const saved = localStorage.getItem('note-app-data-v1');
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  // Migrate to Drive
                  await GoogleAPI.createAppDataFile({
                    data: parsed,
                    settings: JSON.parse(localStorage.getItem('note-app-settings-v1') || '{}'),
                    version: APP_VERSION,
                    lastModified: Date.now()
                  });
                  setData(parsed);
                  if (parsed.notebooks.length > 0) {
                    const firstNb = parsed.notebooks[0];
                    setActiveNotebookId(firstNb.id);
                    const tabId = firstNb.activeTabId || firstNb.tabs[0]?.id;
                    setActiveTabId(tabId);
                    if(tabId) {
                       const tab = firstNb.tabs.find(t => t.id === tabId);
                       if(tab) setActivePageId(tab.activePageId || tab.pages[0]?.id);
                    }
                  }
                  showNotification('Data migrated to Google Drive', 'success');
                } catch (e) {
                  console.error('Migration error:', e);
                  // Fall through to INITIAL_DATA
                }
              } else {
                // Create initial manifest
                await GoogleAPI.createAppDataFile({
                  data: INITIAL_DATA,
                  settings: DEFAULT_SETTINGS,
                  version: APP_VERSION,
                  lastModified: Date.now()
                });
                setData(INITIAL_DATA);
                setActiveNotebookId(INITIAL_DATA.notebooks[0].id);
                setActiveTabId(INITIAL_DATA.notebooks[0].tabs[0].id);
                setActivePageId(INITIAL_DATA.notebooks[0].tabs[0].pages[0].id);
              }
            }
          } catch (error) {
            console.error('Error loading from Drive:', error);
            if (error.message.includes('Authentication')) {
              showNotification('Authentication expired. Please sign in again.', 'error');
            } else {
              showNotification('Failed to load from Drive. Using local storage.', 'error');
              // Fallback to localStorage
              loadFromLocalStorage();
            }
          }
        } else {
          // Not authenticated, use localStorage
          loadFromLocalStorage();
        }
      };

      const loadFromLocalStorage = () => {
        // Load settings
        const savedSettings = localStorage.getItem('note-app-settings-v1');
        if (savedSettings) {
          try {
            setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
          } catch (e) { console.error(e); }
        }
        
        // Load data
        const saved = localStorage.getItem('note-app-data-v1');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setData(parsed);
            if (parsed.notebooks.length > 0) {
              const firstNb = parsed.notebooks[0];
              setActiveNotebookId(firstNb.id);
              const tabId = firstNb.activeTabId || firstNb.tabs[0]?.id;
              setActiveTabId(tabId);
              if(tabId) {
                 const tab = firstNb.tabs.find(t => t.id === tabId);
                 if(tab) setActivePageId(tab.activePageId || tab.pages[0]?.id);
              }
            }
          } catch (e) { console.error(e); }
        } else {
          setActiveNotebookId(INITIAL_DATA.notebooks[0].id);
          setActiveTabId(INITIAL_DATA.notebooks[0].tabs[0].id);
          setActivePageId(INITIAL_DATA.notebooks[0].tabs[0].pages[0].id);
        }
      };

      loadData();
    }, [isAuthenticated, isLoadingAuth]);

    // Debounced save to Drive or localStorage
    const debouncedSave = useRef(null);
    
    useEffect(() => {
        if (isLoadingAuth) return;

        // Clear existing timeout
        if (debouncedSave.current) {
            clearTimeout(debouncedSave.current);
        }

        // Debounce saves (500ms)
        debouncedSave.current = setTimeout(async () => {
            if (isAuthenticated && typeof GoogleAPI !== 'undefined') {
                // Save to Google Drive
                try {
                    await GoogleAPI.updateAppDataFile({
                        data: data,
                        settings: settings,
                        version: APP_VERSION,
                        lastModified: Date.now()
                    });
                } catch (error) {
                    console.error('Failed to save to Drive:', error);
                    if (error.message.includes('Authentication')) {
                        showNotification('Authentication expired. Please sign in again.', 'error');
                    } else {
                        showNotification('Save failed. Retrying...', 'error');
                        // Retry once after a delay
                        setTimeout(async () => {
                            try {
                                await GoogleAPI.updateAppDataFile({
                                    data: data,
                                    settings: settings,
                                    version: APP_VERSION,
                                    lastModified: Date.now()
                                });
                            } catch (retryError) {
                                console.error('Retry save failed:', retryError);
                            }
                        }, 2000);
                    }
                }
            } else {
                // Fallback to localStorage
                localStorage.setItem('note-app-data-v1', JSON.stringify(data));
            }
        }, 500);

        return () => {
            if (debouncedSave.current) {
                clearTimeout(debouncedSave.current);
            }
        };
    }, [data, settings, isAuthenticated, isLoadingAuth]);
    
    // Save settings and apply theme
    useEffect(() => { 
        if (!isAuthenticated || typeof GoogleAPI === 'undefined') {
            localStorage.setItem('note-app-settings-v1', JSON.stringify(settings));
        }
        // Apply theme
        const root = document.documentElement;
        let effectiveTheme = settings.theme;
        if (settings.theme === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);
    }, [settings, isAuthenticated]);
    
    // Focus sidebar nav item logic
    useEffect(() => {
        if (shouldFocusPageRef.current && activePageId) {
            const el = document.getElementById(`nav-page-${activePageId}`);
            if (el) el.focus();
            shouldFocusPageRef.current = false;
        }
    }, [activePageId]);

    // Track viewed embed pages for caching
    useEffect(() => {
        if (activePageId && activePage?.embedUrl) {
            setViewedEmbedPages(prev => new Set([...prev, activePageId]));
        }
    }, [activePageId, activePage?.embedUrl]);

    // Focus main Title logic
    useEffect(() => {
        if (shouldFocusTitle) {
            setTimeout(() => {
                if (titleInputRef.current) {
                    titleInputRef.current.focus();
                    titleInputRef.current.select();
                }
                setShouldFocusTitle(false);
            }, 100);
        }
    }, [activePageId, shouldFocusTitle]);

    // Focus notebook input when editing starts
    useEffect(() => {
        if (editingNotebookId) {
            setTimeout(() => {
                const input = notebookInputRefs.current[editingNotebookId];
                if (input) { input.focus(); input.select(); }
            }, 100);
        }
    }, [editingNotebookId]);

    // Focus tab input when editing starts
    useEffect(() => {
        if (editingTabId) {
            setTimeout(() => {
                const input = tabInputRefs.current[editingTabId];
                if (input) { input.focus(); input.select(); }
            }, 100);
        }
    }, [editingTabId]);

    // Initialize Drive root folder and sync token
    useEffect(() => {
        if (!isAuthenticated || isLoadingAuth || typeof GoogleAPI === 'undefined') return;

        const initDriveSync = async () => {
            try {
                setIsSyncing(true);
                // Ensure root folder exists and save its ID
                const rootFolderId = await GoogleAPI.getOrCreateRootFolder();
                setDriveRootFolderId(rootFolderId);
                setLastSyncTime(Date.now());
            } catch (error) {
                console.error('Error initializing Drive sync:', error);
            } finally {
                setIsSyncing(false);
            }
        };

        initDriveSync();
    }, [isAuthenticated, isLoadingAuth]);

    // Sync folder STRUCTURE to Drive (notebooks, tabs as folders; page files created but not updated)
    // This only runs when structural changes occur (add/delete/rename notebooks/tabs/pages)
    useEffect(() => {
        if (!isAuthenticated || isLoadingAuth || typeof GoogleAPI === 'undefined' || !driveRootFolderId) return;

        const syncStructure = async () => {
            // Sync lock - prevent concurrent operations
            if (syncLockRef.current) {
                pendingSyncRef.current = true;
                return;
            }
            syncLockRef.current = true;
            
            try {
                setIsSyncing(true);
                const driveIdUpdates = {}; // Only track drive IDs, not content

                // Sync each notebook (create folders only if missing)
                for (const notebook of data.notebooks) {
                    if (!notebook.driveFolderId) {
                        try {
                            const folderId = await GoogleAPI.getOrCreateFolder(notebook.name, driveRootFolderId);
                            driveIdUpdates[notebook.id] = { driveFolderId: folderId };
                        } catch (error) {
                            console.error(`Error creating folder for notebook ${notebook.name}:`, error);
                        }
                    }

                    const notebookFolderId = notebook.driveFolderId || driveIdUpdates[notebook.id]?.driveFolderId;
                    if (!notebookFolderId) continue;

                    // Sync tabs within this notebook
                    for (const tab of notebook.tabs) {
                        if (!tab.driveFolderId) {
                            try {
                                const folderId = await GoogleAPI.getOrCreateFolder(tab.name, notebookFolderId);
                                if (!driveIdUpdates[notebook.id]) driveIdUpdates[notebook.id] = { tabs: {} };
                                if (!driveIdUpdates[notebook.id].tabs) driveIdUpdates[notebook.id].tabs = {};
                                driveIdUpdates[notebook.id].tabs[tab.id] = { driveFolderId: folderId };
                            } catch (error) {
                                console.error(`Error creating folder for tab ${tab.name}:`, error);
                            }
                        }

                        const tabFolderId = tab.driveFolderId || driveIdUpdates[notebook.id]?.tabs?.[tab.id]?.driveFolderId;
                        if (!tabFolderId) continue;

                        // Create page files (but don't update content here - that's content sync)
                        for (const page of tab.pages) {
                            const pageType = page.type || 'block';
                            const isGooglePage = ['doc', 'sheet', 'slide', 'pdf', 'drive'].includes(pageType);
                            
                            // For block pages: create file only if it doesn't exist
                            if (!isGooglePage && !page.driveFileId) {
                                try {
                                    const fileId = await GoogleAPI.syncPageToDrive(page, tabFolderId);
                                    if (!driveIdUpdates[notebook.id]) driveIdUpdates[notebook.id] = { tabs: {} };
                                    if (!driveIdUpdates[notebook.id].tabs) driveIdUpdates[notebook.id].tabs = {};
                                    if (!driveIdUpdates[notebook.id].tabs[tab.id]) driveIdUpdates[notebook.id].tabs[tab.id] = { pages: {} };
                                    if (!driveIdUpdates[notebook.id].tabs[tab.id].pages) driveIdUpdates[notebook.id].tabs[tab.id].pages = {};
                                    driveIdUpdates[notebook.id].tabs[tab.id].pages[page.id] = { driveFileId: fileId };
                                } catch (error) {
                                    console.error(`Error creating file for page ${page.name}:`, error);
                                }
                            }
                            
                            // For Google pages: create JSON link file and shortcut if missing
                            if (isGooglePage && page.driveFileId) {
                                // Create JSON link file if missing
                                if (!page.driveLinkFileId) {
                                    try {
                                        const linkFileId = await GoogleAPI.syncGooglePageLink(page, tabFolderId);
                                        if (!driveIdUpdates[notebook.id]) driveIdUpdates[notebook.id] = { tabs: {} };
                                        if (!driveIdUpdates[notebook.id].tabs) driveIdUpdates[notebook.id].tabs = {};
                                        if (!driveIdUpdates[notebook.id].tabs[tab.id]) driveIdUpdates[notebook.id].tabs[tab.id] = { pages: {} };
                                        if (!driveIdUpdates[notebook.id].tabs[tab.id].pages) driveIdUpdates[notebook.id].tabs[tab.id].pages = {};
                                        driveIdUpdates[notebook.id].tabs[tab.id].pages[page.id] = { 
                                            ...(driveIdUpdates[notebook.id].tabs[tab.id].pages[page.id] || {}),
                                            driveLinkFileId: linkFileId 
                                        };
                                    } catch (error) {
                                        console.error(`Error creating link file for page ${page.name}:`, error);
                                    }
                                }
                                // Create shortcut if missing
                                if (!page.driveShortcutId) {
                                    try {
                                        const shortcut = await GoogleAPI.createDriveShortcut(page.name, page.driveFileId, tabFolderId);
                                        if (!driveIdUpdates[notebook.id]) driveIdUpdates[notebook.id] = { tabs: {} };
                                        if (!driveIdUpdates[notebook.id].tabs) driveIdUpdates[notebook.id].tabs = {};
                                        if (!driveIdUpdates[notebook.id].tabs[tab.id]) driveIdUpdates[notebook.id].tabs[tab.id] = { pages: {} };
                                        if (!driveIdUpdates[notebook.id].tabs[tab.id].pages) driveIdUpdates[notebook.id].tabs[tab.id].pages = {};
                                        driveIdUpdates[notebook.id].tabs[tab.id].pages[page.id] = { 
                                            ...(driveIdUpdates[notebook.id].tabs[tab.id].pages[page.id] || {}),
                                            driveShortcutId: shortcut.id 
                                        };
                                    } catch (error) {
                                        console.error(`Error creating shortcut for page ${page.name}:`, error);
                                    }
                                }
                            }
                        }
                    }
                }

                // Apply drive ID updates without touching content (functional update)
                if (Object.keys(driveIdUpdates).length > 0) {
                    setData(prev => {
                        const next = { ...prev, notebooks: prev.notebooks.map(notebook => {
                            const nbUpdate = driveIdUpdates[notebook.id];
                            if (!nbUpdate) return notebook;
                            
                            return {
                                ...notebook,
                                driveFolderId: nbUpdate.driveFolderId || notebook.driveFolderId,
                                tabs: notebook.tabs.map(tab => {
                                    const tabUpdate = nbUpdate.tabs?.[tab.id];
                                    if (!tabUpdate) return tab;
                                    
                                    return {
                                        ...tab,
                                        driveFolderId: tabUpdate.driveFolderId || tab.driveFolderId,
                                        pages: tab.pages.map(page => {
                                            const pageUpdate = tabUpdate.pages?.[page.id];
                                            if (!pageUpdate) return page;
                                            
                                            return {
                                                ...page,
                                                driveFileId: pageUpdate.driveFileId || page.driveFileId,
                                                driveShortcutId: pageUpdate.driveShortcutId || page.driveShortcutId,
                                                driveLinkFileId: pageUpdate.driveLinkFileId || page.driveLinkFileId
                                            };
                                        })
                                    };
                                })
                            };
                        })};
                        return next;
                    });
                }
                
                // Update manifest.json and index.html (only on structure sync)
                try {
                    await GoogleAPI.updateManifest(data, driveRootFolderId, APP_VERSION);
                    await GoogleAPI.uploadIndexHtml(generateOfflineViewerHtml(), driveRootFolderId);
                } catch (error) {
                    console.error('Error updating manifest/index.html:', error);
                }
                
                setLastSyncTime(Date.now());
            } catch (error) {
                console.error('Error syncing structure:', error);
            } finally {
                setIsSyncing(false);
                syncLockRef.current = false;
                
                // If a sync was requested while we were syncing, run it now
                if (pendingSyncRef.current) {
                    pendingSyncRef.current = false;
                    setTimeout(syncStructure, 1000);
                }
            }
        };

        // Longer debounce for structure sync (5 seconds)
        const syncTimeout = setTimeout(syncStructure, 5000);
        return () => clearTimeout(syncTimeout);
    }, [structureVersion, isAuthenticated, isLoadingAuth, driveRootFolderId]);

    // Content sync - update page content files after user stops editing (idle detection)
    useEffect(() => {
        if (!isAuthenticated || isLoadingAuth || typeof GoogleAPI === 'undefined' || !driveRootFolderId) return;
        
        const syncContent = async () => {
            // Don't sync content if structure sync is running
            if (syncLockRef.current) return;
            
            // Find pages that have driveFileId and need content update
            for (const notebook of data.notebooks) {
                for (const tab of notebook.tabs) {
                    const tabFolderId = tab.driveFolderId;
                    if (!tabFolderId) continue;
                    
                    for (const page of tab.pages) {
                        const pageType = page.type || 'block';
                        const isGooglePage = ['doc', 'sheet', 'slide', 'pdf', 'drive'].includes(pageType);
                        
                        // Only sync block pages that already have a driveFileId
                        if (!isGooglePage && page.driveFileId) {
                            try {
                                await GoogleAPI.syncPageToDrive(page, tabFolderId);
                            } catch (error) {
                                console.error(`Error updating page content ${page.name}:`, error);
                            }
                        }
                    }
                }
            }
            lastContentSyncRef.current = Date.now();
        };

        // Content sync after 10 seconds of idle (longer debounce to avoid conflicts)
        const contentSyncTimeout = setTimeout(syncContent, 10000);
        return () => clearTimeout(contentSyncTimeout);
    }, [data.notebooks, isAuthenticated, isLoadingAuth, driveRootFolderId]);

    // Reconciliation - verify Drive folder/file names match the notebook and fix mismatches
    // Runs periodically to catch any sync issues
    useEffect(() => {
        if (!isAuthenticated || isLoadingAuth || typeof GoogleAPI === 'undefined' || !driveRootFolderId) return;
        
        const reconcileDrive = async () => {
            // Don't reconcile if sync is running
            if (syncLockRef.current) return;
            
            console.log('Running Drive reconciliation...');
            let fixCount = 0;
            
            for (const notebook of data.notebooks) {
                if (notebook.driveFolderId) {
                    try {
                        const driveItem = await GoogleAPI.getDriveItem(notebook.driveFolderId);
                        const expectedName = GoogleAPI.sanitizeFileName(notebook.name);
                        if (driveItem && !driveItem.trashed && driveItem.name !== expectedName) {
                            console.log(`Fixing notebook folder: "${driveItem.name}" -> "${expectedName}"`);
                            await GoogleAPI.renameDriveItem(notebook.driveFolderId, expectedName);
                            fixCount++;
                        }
                    } catch (error) {
                        console.error(`Error reconciling notebook ${notebook.name}:`, error);
                    }
                }
                
                for (const tab of notebook.tabs) {
                    if (tab.driveFolderId) {
                        try {
                            const driveItem = await GoogleAPI.getDriveItem(tab.driveFolderId);
                            const expectedName = GoogleAPI.sanitizeFileName(tab.name);
                            if (driveItem && !driveItem.trashed && driveItem.name !== expectedName) {
                                console.log(`Fixing tab folder: "${driveItem.name}" -> "${expectedName}"`);
                                await GoogleAPI.renameDriveItem(tab.driveFolderId, expectedName);
                                fixCount++;
                            }
                        } catch (error) {
                            console.error(`Error reconciling tab ${tab.name}:`, error);
                        }
                    }
                    
                    for (const page of tab.pages) {
                        if (page.driveFileId) {
                            try {
                                const driveItem = await GoogleAPI.getDriveItem(page.driveFileId);
                                const expectedName = GoogleAPI.sanitizeFileName(page.name) + '.json';
                                if (driveItem && !driveItem.trashed && driveItem.name !== expectedName) {
                                    console.log(`Fixing page file: "${driveItem.name}" -> "${expectedName}"`);
                                    await GoogleAPI.renameDriveItem(page.driveFileId, expectedName);
                                    fixCount++;
                                }
                            } catch (error) {
                                console.error(`Error reconciling page ${page.name}:`, error);
                            }
                        }
                    }
                }
            }
            
            if (fixCount > 0) {
                console.log(`Reconciliation complete: fixed ${fixCount} item(s)`);
                showNotification(`Fixed ${fixCount} Drive item(s)`, 'info');
            }
        };

        // Run reconciliation 15 seconds after load/auth, then every 60 seconds
        const initialReconcile = setTimeout(reconcileDrive, 15000);
        const reconcileInterval = setInterval(reconcileDrive, 60000);
        
        return () => {
            clearTimeout(initialReconcile);
            clearInterval(reconcileInterval);
        };
    }, [isAuthenticated, isLoadingAuth, driveRootFolderId, data.notebooks]);

    // NOTE: Polling for Drive changes has been removed.
    // The notebook is now the "master" - it only PUSHES changes to Drive.
    // This eliminates the "bounce" effect where changes would sync back and forth.
    // Multi-user collaboration can be added later as a separate feature.

    useEffect(() => {
      const handleClickOutside = (e) => {
         if (!e.target.closest('.tab-settings-trigger') && !e.target.closest('.tab-settings-menu')) setActiveTabMenu(null);
         if (!e.target.closest('.add-menu-container')) setShowAddMenu(false);
         if (!e.target.closest('.block-handle') && !e.target.closest('.block-menu')) {
             if (!e.target.closest('[contenteditable="true"]')) setSelectedBlockId(null);
             setBlockMenu(null);
         }
         if (editingTabId && !e.target.closest('.tab-input')) setEditingTabId(null);
         if (editingNotebookId && !e.target.closest('.notebook-input')) setEditingNotebookId(null);
         if (editingPageId && !e.target.closest('.page-input')) setEditingPageId(null);
         if (!e.target.closest('.icon-picker-trigger') && !e.target.closest('.icon-picker')) setShowIconPicker(false);
         if (!e.target.closest('.cover-input-trigger') && !e.target.closest('.cover-input')) setShowCoverInput(false);
         if (!e.target.closest('.notebook-icon-trigger') && !e.target.closest('.notebook-icon-picker')) setNotebookIconPicker(null);
         if (!e.target.closest('.tab-icon-trigger') && !e.target.closest('.tab-icon-picker')) setTabIconPicker(null);
         if (!e.target.closest('.settings-modal') && !e.target.closest('.settings-trigger')) setShowSettings(false);
         if (!e.target.closest('.page-type-menu') && !e.target.closest('.page-type-trigger')) setShowPageTypeMenu(false);
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [editingTabId, editingNotebookId, editingPageId]);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const saveToHistory = (newData) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData ? newData : JSON.parse(JSON.stringify(data)));
        if (newHistory.length > 30) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prevData = history[historyIndex - 1];
            setData(prevData);
            setHistoryIndex(historyIndex - 1);
            showNotification('Undo', 'info');
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextData = history[historyIndex + 1];
            setData(nextData);
            setHistoryIndex(historyIndex + 1);
            showNotification('Redo', 'info');
        }
    };

    const activeNotebook = data.notebooks.find(n => n.id === activeNotebookId);
    const activeTab = activeNotebook?.tabs.find(t => t.id === activeTabId);
    const activePage = activeTab?.pages.find(p => p.id === activePageId);

    const updatePageContent = (rows, shouldSaveHistory = false) => {
      if (!activePageId || !activeTabId || !activeNotebookId) return;
      if (shouldSaveHistory) saveToHistory();
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => 
                  tab.id !== activeTabId ? tab : {
                      ...tab,
                      pages: tab.pages.map(page => 
                          page.id !== activePageId ? page : { ...page, rows }
                      )
                  }
              )
          }
        )
      };
      setData(newData);
    };

    const updatePageMeta = (updates) => {
        if (!activePageId) return;
        saveToHistory();
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(tab => 
                        tab.id !== activeTabId ? tab : {
                            ...tab,
                            pages: tab.pages.map(page => 
                                page.id !== activePageId ? page : { ...page, ...updates }
                            )
                        }
                    )
                }
            )
        }));
    }

    const removeBlock = (blockId) => {
        let newRows = activePage.rows.map(row => ({
            ...row,
            columns: row.columns.map(col => ({
                ...col,
                blocks: col.blocks.filter(b => b.id !== blockId)
            })).filter(col => col.blocks.length > 0)
        })).filter(row => row.columns.length > 0);
        updatePageContent(newRows, true);
        showNotification('Block deleted', 'success');
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const redoKey = isMac ? (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'z') : (e.ctrlKey && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')));
            const undoKey = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;

            if (redoKey) { e.preventDefault(); redo(); } 
            else if (undoKey) { e.preventDefault(); undo(); }
            
            if (selectedBlockId && e.key === 'Delete') {
                e.preventDefault();
                removeBlock(selectedBlockId);
                setSelectedBlockId(null);
                setBlockMenu(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, historyIndex, data, selectedBlockId]);

    const selectNotebook = (notebookId) => {
        const nb = data.notebooks.find(n => n.id === notebookId);
        if (!nb) return;
        setActiveNotebookId(notebookId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        const targetTabId = nb.activeTabId || (nb.tabs && nb.tabs[0] ? nb.tabs[0].id : null);
        setActiveTabId(targetTabId);
        if (targetTabId) {
            const tab = nb.tabs.find(t => t.id === targetTabId);
            setActivePageId(tab ? (tab.activePageId || (tab.pages && tab.pages[0] ? tab.pages[0].id : null)) : null);
        } else {
            setActivePageId(null);
        }
    };

    const selectTab = (tabId) => {
        setActiveTabId(tabId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id === activeNotebookId ? { ...nb, activeTabId: tabId } : nb
            )
        }));
        const nb = data.notebooks.find(n => n.id === activeNotebookId);
        const tab = nb?.tabs.find(t => t.id === tabId);
        if (tab) {
            setActivePageId(tab.activePageId || (tab.pages && tab.pages[0] ? tab.pages[0].id : null));
        }
    };

    const selectPage = (pageId) => {
        setActivePageId(pageId);
        setEditingPageId(null);
        setEditingTabId(null);
        setEditingNotebookId(null);
        
        // Track viewed embed pages for caching
        const page = data.notebooks.flatMap(nb => nb.tabs.flatMap(t => t.pages)).find(p => p.id === pageId);
        if (page?.embedUrl) {
            setViewedEmbedPages(prev => new Set([...prev, pageId]));
        }
        
        // Persist the last open page to the tab
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(t => 
                        t.id === activeTabId ? { ...t, activePageId: pageId } : t
                    )
                }
            )
        }));
    };

    const toggleStar = (pageId, notebookId, tabId) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== notebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(t => 
                        t.id !== tabId ? t : {
                            ...t,
                            pages: t.pages.map(p => 
                                p.id === pageId ? { ...p, starred: !p.starred } : p
                            )
                        }
                    )
                }
            )
        }));
    };

    // Zoom helpers for embedded pages
    const getPageZoom = (pageId) => pageZoomLevels[pageId] || 100;
    const setPageZoom = (pageId, zoom) => {
        const clampedZoom = Math.min(200, Math.max(25, zoom));
        setPageZoomLevels(prev => ({ ...prev, [pageId]: clampedZoom }));
    };

    // Toggle between edit and preview mode for Google pages
    const toggleViewMode = (pageId) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => ({
                ...nb,
                tabs: nb.tabs.map(t => ({
                    ...t,
                    pages: t.pages.map(p => {
                        if (p.id !== pageId || !p.embedUrl) return p;
                        
                        // Toggle between /preview and /edit in the URL
                        let newEmbedUrl;
                        if (p.embedUrl.includes('/preview')) {
                            newEmbedUrl = p.embedUrl.replace('/preview', '/edit');
                        } else if (p.embedUrl.includes('/edit')) {
                            newEmbedUrl = p.embedUrl.replace('/edit', '/preview');
                        } else {
                            return p; // No change if neither found
                        }
                        return { ...p, embedUrl: newEmbedUrl };
                    })
                }))
            }))
        }));
    };

    // Get all starred pages across all notebooks/tabs
    const getStarredPages = () => {
        const starred = [];
        data.notebooks.forEach(nb => {
            nb.tabs.forEach(tab => {
                tab.pages.forEach(page => {
                    if (page.starred) {
                        starred.push({
                            ...page,
                            notebookId: nb.id,
                            tabId: tab.id,
                            notebookName: nb.name,
                            tabName: tab.name
                        });
                    }
                });
            });
        });
        return starred;
    };

    // Helper to create a default page with one empty text block
    const createDefaultPage = (name = 'New Page') => {
      return { 
        id: generateId(), 
        name, 
        createdAt: Date.now(), 
        rows: [{ id: generateId(), columns: [{ id: generateId(), blocks: [{ id: generateId(), type: 'text', content: '' }] }] }],
        icon: '📄', 
        cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
      };
    };

    const addNotebook = async () => {
      saveToHistory();
      const newPage = createDefaultPage();
      const newTab = { id: generateId(), name: 'New Tab', icon: '📋', color: COLORS[0].name, pages: [newPage], activePageId: newPage.id };
      const newNb = { id: generateId(), name: 'New Notebook', icon: '📓', tabs: [newTab], activeTabId: newTab.id };
      const newData = { ...data, notebooks: [...data.notebooks, newNb] };
      setData(newData);
      setActiveNotebookId(newNb.id);
      setActiveTabId(newTab.id);
      setActivePageId(newPage.id);
      setEditingPageId(null);
      setEditingTabId(null);
      setEditingNotebookId(newNb.id);
      // Set creation flow to enable Enter key navigation: notebook → tab → page title
      setCreationFlow({ notebookId: newNb.id, tabId: newTab.id, pageId: newPage.id });
      showNotification('Notebook created', 'success');
      // Trigger structure sync
      setStructureVersion(v => v + 1);
      
      // Sync to Drive if authenticated
      if (isAuthenticated && typeof GoogleAPI !== 'undefined') {
          try {
              const rootFolderId = await GoogleAPI.getOrCreateRootFolder();
              const notebookFolderId = await GoogleAPI.syncNotebookToDrive(newNb, rootFolderId);
              const tabFolderId = await GoogleAPI.syncTabToDrive(newTab, notebookFolderId);
              const pageFileId = await GoogleAPI.syncPageToDrive(newPage, tabFolderId);
              
              // Update local data with Drive IDs
              setData(prev => ({
                  ...prev,
                  notebooks: prev.notebooks.map(nb => 
                      nb.id === newNb.id ? {
                          ...nb,
                          driveFolderId: notebookFolderId,
                          tabs: nb.tabs.map(tab => 
                              tab.id === newTab.id ? {
                                  ...tab,
                                  driveFolderId: tabFolderId,
                                  pages: tab.pages.map(page => 
                                      page.id === newPage.id ? { ...page, driveFileId: pageFileId } : page
                                  )
                              } : tab
                          )
                      } : nb
                  )
              }));
          } catch (error) {
              console.error('Error syncing notebook to Drive:', error);
          }
      }
    };

    const addTab = async () => {
      if (!activeNotebookId) return;
      saveToHistory();
      const activeNotebook = data.notebooks.find(nb => nb.id === activeNotebookId);
      const newPage = createDefaultPage();
      const newTab = { id: generateId(), name: 'New Tab', icon: '📋', color: getNextTabColor(activeNotebook?.tabs), pages: [newPage], activePageId: newPage.id };
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id === activeNotebookId ? { ...nb, tabs: [...nb.tabs, newTab], activeTabId: newTab.id } : nb
        )
      };
      setData(newData);
      setActiveTabId(newTab.id);
      setActivePageId(newPage.id);
      setEditingPageId(null);
      setEditingTabId(newTab.id);
      setEditingNotebookId(null);
      showNotification('Section created', 'success');
      // Trigger structure sync
      setStructureVersion(v => v + 1);
      
      // Sync to Drive if authenticated
      if (isAuthenticated && typeof GoogleAPI !== 'undefined' && activeNotebook?.driveFolderId) {
          try {
              const tabFolderId = await GoogleAPI.syncTabToDrive(newTab, activeNotebook.driveFolderId);
              const pageFileId = await GoogleAPI.syncPageToDrive(newPage, tabFolderId);
              
              // Update local data with Drive IDs
              setData(prev => ({
                  ...prev,
                  notebooks: prev.notebooks.map(nb => 
                      nb.id === activeNotebookId ? {
                          ...nb,
                          tabs: nb.tabs.map(tab => 
                              tab.id === newTab.id ? {
                                  ...tab,
                                  driveFolderId: tabFolderId,
                                  pages: tab.pages.map(page => 
                                      page.id === newPage.id ? { ...page, driveFileId: pageFileId } : page
                                  )
                              } : tab
                          )
                      } : nb
                  )
              }));
          } catch (error) {
              console.error('Error syncing tab to Drive:', error);
          }
      }
    };

    const addPage = async () => {
      if (!activeTabId) return;
      saveToHistory();
      const newPage = createDefaultPage();
      const activeNotebook = data.notebooks.find(nb => nb.id === activeNotebookId);
      const activeTab = activeNotebook?.tabs.find(t => t.id === activeTabId);
      
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => 
                  tab.id !== activeTabId ? tab : {
                      ...tab,
                      pages: [...tab.pages, newPage],
                      activePageId: newPage.id
                  }
              )
          }
        )
      };
      setData(newData);
      setActivePageId(newPage.id);
      setEditingPageId(null);  // Don't edit in sidebar
      setEditingTabId(null);
      setEditingNotebookId(null);
      setShouldFocusTitle(true); // Focus main title
      showNotification('Page created', 'success');
      // Trigger structure sync
      setStructureVersion(v => v + 1);
      
      // Sync to Drive if authenticated
      if (isAuthenticated && typeof GoogleAPI !== 'undefined' && activeTab?.driveFolderId) {
          try {
              const pageFileId = await GoogleAPI.syncPageToDrive(newPage, activeTab.driveFolderId);
              
              // Update local data with Drive ID
              setData(prev => ({
                  ...prev,
                  notebooks: prev.notebooks.map(nb => 
                      nb.id === activeNotebookId ? {
                          ...nb,
                          tabs: nb.tabs.map(tab => 
                              tab.id === activeTabId ? {
                                  ...tab,
                                  pages: tab.pages.map(page => 
                                      page.id === newPage.id ? { ...page, driveFileId: pageFileId } : page
                                  )
                              } : tab
                          )
                      } : nb
                  )
              }));
          } catch (error) {
              console.error('Error syncing page to Drive:', error);
          }
      }
    };

    // Add a page from a Google Drive URL
    const addGooglePageFromUrl = (url) => {
      if (!activeTabId || !url) return false;
      
      // Parse Google Drive URLs to extract file ID and type
      let fileId = null;
      let pageType = 'drive';
      let icon = '📁';
      let typeName = 'File';
      
      // Match various Google URLs
      const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/);
      const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      const slideMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9-_]+)/);
      const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/);
      const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9-_]+)/);
      
      if (docMatch) {
        fileId = docMatch[1];
        pageType = 'doc';
        icon = '📄';
        typeName = 'Doc';
      } else if (sheetMatch) {
        fileId = sheetMatch[1];
        pageType = 'sheet';
        icon = '📊';
        typeName = 'Sheet';
      } else if (slideMatch) {
        fileId = slideMatch[1];
        pageType = 'slide';
        icon = '📽️';
        typeName = 'Slides';
      } else if (driveMatch) {
        fileId = driveMatch[1];
      } else if (openMatch) {
        fileId = openMatch[1];
      }
      
      if (!fileId) {
        showNotification('Could not parse Google Drive URL', 'error');
        return false;
      }
      
      // Build embed URL based on type (default to edit mode for Google docs)
      let embedUrl;
      if (pageType === 'doc') {
        embedUrl = `https://docs.google.com/document/d/${fileId}/edit`;
      } else if (pageType === 'sheet') {
        embedUrl = `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
      } else if (pageType === 'slide') {
        embedUrl = `https://docs.google.com/presentation/d/${fileId}/edit`;
      } else {
        // Generic Drive files stay at preview (can't be edited inline)
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
      
      saveToHistory();
      const newPage = {
        id: generateId(),
        name: `Google ${typeName}`,
        type: pageType,
        embedUrl,
        driveFileId: fileId,
        webViewLink: url,
        icon,
        createdAt: Date.now()
      };
      
      setData(prev => ({
        ...prev,
        notebooks: prev.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: [...tab.pages, newPage],
                activePageId: newPage.id
              }
            )
          }
        )
      }));
      
      setActivePageId(newPage.id);
      setStructureVersion(v => v + 1);
      showNotification(`Google ${typeName} added`, 'success');
      return true;
    };

    // Add a page from Google Drive Picker
    const addGooglePage = (file) => {
      if (!activeTabId || !file) return;
      
      // Determine type and icon based on MIME type
      let icon, typeName, pageType;
      const mimeType = file.mimeType;
      
      if (mimeType === 'application/vnd.google-apps.document') {
        icon = '📄';
        typeName = 'Doc';
        pageType = 'doc';
      } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
        icon = '📊';
        typeName = 'Sheet';
        pageType = 'sheet';
      } else if (mimeType === 'application/vnd.google-apps.presentation') {
        icon = '📽️';
        typeName = 'Slides';
        pageType = 'slide';
      } else if (mimeType === 'application/pdf') {
        icon = '📑';
        typeName = 'PDF';
        pageType = 'pdf';
      } else {
        // Generic Drive file
        icon = '📁';
        typeName = 'File';
        pageType = 'drive';
      }
      
      // Build embed URL based on type (default to edit mode for Google docs)
      let embedUrl;
      if (pageType === 'doc') {
        embedUrl = `https://docs.google.com/document/d/${file.id}/edit`;
      } else if (pageType === 'sheet') {
        embedUrl = `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
      } else if (pageType === 'slide') {
        embedUrl = `https://docs.google.com/presentation/d/${file.id}/edit`;
      } else {
        // Generic Drive files stay at preview (can't be edited inline)
        embedUrl = `https://drive.google.com/file/d/${file.id}/preview`;
      }
      
      saveToHistory();
      const newPage = {
        id: generateId(),
        name: file.name || `Google ${typeName}`,
        type: pageType,
        embedUrl,
        driveFileId: file.id,
        webViewLink: file.webViewLink || file.url,
        mimeType: file.mimeType,
        icon,
        createdAt: Date.now()
      };
      
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: [...tab.pages, newPage],
                activePageId: newPage.id
              }
            )
          }
        )
      };
      
      setData(newData);
      setActivePageId(newPage.id);
      showNotification(`${file.name || 'Google ' + typeName} added`, 'success');
    };

    const handleUrlImport = () => {
      if (!activeTabId || !urlImportValue) return;
      
      // Auto-correct URL: add https:// if missing
      let url = urlImportValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      let embedUrl;
      
      // Check if it's a Google Drive sharing URL
      const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch) {
        // Convert Google Drive sharing URL to preview embed
        const fileId = driveMatch[1];
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // Use Google's PDF viewer for direct PDF URLs
        embedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
      }
      
      saveToHistory();
      const newPage = {
        id: generateId(),
        name: 'PDF Document',
        type: 'pdf',
        embedUrl,
        originalUrl: url, // Store corrected URL for reference
        icon: '📑',
        createdAt: Date.now()
      };
      
      const newData = {
        ...data,
        notebooks: data.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: [...tab.pages, newPage],
                activePageId: newPage.id
              }
            )
          }
        )
      };
      
      setData(newData);
      setActivePageId(newPage.id);
      setShowUrlImport(false);
      setUrlImportValue('');
      showNotification('PDF Document added', 'success');
    };

    const openEditEmbed = () => {
      if (!activePage || !activePage.embedUrl) return;
      setEditEmbedName(activePage.name);
      setEditEmbedUrl(activePage.originalUrl || activePage.embedUrl);
      // Determine current view mode from embedUrl
      const isPreview = activePage.embedUrl.includes('/preview');
      setEditEmbedViewMode(isPreview ? 'preview' : 'edit');
      setShowEditEmbed(true);
    };

    const handleSaveEmbed = () => {
      if (!activePage || !editEmbedUrl) return;
      
      // Auto-correct URL
      let url = editEmbedUrl.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Calculate new embed URL based on page type (keep current view mode)
      let newEmbedUrl = activePage.embedUrl;
      const pageType = activePage.type;
      const currentViewMode = activePage.embedUrl.includes('/preview') ? 'preview' : 'edit';
      
      if (pageType === 'web') {
        newEmbedUrl = url || activePage.embedUrl;
      } else if (pageType === 'pdf') {
        if (url && url !== (activePage.originalUrl || activePage.embedUrl)) {
          // Check if it's a Google Drive URL
          const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (driveMatch) {
            newEmbedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
          } else {
            newEmbedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
          }
        }
      } else if (['doc', 'sheet', 'slide'].includes(pageType)) {
        // Extract document ID from current or new URL
        const sourceUrl = url || activePage.originalUrl || activePage.embedUrl;
        const match = sourceUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const docId = match[1];
          if (pageType === 'doc') {
            newEmbedUrl = `https://docs.google.com/document/d/${docId}/${currentViewMode}`;
          } else if (pageType === 'sheet') {
            newEmbedUrl = `https://docs.google.com/spreadsheets/d/${docId}/${currentViewMode}`;
          } else if (pageType === 'slide') {
            newEmbedUrl = `https://docs.google.com/presentation/d/${docId}/${currentViewMode}`;
          }
        }
      }
      
      setData(prev => ({
        ...prev,
        notebooks: prev.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: tab.pages.map(p => 
                  p.id !== activePage.id ? p : {
                    ...p,
                    embedUrl: newEmbedUrl,
                    originalUrl: url || p.originalUrl
                  }
                )
              }
            )
          }
        )
      }));
      
      setShowEditEmbed(false);
      showNotification('Page updated', 'success');
    };

    // Handle inline URL change from header bar input
    const handleInlineUrlChange = (newUrl) => {
      if (!activePage || !newUrl) return;
      
      // Auto-correct URL
      let url = newUrl.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Skip if URL hasn't changed
      if (url === (activePage.originalUrl || activePage.embedUrl)) return;
      
      // Calculate new embed URL based on page type (keep current view mode)
      let newEmbedUrl = activePage.embedUrl;
      const pageType = activePage.type;
      const currentViewMode = activePage.embedUrl.includes('/preview') ? 'preview' : 'edit';
      
      if (pageType === 'web') {
        newEmbedUrl = url;
      } else if (pageType === 'pdf') {
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
          newEmbedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        } else {
          newEmbedUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(url)}`;
        }
      } else if (['doc', 'sheet', 'slide'].includes(pageType)) {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
          const docId = match[1];
          if (pageType === 'doc') {
            newEmbedUrl = `https://docs.google.com/document/d/${docId}/${currentViewMode}`;
          } else if (pageType === 'sheet') {
            newEmbedUrl = `https://docs.google.com/spreadsheets/d/${docId}/${currentViewMode}`;
          } else if (pageType === 'slide') {
            newEmbedUrl = `https://docs.google.com/presentation/d/${docId}/${currentViewMode}`;
          }
        }
      }
      
      setData(prev => ({
        ...prev,
        notebooks: prev.notebooks.map(nb => 
          nb.id !== activeNotebookId ? nb : {
            ...nb,
            tabs: nb.tabs.map(tab => 
              tab.id !== activeTabId ? tab : {
                ...tab,
                pages: tab.pages.map(p => 
                  p.id !== activePage.id ? p : {
                    ...p,
                    embedUrl: newEmbedUrl,
                    originalUrl: url
                  }
                )
              }
            )
          }
        )
      }));
      
      showNotification('URL updated', 'success');
    };

    const addBlock = (type, initialData = {}) => {
        if (!activePage) return;
        const newBlock = { id: generateId(), type, content: '', url: '', ...initialData };
        const newRow = { id: generateId(), columns: [{ id: generateId(), blocks: [newBlock] }] };
        updatePageContent([...activePage.rows, newRow], true);
        setShowAddMenu(false);
        setAutoFocusId(newBlock.id);
    };

    const insertBlockAfter = (targetBlockId, blockType = 'text') => {
      if (!activePage) return;
      const newBlock = { id: generateId(), type: blockType, content: '', url: '', ...(blockType === 'todo' ? { checked: false } : {}) };
      let newRows = JSON.parse(JSON.stringify(activePage.rows));
      for (let row of newRows) {
          for (let col of row.columns) {
              const index = col.blocks.findIndex(b => b.id === targetBlockId);
              if (index > -1) {
                  col.blocks.splice(index + 1, 0, newBlock);
                  updatePageContent(newRows, true);
                  setAutoFocusId(newBlock.id);
                  return;
              }
          }
      }
    };

    const updateBlock = (blockId, updates) => {
      const newRows = activePage.rows.map(row => ({
          ...row,
          columns: row.columns.map(col => ({
              ...col,
              blocks: col.blocks.map(block => block.id === blockId ? { ...block, ...updates } : block)
          }))
      }));
      updatePageContent(newRows, false);
    };

    const updateTabColor = (tabId, color) => {
        const newData = {
          ...data,
          notebooks: data.notebooks.map(nb => 
            nb.id !== activeNotebookId ? nb : {
              ...nb,
              tabs: nb.tabs.map(tab => tab.id !== tabId ? tab : { ...tab, color })
            }
          )
        };
        setData(newData);
        setActiveTabMenu(null);
    };

    const updateNotebookIcon = (notebookId, icon) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id === notebookId ? { ...nb, icon } : nb
            )
        }));
        setNotebookIconPicker(null);
    };

    const updateTabIcon = (tabId, icon) => {
        setData(prev => ({
            ...prev,
            notebooks: prev.notebooks.map(nb => 
                nb.id !== activeNotebookId ? nb : {
                    ...nb,
                    tabs: nb.tabs.map(tab => tab.id === tabId ? { ...tab, icon } : tab)
                }
            )
        }));
        setTabIconPicker(null);
    };

    // Update local state only (for responsive typing) - NO Drive API calls
    const updateLocalName = (type, id, newName) => {
        setData(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next.notebooks.forEach(nb => {
                if (type === 'notebook' && nb.id === id) {
                    nb.name = newName;
                }
                nb.tabs.forEach(tab => {
                    if (type === 'tab' && tab.id === id) {
                        tab.name = newName;
                    }
                    tab.pages.forEach(pg => {
                        if (pg.id === id) {
                            pg.name = newName;
                        }
                    });
                });
            });
            return next;
        });
    };

    // Sync rename to Drive - called on blur (when editing is finished)
    const syncRenameToDrive = async (type, id) => {
        if (!isAuthenticated || typeof GoogleAPI === 'undefined') return;
        
        // Find the item and sync its name to Drive
        for (const nb of data.notebooks) {
            if (type === 'notebook' && nb.id === id && nb.driveFolderId) {
                try {
                    await GoogleAPI.renameDriveItem(nb.driveFolderId, GoogleAPI.sanitizeFileName(nb.name));
                } catch (err) {
                    console.error('Error updating notebook folder:', err);
                }
                setStructureVersion(v => v + 1);
                return;
            }
            for (const tab of nb.tabs) {
                if (type === 'tab' && tab.id === id && tab.driveFolderId) {
                    try {
                        await GoogleAPI.renameDriveItem(tab.driveFolderId, GoogleAPI.sanitizeFileName(tab.name));
                    } catch (err) {
                        console.error('Error updating tab folder:', err);
                    }
                    setStructureVersion(v => v + 1);
                    return;
                }
                for (const pg of tab.pages) {
                    if (pg.id === id) {
                        // For block pages: rename the JSON file
                        if (pg.driveFileId) {
                            try {
                                await GoogleAPI.renameDriveItem(pg.driveFileId, GoogleAPI.sanitizeFileName(pg.name) + '.json');
                            } catch (err) {
                                console.error('Error updating page file:', err);
                            }
                        }
                        // For Google pages: rename the shortcut
                        if (pg.driveShortcutId) {
                            try {
                                await GoogleAPI.renameDriveItem(pg.driveShortcutId, pg.name);
                            } catch (err) {
                                console.error('Error updating page shortcut:', err);
                            }
                        }
                        setStructureVersion(v => v + 1);
                        return;
                    }
                }
            }
        }
    };

    // Legacy function for compatibility - just calls updateLocalName
    const renameItem = (type, id, newName) => {
        updateLocalName(type, id, newName);
    }

    const initiateDelete = (type, id) => setItemToDelete({ type, id });

    const executeDelete = async (type, id) => {
        saveToHistory();
        const newData = JSON.parse(JSON.stringify(data));
        let nextId = null;
        let driveItemsToDelete = []; // Can be multiple items for pages

        if(type === 'notebook') {
             const notebook = newData.notebooks.find(n => n.id === id);
             if (notebook?.driveFolderId) driveItemsToDelete.push(notebook.driveFolderId);
             const idx = newData.notebooks.findIndex(n => n.id === id);
             if (activeNotebookId === id) {
                 if (idx < newData.notebooks.length - 1) nextId = newData.notebooks[idx + 1].id;
                 else if (idx > 0) nextId = newData.notebooks[idx - 1].id;
             }
             newData.notebooks = newData.notebooks.filter(n => n.id !== id);
             if (activeNotebookId === id) {
                 setActiveNotebookId(nextId);
                 // Also select the appropriate tab and page in the next notebook
                 if (nextId) {
                     const nextNb = newData.notebooks.find(n => n.id === nextId);
                     if (nextNb && nextNb.tabs.length > 0) {
                         const tabToSelect = nextNb.activeTabId || nextNb.tabs[0]?.id;
                         if (tabToSelect) {
                             setActiveTabId(tabToSelect);
                             const tabObj = nextNb.tabs.find(t => t.id === tabToSelect);
                             const pageToSelect = tabObj?.activePageId || tabObj?.pages[0]?.id;
                             if (pageToSelect) setActivePageId(pageToSelect);
                             else setActivePageId(null);
                         } else {
                             setActiveTabId(null);
                             setActivePageId(null);
                         }
                     } else {
                         setActiveTabId(null);
                         setActivePageId(null);
                     }
                 } else {
                     setActiveTabId(null);
                     setActivePageId(null);
                 }
             }
        } else {
             for (let nb of newData.notebooks) {
                 if (nb.id !== activeNotebookId) continue;
                 if (type === 'tab') {
                     const tab = nb.tabs.find(t => t.id === id);
                     if (tab?.driveFolderId) driveItemsToDelete.push(tab.driveFolderId);
                     const idx = nb.tabs.findIndex(t => t.id === id);
                     if (activeTabId === id) {
                         if (idx < nb.tabs.length - 1) nextId = nb.tabs[idx + 1].id;
                         else if (idx > 0) nextId = nb.tabs[idx - 1].id;
                     }
                     nb.tabs = nb.tabs.filter(t => t.id !== id);
                     if (activeTabId === id) {
                         selectTab(nextId);
                     }
                 } else if (type === 'page') {
                     for (let tab of nb.tabs) {
                         if (tab.id !== activeTabId) continue;
                         const page = tab.pages.find(p => p.id === id);
                         // For block pages: delete the JSON file
                         if (page?.driveFileId) driveItemsToDelete.push(page.driveFileId);
                         // For Google pages: delete only the shortcut (not the original file)
                         if (page?.driveShortcutId) driveItemsToDelete.push(page.driveShortcutId);
                         const idx = tab.pages.findIndex(p => p.id === id);
                         if (activePageId === id) {
                             if (idx < tab.pages.length - 1) nextId = tab.pages[idx + 1].id;
                             else if (idx > 0) nextId = tab.pages[idx - 1].id;
                         }
                         tab.pages = tab.pages.filter(p => p.id !== id);
                         if (activePageId === id) {
                             selectPage(nextId);
                             if (nextId) shouldFocusPageRef.current = true;
                         }
                     }
                 }
             }
        }
        
        // Delete Drive items (folders, docs, or shortcuts) if authenticated
        if (isAuthenticated && typeof GoogleAPI !== 'undefined' && driveItemsToDelete.length > 0) {
            for (const itemId of driveItemsToDelete) {
                try {
                    await GoogleAPI.deleteDriveItem(itemId);
                } catch (error) {
                    console.error('Error deleting Drive item:', error);
                    // Continue with local delete even if Drive delete fails
                }
            }
        }
        
        setData(newData);
        if (itemToDelete && itemToDelete.id === id) setItemToDelete(null);
        if (activeTabMenu && activeTabMenu.id === id) setActiveTabMenu(null);
        if (selectedBlockId === id) setSelectedBlockId(null);
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
        // Trigger structure sync for deletion
        setStructureVersion(v => v + 1);
    }

    const confirmDelete = () => {
        if (!itemToDelete) return;
        executeDelete(itemToDelete.type, itemToDelete.id);
    }

    const handleNavDragStart = (e, type, id, index) => {
        e.dataTransfer.setData('nav_drag', JSON.stringify({ type, id, index }));
    };

    const handleNavDrop = (e, type, targetIndex) => {
        e.preventDefault(); e.stopPropagation();
        const dragDataRaw = e.dataTransfer.getData('nav_drag');
        if (!dragDataRaw) return;
        const dragData = JSON.parse(dragDataRaw);
        if (dragData.type !== type || dragData.index === targetIndex) return;

        saveToHistory();
        const newData = JSON.parse(JSON.stringify(data));
        if (type === 'notebook') {
            const item = newData.notebooks.splice(dragData.index, 1)[0];
            newData.notebooks.splice(targetIndex, 0, item);
        } else if (type === 'tab') {
            const nb = newData.notebooks.find(n => n.id === activeNotebookId);
            if (nb) {
                const item = nb.tabs.splice(dragData.index, 1)[0];
                nb.tabs.splice(targetIndex, 0, item);
            }
        } else if (type === 'page') {
            const nb = newData.notebooks.find(n => n.id === activeNotebookId);
            const tab = nb?.tabs.find(t => t.id === activeTabId);
            if (tab) {
                const item = tab.pages.splice(dragData.index, 1)[0];
                tab.pages.splice(targetIndex, 0, item);
            }
        }
        setData(newData);
    };

    const handleDragStart = (e, block, rowId, colId) => {
        e.dataTransfer.setData('block_drag', JSON.stringify({ block, rowId, colId }));
        setDraggedBlock({ block, rowId, colId });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggedBlock || !dropTarget) { setDraggedBlock(null); setDropTarget(null); return; }
        const { block } = draggedBlock;
        const { rowId: tgtRowId, colId: tgtColId, blockId: tgtBlockId, position } = dropTarget;

        let newRows = JSON.parse(JSON.stringify(activePage.rows));
        let movedBlock = null;
        
        // Remove the dragged block from its original position
        newRows.forEach(row => { row.columns.forEach(col => { const idx = col.blocks.findIndex(b => b.id === block.id); if (idx > -1) { movedBlock = col.blocks[idx]; col.blocks.splice(idx, 1); } }); });
        newRows.forEach(row => { row.columns = row.columns.filter(c => c.blocks.length > 0); });
        newRows = newRows.filter(r => r.columns.length > 0);

        if (movedBlock) {
            if (position === 'left' || position === 'right') {
                // Find the target row and column
                const targetRowIndex = newRows.findIndex(r => r.id === tgtRowId);
                if (targetRowIndex > -1) {
                    const targetRow = newRows[targetRowIndex];
                    const targetColIndex = targetRow.columns.findIndex(c => c.id === tgtColId);
                    const targetCol = targetRow.columns[targetColIndex];
                    
                    if (targetCol) {
                        const targetBlockIndex = targetCol.blocks.findIndex(b => b.id === tgtBlockId);
                        
                        // Check if this column has multiple blocks
                        if (targetCol.blocks.length > 1) {
                            // Split the row: extract just the target block into a new row with columns
                            const blocksAbove = targetCol.blocks.slice(0, targetBlockIndex);
                            const targetBlock = targetCol.blocks[targetBlockIndex];
                            const blocksBelow = targetCol.blocks.slice(targetBlockIndex + 1);
                            
                            // Create new rows
                            const rowsToInsert = [];
                            
                            // Row for blocks above (if any)
                            if (blocksAbove.length > 0) {
                                rowsToInsert.push({ id: generateId(), columns: [{ id: generateId(), blocks: blocksAbove }] });
                            }
                            
                            // Row with the two-column arrangement
                            const col1 = { id: generateId(), blocks: [position === 'left' ? movedBlock : targetBlock] };
                            const col2 = { id: generateId(), blocks: [position === 'left' ? targetBlock : movedBlock] };
                            rowsToInsert.push({ id: generateId(), columns: [col1, col2] });
                            
                            // Row for blocks below (if any)
                            if (blocksBelow.length > 0) {
                                rowsToInsert.push({ id: generateId(), columns: [{ id: generateId(), blocks: blocksBelow }] });
                            }
                            
                            // Remove the original column/row and insert new rows
                            targetCol.blocks = [];
                            newRows.forEach(row => { row.columns = row.columns.filter(c => c.blocks.length > 0); });
                            newRows = newRows.filter(r => r.columns.length > 0);
                            
                            // Find where to insert (the old row index, adjusted for filtering)
                            const insertIndex = targetRowIndex <= newRows.length ? targetRowIndex : newRows.length;
                            newRows.splice(insertIndex, 0, ...rowsToInsert);
                        } else {
                            // Single block in column - can add column directly if under max
                            if (targetRow.columns.length < settings.maxColumns) {
                                const newCol = { id: generateId(), blocks: [movedBlock] };
                                if (position === 'left') targetRow.columns.splice(targetColIndex, 0, newCol);
                                else targetRow.columns.splice(targetColIndex + 1, 0, newCol);
                            } else {
                                // Max columns reached - add to the column instead
                                targetCol.blocks.push(movedBlock);
                            }
                        }
                    }
                }
            } else {
                // Top/bottom drop - add to existing column
                const targetRow = newRows.find(r => r.id === tgtRowId);
                const targetCol = targetRow?.columns.find(c => c.id === tgtColId);
                if (targetCol) {
                    const targetBlockIndex = targetCol.blocks.findIndex(b => b.id === tgtBlockId);
                    const insertIndex = position === 'top' ? targetBlockIndex : targetBlockIndex + 1;
                    targetCol.blocks.splice(insertIndex, 0, movedBlock);
                }
            }
        }
        updatePageContent(newRows, true);
        setDraggedBlock(null); setDropTarget(null);
    };

    const getTabColorClasses = (colorName, isActive) => {
        // Inactive tab colors - pastel in light mode, darker in dark mode
        const colors = {
            gray: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
            red: 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200',
            orange: 'bg-orange-100 hover:bg-orange-200 text-orange-800 dark:bg-orange-900 dark:hover:bg-orange-800 dark:text-orange-200',
            amber: 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-200',
            green: 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-200',
            teal: 'bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-900 dark:hover:bg-teal-800 dark:text-teal-200',
            blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200',
            indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-200',
            purple: 'bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-200',
            pink: 'bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-200',
        };
        // Active tab colors - solid colors (same in both modes)
        const activeColors = {
             gray: 'bg-gray-500 text-white', red: 'bg-red-500 text-white', orange: 'bg-orange-500 text-white',
             amber: 'bg-amber-500 text-white', green: 'bg-green-600 text-white', teal: 'bg-teal-600 text-white',
             blue: 'bg-blue-600 text-white', indigo: 'bg-indigo-600 text-white', purple: 'bg-purple-600 text-white',
             pink: 'bg-pink-600 text-white',
        };
        return isActive ? activeColors[colorName] : colors[colorName];
    };

    const getPageBgClass = (colorName) => {
         const map = {
            gray: 'bg-gray-100 dark:bg-gray-800',
            red: 'bg-red-100 dark:bg-red-900',
            orange: 'bg-orange-100 dark:bg-orange-900',
            amber: 'bg-amber-100 dark:bg-amber-900',
            green: 'bg-green-100 dark:bg-green-900',
            teal: 'bg-teal-100 dark:bg-teal-900',
            blue: 'bg-blue-100 dark:bg-blue-900',
            indigo: 'bg-indigo-100 dark:bg-indigo-900',
            purple: 'bg-purple-100 dark:bg-purple-900',
            pink: 'bg-pink-100 dark:bg-pink-900',
         }
         return map[colorName] || 'bg-white dark:bg-gray-900';
    }

    const handleBlockHandleClick = (e, blockId) => {
        e.stopPropagation();
        if (selectedBlockId === blockId) {
            const rect = e.currentTarget.getBoundingClientRect();
            setBlockMenu({ id: blockId, top: rect.bottom + 5, left: rect.left });
        } else {
            setSelectedBlockId(blockId);
            setBlockMenu(null);
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        }
    }

    const updateBlockColor = (blockId, colorName) => {
        updateBlock(blockId, { backgroundColor: colorName });
        setBlockMenu(null);
    }

    const handlePageKeyDown = (e, pageId, index, pages) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (index < pages.length - 1) { selectPage(pages[index + 1].id); shouldFocusPageRef.current = true; }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) { selectPage(pages[index - 1].id); shouldFocusPageRef.current = true; }
        } else if (e.key === 'Delete') {
            e.preventDefault(); executeDelete('page', pageId);
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
            if (activePage && activePage.rows.length > 0 && activePage.rows[0].columns.length > 0 && activePage.rows[0].columns[0].blocks.length > 0) {
                setAutoFocusId(activePage.rows[0].columns[0].blocks[0].id);
            } else {
                // If page is empty, create a new text block
                addBlock('text');
            }
        }
    };

    return (
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-sm">
        {/* NOTEBOOKS SIDEBAR - Always dark */}
        <div className={`${settings.condensedView ? 'w-16' : 'w-64'} flex-shrink-0 flex flex-col border-r border-gray-700 bg-gray-900 text-gray-300 transition-all duration-200`}>
          <div className={`p-4 border-b border-gray-800 flex items-center ${settings.condensedView ? 'justify-center' : 'justify-between'}`}>
              {!settings.condensedView && <span className="font-bold text-white flex items-center gap-2 text-lg"><Book size={18}/> Strata</span>}
              <button onClick={addNotebook} className="hover:bg-gray-800 p-1 rounded transition-colors" title="Add notebook"><Plus size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Favorites Section - Collapsible */}
            {getStarredPages().length > 0 && (
              <div className="mb-2">
                <button 
                  onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                  className={`w-full flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} px-2 py-1.5 text-yellow-400 hover:bg-gray-800 rounded transition-colors`}
                >
                  <ChevronRight size={14} className={`transition-transform ${favoritesExpanded ? 'rotate-90' : ''} ${settings.condensedView ? 'hidden' : ''}`} />
                  <Star size={14} filled />
                  {!settings.condensedView && (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-wider">Favorites</span>
                      <span className="text-xs text-gray-500 ml-auto">{getStarredPages().length}</span>
                    </>
                  )}
                </button>
                {favoritesExpanded && getStarredPages().map(page => (
                  <div 
                    key={`fav-${page.id}`}
                    onClick={() => {
                      setActiveNotebookId(page.notebookId);
                      setActiveTabId(page.tabId);
                      setActivePageId(page.id);
                    }}
                    className={`flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2 ml-4'} px-3 py-1.5 rounded cursor-pointer transition-colors hover:bg-gray-800 ${activePageId === page.id ? 'bg-gray-800 text-white' : ''}`}
                    title={settings.condensedView ? `${page.name} (${page.notebookName} / ${page.tabName})` : undefined}
                  >
                    <span className="text-sm">{page.icon || '📄'}</span>
                    {!settings.condensedView && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{page.name}</div>
                        <div className="text-xs text-gray-500 truncate">{page.notebookName} / {page.tabName}</div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-b border-gray-700 my-2"></div>
              </div>
            )}
            
            {data.notebooks.map((nb, index) => (
              <div key={nb.id} className="group flex items-center gap-2" draggable={!editingNotebookId} onDragStart={(e) => handleNavDragStart(e, 'notebook', nb.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleNavDrop(e, 'notebook', index)} title={settings.condensedView ? nb.name : undefined}>
                   <div onClick={() => selectNotebook(nb.id)} className={`flex-1 flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} px-3 py-2 rounded cursor-pointer transition-colors ${activeNotebookId === nb.id ? 'bg-gray-800 text-white font-medium' : 'hover:bg-gray-800'}`}>
                      <span 
                          className={`${settings.condensedView ? 'text-xl' : 'text-base'} ${activeNotebookId === nb.id && !settings.condensedView ? 'cursor-pointer hover:bg-gray-700' : ''} rounded px-0.5 notebook-icon-trigger`} 
                          onClick={(e) => { 
                              if (activeNotebookId !== nb.id) return; // Only active notebook
                              if (settings.condensedView) return; // Don't open picker in condensed view
                              e.stopPropagation(); 
                              const rect = e.currentTarget.getBoundingClientRect();
                              setNotebookIconPicker({ id: nb.id, top: rect.bottom + 5, left: rect.left });
                          }}
                      >
                          {nb.icon || '📓'}
                      </span>
                      {!settings.condensedView && (activeNotebookId === nb.id && editingNotebookId === nb.id ? (
                          <input ref={(el) => notebookInputRefs.current[nb.id] = el} className="bg-transparent border-none outline-none w-full notebook-input" value={nb.name} onChange={(e) => updateLocalName('notebook', nb.id, e.target.value)} onClick={(e) => e.stopPropagation()} onFocus={(e) => e.target.select()} onBlur={() => { syncRenameToDrive('notebook', nb.id); if (!creationFlow) setEditingNotebookId(null); }} onKeyDown={(e) => { 
                              if(e.key === 'Enter') {
                                  e.preventDefault();
                                  setEditingNotebookId(null);
                                  // If in creation flow, move to tab name editing
                                  if (creationFlow && creationFlow.notebookId === nb.id) {
                                      setEditingTabId(creationFlow.tabId);
                                  }
                              }
                              if(e.key === 'Escape') {
                                  setEditingNotebookId(null);
                                  setCreationFlow(null);
                              }
                              e.stopPropagation(); 
                          }} />
                      ) : (
                          <span className="truncate w-full" onClick={(e) => { if(activeNotebookId === nb.id) { e.stopPropagation(); setEditingNotebookId(nb.id); } }}>{nb.name}</span>
                      ))}
                  </div>
                  {!settings.condensedView && <button onClick={() => initiateDelete('notebook', nb.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-opacity"><Trash2 size={12}/></button>}
              </div>
            ))}
          </div>
          {/* Bottom toolbar */}
          <div className={`p-2 border-t border-gray-800 flex items-center justify-between`}>
              <button onClick={() => setSettings(s => ({...s, condensedView: !s.condensedView}))} className="hover:bg-gray-800 p-2 rounded transition-colors" title={settings.condensedView ? "Expand view" : "Compact view"}>
                  {settings.condensedView ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
{!settings.condensedView && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>v{APP_VERSION}</span>
                      {isSyncing && <span className="text-blue-400 animate-pulse">⟳</span>}
                      {lastSyncTime && !isSyncing && <span className="text-green-500">✓ Synced</span>}
                  </div>
              )}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* TABS BAR */}
          {activeNotebook ? (
               <div 
                   ref={tabBarRef}
                   className="h-12 flex-shrink-0 bg-gray-300 dark:bg-gray-800 border-b border-gray-400 dark:border-gray-700 flex items-end px-2 overflow-x-auto no-scrollbar"
               >
               <div className="flex items-end space-x-1">
               {activeNotebook.tabs.map((tab, index) => (
                 <div 
                     key={tab.id} 
                     className="group relative flex-shrink-0" 
                     draggable={!editingTabId} 
                     onDragStart={(e) => handleNavDragStart(e, 'tab', tab.id, index)} 
                     onDragOver={(e) => e.preventDefault()} 
                     onDrop={(e) => handleNavDrop(e, 'tab', index)}
                 >
                     <div 
                         onClick={() => selectTab(tab.id)} 
                         className={`${settings.condensedView ? 'px-2' : 'px-4'} py-2 rounded-t-lg cursor-pointer flex items-center gap-2 tab-gloss overflow-hidden whitespace-nowrap ${activeTabId === tab.id ? `${getTabColorClasses(tab.color, true)} shadow-sm -mb-px` : `${getTabColorClasses(tab.color, false)}`}`} 
                         title={settings.condensedView ? tab.name : undefined}
                     >
                      <span 
                          className={`text-sm flex-shrink-0 ${activeTabId === tab.id && !settings.condensedView ? 'cursor-pointer hover:bg-black/10' : ''} rounded px-0.5 tab-icon-trigger`} 
                          onClick={(e) => { 
                              if (activeTabId !== tab.id) return;
                              if (settings.condensedView) return;
                              e.stopPropagation(); 
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTabIconPicker({ id: tab.id, top: rect.bottom + 5, left: rect.left });
                          }}
                      >
                          {tab.icon || '📋'}
                      </span>
                      {!settings.condensedView && (activeTabId === tab.id && editingTabId === tab.id ? (
                          <input ref={(el) => tabInputRefs.current[tab.id] = el} className="bg-transparent border-none outline-none w-full font-medium tab-input min-w-0" value={tab.name} onChange={(e) => updateLocalName('tab', tab.id, e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => { syncRenameToDrive('tab', tab.id); if (!creationFlow) setEditingTabId(null); }} onKeyDown={(e) => { 
                              if(e.key === 'Enter') {
                                  e.preventDefault();
                                  setEditingTabId(null);
                                  if (creationFlow && creationFlow.tabId === tab.id) {
                                      setShouldFocusTitle(true);
                                      setCreationFlow(null);
                                  }
                              }
                              if(e.key === 'Escape') {
                                  setEditingTabId(null);
                                  setCreationFlow(null);
                              }
                              e.stopPropagation(); 
                          }} onClick={(e) => e.stopPropagation()} />
                      ) : (
                          <span className="truncate font-medium flex-1 min-w-0" onDoubleClick={(e) => { if(activeTabId === tab.id) { e.stopPropagation(); setEditingTabId(tab.id); } }}>{tab.name}</span>
                      ))}
                       {!settings.condensedView && activeTabId === tab.id && <div className="relative ml-auto flex-shrink-0">
                          <button className="p-1 rounded hover:bg-black/10 tab-settings-trigger opacity-100" onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeTabMenu?.id === tab.id) setActiveTabMenu(null);
                                  else { const rect = e.currentTarget.getBoundingClientRect(); setActiveTabMenu({ id: tab.id, top: rect.bottom + 5, left: rect.left }); }
                              }}>
                             <Settings size={12} />
                          </button>
                       </div>}
                     </div>
                 </div>
               ))}
               </div>
               <button onClick={addTab} className="mb-2 ml-1 p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors flex-shrink-0"><Plus size={18}/></button>
               {/* Header right section */}
               <div className="ml-auto flex items-center gap-2 h-full flex-shrink-0">
                   {isLoadingAuth ? (
                       <span className="text-xs text-gray-500">Loading...</span>
                   ) : isAuthenticated ? (
                       <div 
                           className="relative h-full flex items-center"
                           onMouseEnter={() => setShowAccountPopup(true)}
                           onMouseLeave={() => setShowAccountPopup(false)}
                       >
                           <div 
                               className="flex items-center justify-center gap-2 h-10 px-4 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                               onClick={() => setShowSignOutConfirm(true)}
                           >
                               <GoogleG size={16} />
                               <span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-40">{userName || userEmail}</span>
                           </div>
                           
                           {/* Hover Popup */}
                           {showAccountPopup && (
                               <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 text-center min-w-48 z-50 animate-fade-in">
                                   <div className="font-medium text-gray-800 dark:text-gray-200">{userName}</div>
                                   <div className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>
                                   <div className="text-xs text-red-500 mt-2">Click to sign out</div>
                               </div>
                           )}
                       </div>
                   ) : (
                       <button onClick={handleSignIn} className="flex items-center gap-2 h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors" disabled={typeof GoogleAPI === 'undefined'}>
                           <GoogleG size={16} /> Sign in with Google
                       </button>
                   )}
                   <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 settings-trigger transition-colors" title="Settings">
                       <Settings size={20} />
                   </button>
               </div>
             </div>
          ) : (
              <div className="h-12 bg-gray-300 dark:bg-gray-800 border-b border-gray-400 dark:border-gray-700 flex items-center px-4 text-gray-500 dark:text-gray-400">Select a notebook</div>
          )}

          <div className="flex-1 flex overflow-hidden">
              {/* Main content area with cached iframes */}
              <div className={`flex-1 relative ${activePage?.embedUrl ? 'p-0 overflow-hidden' : 'p-8 overflow-y-auto'} transition-colors duration-300 ${activeTab ? getPageBgClass(activeTab.color) : 'bg-gray-50'}`}>
                  {/* Session-wide cached iframes - persist across all tab/notebook switches */}
                  {data.notebooks.flatMap(nb => nb.tabs.flatMap(t => t.pages))
                      .filter(p => p.embedUrl && viewedEmbedPages.has(p.id))
                      .map(page => (
                          <iframe 
                              key={page.id}
                              src={page.embedUrl}
                              className={`absolute w-full border-0 ${
                                  activePage?.id === page.id && activePage?.embedUrl ? '' : 'hidden'
                              }`}
                              style={{ 
                                  top: activePage?.id === page.id ? '52px' : '0',
                                  left: 0,
                                  right: 0,
                                  height: activePage?.id === page.id ? 'calc(100% - 52px)' : '100%',
                                  transform: `scale(${(pageZoomLevels[page.id] || 100) / 100})`,
                                  transformOrigin: 'top left',
                                  width: `${100 / ((pageZoomLevels[page.id] || 100) / 100)}%`
                              }}
                              allow="autoplay"
                          />
                      ))
                  }
                  {activePage ? (
                      activePage.embedUrl ? (
                          // Embedded page (Google Docs/Sheets/Slides, Web, PDF)
                          <div className="w-full h-full flex flex-col">
                              <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
                                  <span className="text-2xl">{activePage.icon}</span>
                                  {editingEmbedName ? (
                                    <input 
                                        className="font-semibold text-gray-700 outline-none border-b-2 border-blue-400 bg-transparent w-40"
                                        value={activePage.name}
                                          onChange={(e) => {
                                              setData(prev => ({
                                                  ...prev,
                                                  notebooks: prev.notebooks.map(nb => 
                                                      nb.id !== activeNotebookId ? nb : {
                                                          ...nb,
                                                          tabs: nb.tabs.map(tab => 
                                                              tab.id !== activeTabId ? tab : {
                                                                  ...tab,
                                                                  pages: tab.pages.map(p => 
                                                                      p.id !== activePage.id ? p : { ...p, name: e.target.value }
                                                                  )
                                                              }
                                                          )
                                                      }
                                                  )
                                              }));
                                          }}
                                          onBlur={() => setEditingEmbedName(false)}
                                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingEmbedName(false); }}
                                          autoFocus
                                      />
                                  ) : (
                                    <span 
                                        className="font-semibold text-gray-700 cursor-pointer hover:text-blue-600 transition-colors w-40 truncate"
                                        onClick={() => setEditingEmbedName(true)}
                                        title={activePage.name}
                                    >
                                        {activePage.name}
                                    </span>
                                  )}
                                  <button 
                                      onClick={() => toggleStar(activePage.id, activeNotebookId, activeTabId)}
                                      className={`p-1.5 rounded transition-colors ${activePage.starred ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}
                                      title={activePage.starred ? 'Remove from favorites' : 'Add to favorites'}
                                  >
                                      <Star size={16} filled={activePage.starred} />
                                  </button>
                                  {/* Edit/Preview Toggle Switch - Only for Google Docs/Sheets/Slides */}
                                  {['doc', 'sheet', 'slide'].includes(activePage.type) && (
                                      <div className="flex items-center gap-1.5 ml-2">
                                          <span className={`text-xs font-medium transition-colors ${!activePage.embedUrl.includes('/preview') ? 'text-blue-600' : 'text-gray-400'}`}>Edit</span>
                                          <button
                                              onClick={() => toggleViewMode(activePage.id)}
                                              className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none overflow-hidden"
                                              style={{ backgroundColor: activePage.embedUrl.includes('/preview') ? '#9ca3af' : '#3b82f6' }}
                                              title={activePage.embedUrl.includes('/preview') ? 'Switch to Edit mode' : 'Switch to Preview mode'}
                                          >
                                              <span 
                                                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                                      activePage.embedUrl.includes('/preview') ? 'translate-x-5' : 'translate-x-0'
                                                  }`}
                                              />
                                          </button>
                                          <span className={`text-xs font-medium transition-colors ${activePage.embedUrl.includes('/preview') ? 'text-gray-600' : 'text-gray-400'}`}>Preview</span>
                                      </div>
                                  )}
                                  {/* Zoom Controls */}
                                  <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-2">
                                      <button 
                                          onClick={() => setPageZoom(activePage.id, getPageZoom(activePage.id) - 25)}
                                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                          disabled={getPageZoom(activePage.id) <= 25}
                                          title="Zoom out"
                                      >
                                          <Minus size={14} />
                                      </button>
                                      <span className="text-xs text-gray-600 w-10 text-center font-medium">
                                          {getPageZoom(activePage.id)}%
                                      </span>
                                      <button 
                                          onClick={() => setPageZoom(activePage.id, getPageZoom(activePage.id) + 25)}
                                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                          disabled={getPageZoom(activePage.id) >= 200}
                                          title="Zoom in"
                                      >
                                          <Plus size={14} />
                                      </button>
                                  </div>
                                  {/* URL Field */}
                                  <div className="flex items-center gap-1 ml-2">
                                      <span className="text-xs text-gray-400">URL:</span>
                                      <input 
                                          type="text"
                                          className="text-xs text-blue-500 dark:text-blue-400 bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-48"
                                          defaultValue={activePage.originalUrl || activePage.embedUrl || ''}
                                          key={activePage.id}
                                          onFocus={(e) => setInlineUrlValue(e.target.value)}
                                          onBlur={(e) => {
                                              if (e.target.value !== (activePage.originalUrl || activePage.embedUrl)) {
                                                  handleInlineUrlChange(e.target.value);
                                              }
                                          }}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                  e.target.blur();
                                              }
                                          }}
                                          title={activePage.originalUrl || activePage.embedUrl}
                                      />
                                  </div>
                                  <span className="text-xs text-gray-400 ml-auto">
                                      {activePage.type === 'doc' ? 'Google Docs' : 
                                       activePage.type === 'sheet' ? 'Google Sheets' : 
                                       activePage.type === 'slide' ? 'Google Slides' :
                                       activePage.type === 'web' ? 'Web Page' :
                                       activePage.type === 'pdf' ? 'PDF Document' : 'Embed'}
                                  </span>
                              </div>
                              {/* Placeholder for iframe - actual iframes rendered at higher level for caching */}
                              <div className="flex-1 w-full relative pointer-events-none" />
                          </div>
                      ) : (
                      // Regular block page
                      <div className="max-w-4xl mx-auto min-h-[500px] bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden pb-10">
                          {activePage.cover && <div className="h-40 w-full bg-gray-100 group relative">
                              {activePage.cover.startsWith('color:') ? (
                                  <div className={`w-full h-full bg-${activePage.cover.replace('color:', '')}-400`} />
                              ) : activePage.cover.startsWith('gradient:') ? (
                                  <div className="w-full h-full" style={{ background: activePage.cover.replace('gradient:', '') }} />
                              ) : (
                                  <img src={activePage.cover} className="w-full h-full object-cover" />
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                  <button onClick={() => setShowCoverInput(true)} className="bg-white/80 hover:bg-white text-xs px-2 py-1 rounded shadow-sm text-gray-700 cover-input-trigger">Change Cover</button>
                                  <button onClick={() => updatePageMeta({ cover: null })} className="bg-white/80 hover:bg-white text-xs px-2 py-1 rounded shadow-sm text-red-600">Remove</button>
                              </div>
                          </div>}
                          <div className={`p-8 ${activePage.cover ? 'pt-2' : ''}`}>
                              {!activePage.cover && <div className="w-full flex justify-center opacity-0 hover:opacity-100 mb-2 transition-opacity"><button onClick={() => setShowCoverInput(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><ImageIcon size={12}/> Add Cover</button></div>}
                              
                              {showCoverInput && (
                                  <div className="absolute top-20 right-1/2 translate-x-1/2 z-50 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-72 cover-input animate-fade-in">
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Image URL</div>
                                      <input 
                                          className="w-full text-xs p-2 border rounded mb-3" 
                                          placeholder="Paste image URL..." 
                                          autoFocus
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter' && e.target.value) {
                                                  updatePageMeta({ cover: e.target.value });
                                                  setShowCoverInput(false);
                                              }
                                          }}
                                      />
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Solid Colors</div>
                                      <div className="grid grid-cols-6 gap-2 mb-3">
                                          {['gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple'].map(color => (
                                              <div 
                                                  key={color}
                                                  onClick={() => { updatePageMeta({ cover: `color:${color}` }); setShowCoverInput(false); }}
                                                  className={`w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform shadow-sm bg-${color}-400`}
                                              />
                                          ))}
                                      </div>
                                      <div className="text-xs font-semibold text-gray-500 mb-2">Gradients</div>
                                      <div className="grid grid-cols-4 gap-2">
                                          {[
                                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                              'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                              'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          ].map((gradient, i) => (
                                              <div 
                                                  key={i}
                                                  onClick={() => { updatePageMeta({ cover: `gradient:${gradient}` }); setShowCoverInput(false); }}
                                                  className="w-full h-8 rounded cursor-pointer hover:scale-105 transition-transform shadow-sm"
                                                  style={{ background: gradient }}
                                              />
                                          ))}
                                      </div>
                                  </div>
                              )}

                              <div className="flex items-end -mt-10 mb-4 gap-1">
                                  <button 
                                      onClick={() => toggleStar(activePage.id, activeNotebookId, activeTabId)} 
                                      className={`p-2 rounded-lg transition-colors ${activePage.starred ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-100'}`}
                                      title={activePage.starred ? 'Remove from favorites' : 'Add to favorites'}
                                  >
                                      <Star size={24} filled={activePage.starred} />
                                  </button>
                                  <div className="relative inline-block">
                                      <div 
                                          className="text-6xl drop-shadow-sm select-none cursor-pointer hover:bg-gray-100/50 rounded p-2 transition-colors icon-picker-trigger"
                                          onClick={() => setShowIconPicker(!showIconPicker)}
                                      >
                                          {activePage.icon || '📄'}
                                      </div>
                                      {showIconPicker && (
                                          <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-2 w-64 h-64 overflow-y-auto icon-picker animate-fade-in">
                                              <div className="grid grid-cols-5 gap-1">
                                                  {EMOJIS.map(emoji => (
                                                      <div key={emoji} className="text-2xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => { updatePageMeta({ icon: emoji }); setShowIconPicker(false); }}>{emoji}</div>
                                                  ))}
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div className="mb-8 border-b border-gray-100 pb-4">
                                   <div className="flex items-start gap-3">
                                       <input ref={titleInputRef} className="text-4xl font-bold flex-1 outline-none placeholder-gray-300 py-3 leading-normal bg-transparent" value={activePage.name} onChange={(e) => updateLocalName('page', activePage.id, e.target.value)} onBlur={() => syncRenameToDrive('page', activePage.id)} onClick={(e) => e.target.select()} onKeyDown={handleTitleKeyDown} />
                                   </div>
                                   <div className="text-gray-400 text-xs mt-2 flex gap-4">
                                      <span>Created: Today {new Date(activePage.createdAt).toLocaleDateString()} {new Date(activePage.createdAt).toLocaleTimeString()} • {activePage.rows.reduce((acc, r) => acc + r.columns.reduce((ac, c) => ac + c.blocks.length, 0), 0)} blocks</span>
                                   </div>
                              </div>
                              <div 
                                  className="space-y-2"
                                  onDragOver={(e) => {
                                      e.preventDefault();
                                      // Check if dragging files
                                      if (e.dataTransfer.types.includes('Files')) {
                                          e.dataTransfer.dropEffect = 'copy';
                                      }
                                  }}
                                  onDrop={async (e) => {
                                      e.preventDefault();
                                      
                                      // Check if files are being dropped
                                      const files = Array.from(e.dataTransfer.files);
                                      if (files.length > 0 && isAuthenticated && typeof GoogleAPI !== 'undefined' && activeTab?.driveFolderId) {
                                          // Upload files to Drive
                                          for (const file of files) {
                                              try {
                                                  const uploadedFile = await GoogleAPI.uploadFileToDrive(
                                                      file,
                                                      activeTab.driveFolderId,
                                                      file.name
                                                  );
                                                  
                                                  // Create image block for images, or link block for other files
                                                  if (file.type.startsWith('image/')) {
                                                      const newBlock = {
                                                          id: generateId(),
                                                          type: 'image',
                                                          url: uploadedFile.webViewLink,
                                                          driveFileId: uploadedFile.id
                                                      };
                                                      addBlock('image', newBlock);
                                                  } else {
                                                      // For PDFs and other files, create a link block
                                                      const newBlock = {
                                                          id: generateId(),
                                                          type: 'link',
                                                          content: file.name,
                                                          url: uploadedFile.webViewLink,
                                                          driveFileId: uploadedFile.id
                                                      };
                                                      addBlock('link', newBlock);
                                                  }
                                                  
                                                  showNotification(`Uploaded ${file.name}`, 'success');
                                              } catch (error) {
                                                  console.error('Error uploading file:', error);
                                                  showNotification(`Failed to upload ${file.name}`, 'error');
                                              }
                                          }
                                          return;
                                      }
                                      
                                      // Otherwise, handle block drag-and-drop
                                      handleDrop(e);
                                  }}
                                  onDragEnd={() => { setDraggedBlock(null); setDropTarget(null); }}
                              >
                                  {activePage.rows.map((row) => (
                                      <div key={row.id} className="flex gap-4 group/row relative">
                                          {row.columns.map((col) => (
                                              <div key={col.id} className="flex-1 min-w-[50px] space-y-2">
                                                  {col.blocks.map((block) => (
                                                      <BlockComponent 
                                                          key={block.id} block={block} rowId={row.id} colId={col.id}
                                                          onUpdate={(updates) => updateBlock(block.id, updates)}
                                                          onDelete={() => removeBlock(block.id)}
                                                          onInsertBelow={(type) => insertBlockAfter(block.id, type)}
                                                          autoFocusId={autoFocusId}
                                                          onRequestFocus={() => setAutoFocusId(block.id)}
                                                          isSelected={selectedBlockId === block.id}
                                                          onHandleClick={(e) => handleBlockHandleClick(e, block.id)}
                                                          onFocus={() => { setSelectedBlockId(null); setBlockMenu(null); setAutoFocusId(null); }}
                                                          onDragStart={(e) => { e.dataTransfer.setData('block_drag', JSON.stringify({ block, rowId: row.id, colId: col.id })); setDraggedBlock({ block, rowId: row.id, colId: col.id }); }}
                                                          onDragOver={(e) => {
                                                              e.preventDefault(); e.stopPropagation();
                                                              if (!draggedBlock || draggedBlock.block.id === block.id) return;
                                                              const rect = e.currentTarget.getBoundingClientRect();
                                                              const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                                                              const w = rect.width; const h = rect.height;
                                                              let position = 'bottom';
                                                              
                                                              const dLeft = x; const dRight = w - x; const dTop = y; const dBottom = h - y;
                                                              let minD = dBottom; // Default strict bottom
                                                              
                                                              // More balanced sticky logic
                                                              if (dTop < h * 0.3) { minD = dTop; position = 'top'; }

                                                              const targetRow = activePage.rows.find(r => r.id === row.id);
                                                              const isMaxColumns = targetRow && targetRow.columns.length >= settings.maxColumns;
                                                              
                                                              if (!isMaxColumns) {
                                                                  if (x < w * 0.2) position = 'left';
                                                                  else if (x > w * 0.8) position = 'right';
                                                              }

                                                              setDropTarget({ rowId: row.id, colId: col.id, blockId: block.id, position });
                                                          }}
                                                          onDrop={handleDrop} dropTarget={dropTarget}
                                                      />
                                                  ))}
                                              </div>
                                          ))}
                                      </div>
                                  ))}
                              </div>
                              
                              <div className="mt-12 pb-20 opacity-50 hover:opacity-70 transition-opacity">
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    {[
                                        { cmd: '/h1', desc: 'heading' },
                                        { cmd: '/h2', desc: 'subheading' },
                                        { cmd: '/ul', desc: 'bullets' },
                                        { cmd: '/ol', desc: 'numbers' },
                                        { cmd: '/todo', desc: 'checkbox' },
                                        { cmd: '/img', desc: 'image' },
                                        { cmd: '/vid', desc: 'video' },
                                        { cmd: '/link', desc: 'link' },
                                        { cmd: '/div', desc: 'divider' },
                                        { cmd: '/gdoc', desc: 'Google Drive' },
                                    ].map(c => (
                                        <span key={c.cmd} className="whitespace-nowrap">
                                            <span className="font-mono font-medium">{c.cmd}</span>
                                            <span className="text-gray-400 dark:text-gray-500 ml-1">{c.desc}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                          </div>
                      </div>
                      )
                  ) : ( <div className="flex h-full items-center justify-center text-gray-400">Select a page</div> )}
              </div>

              {/* PAGES LIST */}
              {activeTab && (
                  <div className={`${settings.condensedView ? 'w-14' : 'w-56'} border-l border-gray-200 bg-white flex flex-col shadow-inner transition-all duration-200`}>
                      <div className={`p-3 border-b bg-gray-50 flex ${settings.condensedView ? 'justify-center' : 'justify-between'} items-center relative`}>
                          {!settings.condensedView && <span className="font-semibold text-gray-600 text-xs uppercase tracking-wider">Pages</span>}
                          <div className="relative">
                              <button onClick={() => setShowPageTypeMenu(!showPageTypeMenu)} className="hover:bg-gray-200 p-1 rounded transition-colors text-gray-500 page-type-trigger" title="Add page"><Plus size={16} /></button>
                              {showPageTypeMenu && (
                                  <div className="page-type-menu absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 w-48 animate-fade-in">
                                      <button onClick={() => { addPage(); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <span className="text-lg">📝</span> Block Page
                                      </button>
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <button onClick={() => { 
                                          if (!isAuthenticated) { showNotification('Sign in with Google first', 'error'); setShowPageTypeMenu(false); return; }
                                          setShowPageTypeMenu(false);
                                          GoogleAPI.showDrivePicker((file) => {
                                              addGooglePage(file);
                                          });
                                      }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <GoogleG size={18} /> Google Drive
                                      </button>
                                      <button onClick={() => { 
                                          setShowDocImport(true);
                                          setShowPageTypeMenu(false); 
                                      }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <span className="text-lg">📄</span> Google Doc
                                      </button>
                                      <button onClick={() => { 
                                          setShowSheetImport(true);
                                          setShowPageTypeMenu(false); 
                                      }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <span className="text-lg">📊</span> Google Sheet
                                      </button>
                                      <button onClick={() => { 
                                          setShowSlideImport(true);
                                          setShowPageTypeMenu(false); 
                                      }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <span className="text-lg">📽️</span> Google Slides
                                      </button>
                                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                      <button onClick={() => { setShowUrlImport(true); setShowPageTypeMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                                          <span className="text-lg">📑</span> PDF Document
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {activeTab.pages.map((page, index) => (
                              <div key={page.id} id={`nav-page-${page.id}`} tabIndex={0} onKeyDown={(e) => handlePageKeyDown(e, page.id, index, activeTab.pages)}
                                  draggable={!editingPageId} onDragStart={(e) => handleNavDragStart(e, 'page', page.id, index)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleNavDrop(e, 'page', index)}
                                  className={`page-item group flex items-center ${settings.condensedView ? 'justify-center' : 'gap-2'} p-3 border-b cursor-pointer text-sm outline-none transition-all ${activePageId === page.id ? 'bg-gray-100 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                                  onClick={() => { if (activePageId === page.id) return; selectPage(page.id); }}
                                  title={settings.condensedView ? page.name : undefined}>
                                  <span className={settings.condensedView ? 'text-xl' : 'mr-1'}>{page.icon || '📄'}</span>
                                  {!settings.condensedView && (activePageId === page.id && editingPageId === page.id ? (
                                      <input className="flex-1 bg-transparent outline-none page-input" value={page.name} onChange={(e) => updateLocalName('page', page.id, e.target.value)} onFocus={(e) => e.target.select()} onBlur={() => { syncRenameToDrive('page', page.id); setEditingPageId(null); }} onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') e.target.blur(); }} autoFocus />
                                  ) : ( 
                                      <div className="flex-1 truncate" onClick={(e) => { if(activePageId === page.id) { e.stopPropagation(); setEditingPageId(page.id); } }}>{page.name}</div> 
                                  ))}
                                  {!settings.condensedView && (
                                    <div className="flex items-center gap-1">
                                      <button onClick={(e) => { e.stopPropagation(); toggleStar(page.id, activeNotebookId, activeTabId); }} className={`${page.starred ? 'text-yellow-400' : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-400'} transition-all`} title={page.starred ? 'Remove from favorites' : 'Add to favorites'}>
                                        <Star size={14} filled={page.starred} />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); executeDelete('page', page.id); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"><X size={14} /></button>
                                    </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
          
          {activeTabMenu && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-[9999] tab-settings-menu animate-fade-in" style={{ top: activeTabMenu.top, left: activeTabMenu.left }}>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Section Color</div>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                      {COLORS.map(c => ( <div key={c.name} onClick={() => updateTabColor(activeTabMenu.id, c.name)} className={`w-5 h-5 rounded-full cursor-pointer bg-${c.name}-500 hover:scale-125 transition-transform shadow-sm`}></div> ))}
                  </div>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={() => executeDelete('tab', activeTabMenu.id)} className="w-full text-left text-xs text-red-600 p-1.5 hover:bg-red-50 rounded flex items-center gap-2 transition-colors"><Trash2 size={12}/> Delete Section</button>
              </div>
          )}

          {blockMenu && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] block-menu animate-fade-in" style={{ top: blockMenu.top, left: blockMenu.left }}>
                  <div className="grid grid-cols-5 gap-2">
                      <div onClick={() => updateBlockColor(blockMenu.id, null)} className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"><X size={10}/></div>
                      {COLORS.map(c => ( <div key={c.name} onClick={() => updateBlockColor(blockMenu.id, c.name)} className={`w-5 h-5 rounded-full cursor-pointer bg-${c.name}-500 hover:scale-125 transition-transform shadow-sm`}></div> ))}
                  </div>
              </div>
          )}

          {notebookIconPicker && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] notebook-icon-picker animate-fade-in w-64 h-64 overflow-y-auto" style={{ top: notebookIconPicker.top, left: notebookIconPicker.left }}>
                  <div className="grid grid-cols-5 gap-1">
                      {EMOJIS.slice(0, 200).map((emoji, i) => (
                          <div key={i} className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => updateNotebookIcon(notebookIconPicker.id, emoji)}>{emoji}</div>
                      ))}
                  </div>
              </div>
          )}

          {tabIconPicker && (
              <div className="fixed bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-[9999] tab-icon-picker animate-fade-in w-64 h-64 overflow-y-auto" style={{ top: tabIconPicker.top, left: tabIconPicker.left }}>
                  <div className="grid grid-cols-5 gap-1">
                      {EMOJIS.slice(0, 200).map((emoji, i) => (
                          <div key={i} className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded text-center" onClick={() => updateTabIcon(tabIconPicker.id, emoji)}>{emoji}</div>
                      ))}
                  </div>
              </div>
          )}

          {notification && <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-[10000] animate-bounce-in">{notification.message}</div>}

          {showUrlImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <span className="text-2xl">📑</span>
                              Add PDF Document
                          </h3>
                          <button onClick={() => { setShowUrlImport(false); setUrlImportValue(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              PDF URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://example.com/document.pdf"
                              value={urlImportValue}
                              onChange={(e) => setUrlImportValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleUrlImport(); }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Enter a direct link to a PDF file or a Google Drive sharing link. The PDF will be displayed using Google's PDF viewer.
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowUrlImport(false); setUrlImportValue(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleUrlImport}
                              disabled={!urlImportValue}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Google Drive Import Modal */}
          {showDriveImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <GoogleG size={20} /> Add from Google Drive
                          </h3>
                          <button onClick={() => { setShowDriveImport(false); setDriveImportUrl(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <button 
                              onClick={() => {
                                  GoogleAPI.showDrivePicker((file) => {
                                      addGooglePage(file);
                                      setShowDriveImport(false);
                                      setDriveImportUrl('');
                                  });
                              }}
                              className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                          >
                              <FolderOpen size={18} /> Browse My Drive
                          </button>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                          <span className="text-sm text-gray-400">OR</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Paste a Google Drive URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://docs.google.com/... or https://drive.google.com/..."
                              value={driveImportUrl}
                              onChange={(e) => setDriveImportUrl(e.target.value)}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Paste a link to a Google Doc, Sheet, Slides, or any Drive file shared with you.
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowDriveImport(false); setDriveImportUrl(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => {
                                  if (addGooglePageFromUrl(driveImportUrl)) {
                                      setShowDriveImport(false);
                                      setDriveImportUrl('');
                                  }
                              }}
                              disabled={!driveImportUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Google Doc Import Modal */}
          {showDocImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <span className="text-2xl">📄</span> Add Google Doc
                          </h3>
                          <button onClick={() => { setShowDocImport(false); setDocImportUrl(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <button 
                              title="Feature coming soon"
                              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                          >
                              <FilePlus size={18} /> New Document
                          </button>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                          <span className="text-sm text-gray-400">OR</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Google Doc URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://docs.google.com/document/d/..."
                              value={docImportUrl}
                              onChange={(e) => setDocImportUrl(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && docImportUrl) { addGooglePageFromUrl(docImportUrl); setShowDocImport(false); setDocImportUrl(''); } }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Paste a link to a Google Doc shared with "anyone with link"
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowDocImport(false); setDocImportUrl(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => {
                                  if (addGooglePageFromUrl(docImportUrl)) {
                                      setShowDocImport(false);
                                      setDocImportUrl('');
                                  }
                              }}
                              disabled={!docImportUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Google Sheet Import Modal */}
          {showSheetImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <span className="text-2xl">📊</span> Add Google Sheet
                          </h3>
                          <button onClick={() => { setShowSheetImport(false); setSheetImportUrl(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <button 
                              title="Feature coming soon"
                              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                          >
                              <FilePlus size={18} /> New Spreadsheet
                          </button>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                          <span className="text-sm text-gray-400">OR</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Google Sheet URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://docs.google.com/spreadsheets/d/..."
                              value={sheetImportUrl}
                              onChange={(e) => setSheetImportUrl(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && sheetImportUrl) { addGooglePageFromUrl(sheetImportUrl); setShowSheetImport(false); setSheetImportUrl(''); } }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Paste a link to a Google Sheet shared with "anyone with link"
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowSheetImport(false); setSheetImportUrl(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => {
                                  if (addGooglePageFromUrl(sheetImportUrl)) {
                                      setShowSheetImport(false);
                                      setSheetImportUrl('');
                                  }
                              }}
                              disabled={!sheetImportUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Google Slides Import Modal */}
          {showSlideImport && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <span className="text-2xl">📽️</span> Add Google Slides
                          </h3>
                          <button onClick={() => { setShowSlideImport(false); setSlideImportUrl(''); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <button 
                              title="Feature coming soon"
                              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                          >
                              <FilePlus size={18} /> New Presentation
                          </button>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                          <span className="text-sm text-gray-400">OR</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Google Slides URL
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://docs.google.com/presentation/d/..."
                              value={slideImportUrl}
                              onChange={(e) => setSlideImportUrl(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && slideImportUrl) { addGooglePageFromUrl(slideImportUrl); setShowSlideImport(false); setSlideImportUrl(''); } }}
                              autoFocus
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              Paste a link to a Google Slides presentation shared with "anyone with link"
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => { setShowSlideImport(false); setSlideImportUrl(''); }}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => {
                                  if (addGooglePageFromUrl(slideImportUrl)) {
                                      setShowSlideImport(false);
                                      setSlideImportUrl('');
                                  }
                              }}
                              disabled={!slideImportUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Add Page
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {showEditEmbed && activePage && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-3 dark:text-white">
                              <Edit3 size={20} /> Edit Page
                          </h3>
                          <button onClick={() => setShowEditEmbed(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <X size={20} className="dark:text-white" />
                          </button>
                      </div>

                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              {activePage.type === 'doc' ? 'Google Doc URL' : 
                               activePage.type === 'sheet' ? 'Google Sheet URL' : 
                               activePage.type === 'slide' ? 'Google Slides URL' :
                               activePage.type === 'web' ? 'Web Page URL' :
                               activePage.type === 'pdf' ? 'PDF URL' : 'URL'}
                          </label>
                          <input 
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                              placeholder="https://..."
                              value={editEmbedUrl}
                              onChange={(e) => setEditEmbedUrl(e.target.value)}
                          />
                          <p className="text-xs text-gray-400 mt-2">
                              {['doc', 'sheet', 'slide'].includes(activePage.type) 
                                  ? 'Paste a Google Docs, Sheets, or Slides URL to update the source.'
                                  : 'Update the URL for this embedded page.'}
                          </p>
                      </div>

                      <div className="flex justify-end gap-3">
                          <button 
                              onClick={() => setShowEditEmbed(false)}
                              className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleSaveEmbed}
                              disabled={!editEmbedUrl}
                              className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Save Changes
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {itemToDelete && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                      <h3 className="font-bold text-xl mb-2 flex items-center gap-2 dark:text-white"><AlertCircle className="text-red-500" /> Confirm Deletion</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">Are you sure you want to delete this {itemToDelete.type}? All contents will be lost forever.</p>
                      <div className="flex justify-end gap-3">
                          <button onClick={() => setItemToDelete(null)} className="px-5 py-2 font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                          <button onClick={confirmDelete} className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-lg">Delete</button>
                      </div>
                  </div>
              </div>
          )}

          {/* Sign Out Confirmation Dialog */}
          {showSignOutConfirm && (
              <div className="fixed inset-0 bg-black/50 z-[10001] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 animate-fade-in max-w-sm w-full">
                      <h3 className="font-bold text-lg mb-2 dark:text-white">Sign out of Google?</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Your data will remain synced. You can sign back in anytime.</p>
                      <div className="flex gap-3 justify-end">
                          <button 
                              onClick={() => setShowSignOutConfirm(false)} 
                              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={() => { handleSignOut(); setShowSignOutConfirm(false); }} 
                              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                              Yes, Sign Out
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {showSettings && (
              <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in settings-modal">
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-xl flex items-center gap-2 dark:text-white"><Settings size={20} /> Settings</h3>
                          <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X size={20} className="dark:text-white" /></button>
                      </div>
                      
                      {/* Theme */}
                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                          <div className="flex gap-2">
                              {[
                                  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
                                  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                                  { value: 'system', icon: <Monitor size={16} />, label: 'System' },
                              ].map(opt => (
                                  <button
                                      key={opt.value}
                                      onClick={() => setSettings(s => ({ ...s, theme: opt.value }))}
                                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                                          settings.theme === opt.value 
                                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                      }`}
                                  >
                                      {opt.icon}
                                      <span className="text-sm font-medium">{opt.label}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Max Columns */}
                      <div className="mb-6">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              <span className="flex items-center gap-2"><Columns size={16} /> Max Columns per Row</span>
                          </label>
                          <div className="flex items-center gap-3">
                              <input 
                                  type="range" 
                                  min="1" 
                                  max="6" 
                                  value={settings.maxColumns} 
                                  onChange={(e) => setSettings(s => ({ ...s, maxColumns: parseInt(e.target.value) }))}
                                  className="flex-1 accent-blue-500"
                              />
                              <span className="w-8 text-center font-bold text-lg dark:text-white">{settings.maxColumns}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Controls how many columns you can create when dragging blocks side-by-side</p>
                      </div>

                      <div className="border-t dark:border-gray-700 pt-4">
                          <button 
                              onClick={() => setShowSettings(false)} 
                              className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                          >
                              Done
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);