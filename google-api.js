// Google API Helper Module for Strata
// Handles authentication, Drive API operations, and Picker integration

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient = null;
let accessToken = null;
let userEmail = null;

// Session storage keys for persistence
const STORAGE_KEY_TOKEN = 'strata_access_token';
const STORAGE_KEY_USER = 'strata_user_info';
const STORAGE_KEY_EXPIRY = 'strata_token_expiry';

// Initialize Google API client
const loadGapi = () => {
    return new Promise((resolve, reject) => {
        if (gapiLoaded) {
            resolve();
            return;
        }

        if (typeof gapi === 'undefined') {
            reject(new Error('Google API script not loaded'));
            return;
        }

        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: GOOGLE_CONFIG.API_KEY,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                });
                gapiLoaded = true;
                resolve();
            } catch (error) {
                console.error('Error loading gapi:', error);
                reject(error);
            }
        });
    });
};

// Store pending sign-in promise resolver
let signInResolver = null;
let signInRejecter = null;

// Initialize Google Identity Services
const initGoogleAuth = () => {
    return new Promise((resolve, reject) => {
        if (gisLoaded && tokenClient) {
            resolve();
            return;
        }

        if (typeof google === 'undefined' || !google.accounts) {
            reject(new Error('Google Identity Services script not loaded'));
            return;
        }

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            scope: GOOGLE_CONFIG.SCOPES.join(' '),
            callback: async (response) => {
                if (response.error) {
                    console.error('OAuth error:', response.error);
                    if (signInRejecter) {
                        signInRejecter(new Error(response.error));
                        signInResolver = null;
                        signInRejecter = null;
                    }
                    return;
                }
                accessToken = response.access_token;
                gapi.client.setToken({ access_token: accessToken });
                
                // Save token to sessionStorage for persistence (expires in ~1 hour)
                const expiryTime = Date.now() + (response.expires_in * 1000);
                sessionStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
                sessionStorage.setItem(STORAGE_KEY_EXPIRY, expiryTime.toString());
                
                // Resolve the pending sign-in promise
                if (signInResolver) {
                    try {
                        const userInfo = await getUserInfo();
                        // Save user info to sessionStorage
                        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userInfo));
                        signInResolver(userInfo);
                    } catch (error) {
                        if (signInRejecter) signInRejecter(error);
                    }
                    signInResolver = null;
                    signInRejecter = null;
                }
            },
        });

        gisLoaded = true;
        resolve();
    });
};

// Sign in user
const signIn = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!tokenClient) {
                await initGoogleAuth();
            }
            
            // Store resolvers for the callback to use
            signInResolver = resolve;
            signInRejecter = reject;
            
            // Request the access token - this opens the popup
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (error) {
            reject(error);
        }
    });
};

// Sign out user
const signOut = () => {
    if (accessToken) {
        google.accounts.oauth2.revoke(accessToken);
        accessToken = null;
        userEmail = null;
        gapi.client.setToken(null);
    }
    // Clear session storage
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_EXPIRY);
};

// Get current access token
const getAccessToken = () => {
    return accessToken;
};

// Check if user is authenticated (also restores session from storage)
const checkAuthStatus = async () => {
    try {
        if (!gapiLoaded) {
            await loadGapi();
        }
        if (!gisLoaded) {
            await initGoogleAuth();
        }

        // First check sessionStorage for saved token
        const savedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN);
        const savedExpiry = sessionStorage.getItem(STORAGE_KEY_EXPIRY);
        const savedUser = sessionStorage.getItem(STORAGE_KEY_USER);
        
        if (savedToken && savedExpiry) {
            const expiryTime = parseInt(savedExpiry, 10);
            // Check if token is still valid (with 5 min buffer)
            if (Date.now() < expiryTime - 300000) {
                accessToken = savedToken;
                gapi.client.setToken({ access_token: accessToken });
                
                // Return saved user info if available
                if (savedUser) {
                    const userInfo = JSON.parse(savedUser);
                    userEmail = userInfo.email;
                    return userInfo;
                }
                
                // Otherwise fetch fresh user info
                try {
                    const userInfo = await getUserInfo();
                    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userInfo));
                    return userInfo;
                } catch (e) {
                    // Token invalid, clear storage
                    signOut();
                    return null;
                }
            } else {
                // Token expired, clear storage
                signOut();
            }
        }

        // Fallback: check gapi client token (shouldn't normally have one after reload)
        const token = gapi.client.getToken();
        if (token && token.access_token) {
            accessToken = token.access_token;
            try {
                const userInfo = await getUserInfo();
                return userInfo;
            } catch (e) {
                return null;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
};

// Get user info - using fetch directly to avoid API key being added by gapi.client
const getUserInfo = async () => {
    try {
        // Use fetch directly with Authorization header (no API key)
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get user info: ${response.status}`);
        }
        
        const result = await response.json();
        userEmail = result.email;
        return result;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

// Handle token expiration
const handleTokenExpiration = async () => {
    try {
        // Try to refresh token
        if (tokenClient) {
            tokenClient.requestAccessToken({ prompt: '' });
            return true;
        }
        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
};

// Ensure authenticated before API calls
const ensureAuthenticated = async () => {
    if (!accessToken) {
        const isAuth = await checkAuthStatus();
        if (!isAuth) {
            throw new Error('Not authenticated');
        }
    }
    return true;
};

// ===== Drive API Functions =====

// Get appDataFolder file (strata_manifest.json)
const getAppDataFile = async () => {
    try {
        await ensureAuthenticated();

        const response = await gapi.client.drive.files.list({
            q: "name='strata_manifest.json' and 'appDataFolder' in parents",
            spaces: 'appDataFolder',
            fields: 'files(id, name, modifiedTime)'
        });

        if (response.result.files && response.result.files.length > 0) {
            const fileId = response.result.files[0].id;
            const fileResponse = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });
            return JSON.parse(fileResponse.body);
        }
        return null;
    } catch (error) {
        console.error('Error getting app data file:', error);
        if (error.status === 401) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Create appDataFolder file
const createAppDataFile = async (content) => {
    try {
        await ensureAuthenticated();

        const metadata = {
            name: 'strata_manifest.json',
            parents: ['appDataFolder']
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: form
        });

        if (!response.ok) {
            throw new Error(`Failed to create file: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating app data file:', error);
        if (error.status === 401 || error.message.includes('Authentication')) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Update appDataFolder file
const updateAppDataFile = async (content) => {
    try {
        await ensureAuthenticated();

        // First, get the file ID
        const listResponse = await gapi.client.drive.files.list({
            q: "name='strata_manifest.json' and 'appDataFolder' in parents",
            spaces: 'appDataFolder',
            fields: 'files(id)'
        });

        if (!listResponse.result.files || listResponse.result.files.length === 0) {
            return await createAppDataFile(content);
        }

        const fileId = listResponse.result.files[0].id;

        // Update the file
        const metadata = {
            name: 'strata_manifest.json'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

        const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: form
        });

        if (!response.ok) {
            throw new Error(`Failed to update file: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating app data file:', error);
        if (error.status === 401 || error.message.includes('Authentication')) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Create Drive folder
const createDriveFolder = async (name, parentId = null) => {
    try {
        await ensureAuthenticated();

        const fileMetadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.folder'
        };

        if (parentId) {
            fileMetadata.parents = [parentId];
        }

        const response = await gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id, name, webViewLink'
        });

        return response.result;
    } catch (error) {
        console.error('Error creating folder:', error);
        if (error.status === 401) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Get or create folder - checks for existing folder first to prevent duplicates
const getOrCreateFolder = async (name, parentId) => {
    try {
        await ensureAuthenticated();
        
        const sanitizedName = sanitizeFileName(name);
        
        // Search for existing folder with same name in parent
        const searchQuery = parentId 
            ? `name='${sanitizedName.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
            : `name='${sanitizedName.replace(/'/g, "\\'")}' and 'root' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
        
        const searchResponse = await gapi.client.drive.files.list({
            q: searchQuery,
            fields: 'files(id, name)',
            pageSize: 1
        });
        
        // If folder exists, return its ID
        if (searchResponse.result.files && searchResponse.result.files.length > 0) {
            return searchResponse.result.files[0].id;
        }
        
        // Create new folder if not found
        const folder = await createDriveFolder(sanitizedName, parentId);
        return folder.id;
    } catch (error) {
        console.error('Error in getOrCreateFolder:', error);
        throw error;
    }
};

// Update Drive folder name
const updateDriveFolder = async (folderId, name) => {
    try {
        await ensureAuthenticated();

        const response = await gapi.client.drive.files.update({
            fileId: folderId,
            resource: { name: name },
            fields: 'id, name'
        });

        return response.result;
    } catch (error) {
        console.error('Error updating folder:', error);
        if (error.status === 401) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Delete Drive folder
const deleteDriveFolder = async (folderId) => {
    try {
        await ensureAuthenticated();

        await gapi.client.drive.files.delete({
            fileId: folderId
        });

        return true;
    } catch (error) {
        console.error('Error deleting folder:', error);
        if (error.status === 401) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Upload file to Drive
const uploadFileToDrive = async (file, folderId, name) => {
    try {
        await ensureAuthenticated();

        const metadata = {
            name: name,
            parents: folderId ? [folderId] : []
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: form
        });

        if (!response.ok) {
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        const result = await response.json();

        // Get webViewLink
        const fileResponse = await gapi.client.drive.files.get({
            fileId: result.id,
            fields: 'id, name, webViewLink, mimeType'
        });

        return fileResponse.result;
    } catch (error) {
        console.error('Error uploading file:', error);
        if (error.status === 401 || error.message.includes('Authentication')) {
            await handleTokenExpiration();
            throw new Error('Authentication expired');
        }
        throw error;
    }
};

// Get or create root folder "Strata Notebooks" in visible My Drive (not appDataFolder)
const getOrCreateRootFolder = async () => {
    try {
        await ensureAuthenticated();

        // Search for existing folder in My Drive root (not appDataFolder)
        const response = await gapi.client.drive.files.list({
            q: "name='Strata Notebooks' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false",
            fields: 'files(id, name)',
            pageSize: 1
        });

        if (response.result.files && response.result.files.length > 0) {
            return response.result.files[0].id;
        }

        // Create in My Drive root if doesn't exist
        const fileMetadata = {
            name: 'Strata Notebooks',
            mimeType: 'application/vnd.google-apps.folder',
            parents: ['root']  // Explicitly put in My Drive root
        };
        
        const createResponse = await gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id, name, webViewLink'
        });

        return createResponse.result.id;
    } catch (error) {
        console.error('Error getting/creating root folder:', error);
        throw error;
    }
};

// ===== Two-way Sync Functions =====

// Sync a notebook to Drive (create folder if needed)
const syncNotebookToDrive = async (notebook, rootFolderId) => {
    try {
        await ensureAuthenticated();
        
        const folderName = sanitizeFileName(notebook.name);
        
        // If notebook already has a Drive folder ID, check if it exists
        if (notebook.driveFolderId) {
            try {
                const existing = await gapi.client.drive.files.get({
                    fileId: notebook.driveFolderId,
                    fields: 'id, name, trashed'
                });
                if (!existing.result.trashed) {
                    // Folder exists, update name if needed
                    if (existing.result.name !== folderName) {
                        await updateDriveFolder(notebook.driveFolderId, folderName);
                    }
                    return notebook.driveFolderId;
                }
            } catch (e) {
                // Folder doesn't exist, will create new one
            }
        }
        
        // Create new folder for notebook
        const folder = await createDriveFolder(folderName, rootFolderId);
        return folder.id;
    } catch (error) {
        console.error('Error syncing notebook to Drive:', error);
        throw error;
    }
};

// Sync a tab to Drive (create folder if needed)
const syncTabToDrive = async (tab, notebookFolderId) => {
    try {
        await ensureAuthenticated();
        
        const folderName = sanitizeFileName(tab.name);
        
        // If tab already has a Drive folder ID, check if it exists
        if (tab.driveFolderId) {
            try {
                const existing = await gapi.client.drive.files.get({
                    fileId: tab.driveFolderId,
                    fields: 'id, name, trashed'
                });
                if (!existing.result.trashed) {
                    // Folder exists, update name if needed
                    if (existing.result.name !== folderName) {
                        await updateDriveFolder(tab.driveFolderId, folderName);
                    }
                    return tab.driveFolderId;
                }
            } catch (e) {
                // Folder doesn't exist, will create new one
            }
        }
        
        // Create new folder for tab
        const folder = await createDriveFolder(folderName, notebookFolderId);
        return folder.id;
    } catch (error) {
        console.error('Error syncing tab to Drive:', error);
        throw error;
    }
};

// Sync a page to Drive (create file if needed)
const syncPageToDrive = async (page, tabFolderId) => {
    try {
        await ensureAuthenticated();
        
        const fileName = sanitizeFileName(page.name) + '.json';
        const pageContent = {
            type: page.type || 'block',
            name: page.name,
            icon: page.icon,
            cover: page.cover,
            content: page.rows || page.content,
            googleFileId: page.googleFileId,
            url: page.url,
            createdAt: page.createdAt,
            modifiedAt: Date.now()
        };
        
        // If page already has a Drive file ID, update it
        if (page.driveFileId) {
            try {
                const existing = await gapi.client.drive.files.get({
                    fileId: page.driveFileId,
                    fields: 'id, name, trashed'
                });
                if (!existing.result.trashed) {
                    // File exists, update it
                    const form = new FormData();
                    form.append('metadata', new Blob([JSON.stringify({ name: fileName })], { type: 'application/json' }));
                    form.append('file', new Blob([JSON.stringify(pageContent)], { type: 'application/json' }));
                    
                    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${page.driveFileId}?uploadType=multipart`, {
                        method: 'PATCH',
                        headers: { 'Authorization': `Bearer ${accessToken}` },
                        body: form
                    });
                    return page.driveFileId;
                }
            } catch (e) {
                // File doesn't exist, will create new one
            }
        }
        
        // Create new file for page
        const metadata = {
            name: fileName,
            parents: [tabFolderId],
            mimeType: 'application/json'
        };
        
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([JSON.stringify(pageContent)], { type: 'application/json' }));
        
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: form
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create page file: ${response.statusText}`);
        }
        
        const result = await response.json();
        return result.id;
    } catch (error) {
        console.error('Error syncing page to Drive:', error);
        throw error;
    }
};

// Helper: Strip HTML tags and get plain text
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
};

// Helper: Convert block content to Google Docs API requests
const convertBlocksToDocsRequests = (rows) => {
    const requests = [];
    let currentIndex = 1; // Google Docs starts at index 1
    
    if (!rows || !Array.isArray(rows)) return requests;
    
    for (const row of rows) {
        if (!row.columns) continue;
        
        for (const column of row.columns) {
            if (!column.blocks) continue;
            
            for (const block of column.blocks) {
                const content = stripHtml(block.content || '');
                if (!content && block.type !== 'divider') continue;
                
                const textToInsert = content + '\n';
                const textLength = textToInsert.length;
                
                switch (block.type) {
                    case 'h1':
                    case 'h2':
                    case 'h3':
                    case 'h4':
                        // Insert text
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: textToInsert
                            }
                        });
                        // Apply heading style
                        const headingStyle = {
                            'h1': 'HEADING_1',
                            'h2': 'HEADING_2',
                            'h3': 'HEADING_3',
                            'h4': 'HEADING_4'
                        }[block.type];
                        requests.push({
                            updateParagraphStyle: {
                                range: {
                                    startIndex: currentIndex,
                                    endIndex: currentIndex + textLength
                                },
                                paragraphStyle: {
                                    namedStyleType: headingStyle
                                },
                                fields: 'namedStyleType'
                            }
                        });
                        currentIndex += textLength;
                        break;
                        
                    case 'text':
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: textToInsert
                            }
                        });
                        currentIndex += textLength;
                        break;
                        
                    case 'ul':
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: textToInsert
                            }
                        });
                        requests.push({
                            createParagraphBullets: {
                                range: {
                                    startIndex: currentIndex,
                                    endIndex: currentIndex + textLength
                                },
                                bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE'
                            }
                        });
                        currentIndex += textLength;
                        break;
                        
                    case 'ol':
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: textToInsert
                            }
                        });
                        requests.push({
                            createParagraphBullets: {
                                range: {
                                    startIndex: currentIndex,
                                    endIndex: currentIndex + textLength
                                },
                                bulletPreset: 'NUMBERED_DECIMAL_ALPHA_ROMAN'
                            }
                        });
                        currentIndex += textLength;
                        break;
                        
                    case 'todo':
                        const checkbox = block.checked ? '☑ ' : '☐ ';
                        const todoText = checkbox + content + '\n';
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: todoText
                            }
                        });
                        currentIndex += todoText.length;
                        break;
                        
                    case 'divider':
                        // Insert a horizontal line using special characters
                        const dividerText = '─'.repeat(50) + '\n';
                        requests.push({
                            insertText: {
                                location: { index: currentIndex },
                                text: dividerText
                            }
                        });
                        currentIndex += dividerText.length;
                        break;
                        
                    case 'image':
                        if (block.url) {
                            const imageText = `[Image: ${block.url}]\n`;
                            requests.push({
                                insertText: {
                                    location: { index: currentIndex },
                                    text: imageText
                                }
                            });
                            currentIndex += imageText.length;
                        }
                        break;
                        
                    case 'video':
                        if (block.url) {
                            const videoText = `[Video: ${block.url}]\n`;
                            requests.push({
                                insertText: {
                                    location: { index: currentIndex },
                                    text: videoText
                                }
                            });
                            currentIndex += videoText.length;
                        }
                        break;
                        
                    case 'link':
                        if (block.url) {
                            const linkText = `${content || block.url}\n`;
                            requests.push({
                                insertText: {
                                    location: { index: currentIndex },
                                    text: linkText
                                }
                            });
                            // Add hyperlink
                            requests.push({
                                updateTextStyle: {
                                    range: {
                                        startIndex: currentIndex,
                                        endIndex: currentIndex + linkText.length - 1
                                    },
                                    textStyle: {
                                        link: { url: block.url }
                                    },
                                    fields: 'link'
                                }
                            });
                            currentIndex += linkText.length;
                        }
                        break;
                        
                    default:
                        // For any other block type, just insert as text
                        if (content) {
                            requests.push({
                                insertText: {
                                    location: { index: currentIndex },
                                    text: textToInsert
                                }
                            });
                            currentIndex += textLength;
                        }
                        break;
                }
            }
        }
    }
    
    return requests;
};

// Create a Google Doc for a block page
const createGoogleDocForPage = async (page, tabFolderId) => {
    try {
        await ensureAuthenticated();
        
        // Step 1: Create a new Google Doc
        const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: page.name || 'Untitled Page'
            })
        });
        
        if (!createResponse.ok) {
            throw new Error(`Failed to create Google Doc: ${createResponse.statusText}`);
        }
        
        const doc = await createResponse.json();
        const docId = doc.documentId;
        
        // Step 2: Convert blocks to Docs API requests and update the document
        const requests = convertBlocksToDocsRequests(page.rows);
        
        if (requests.length > 0) {
            const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests })
            });
            
            if (!updateResponse.ok) {
                console.error('Failed to update Google Doc content:', await updateResponse.text());
                // Continue anyway - doc was created, just content failed
            }
        }
        
        // Step 3: Move the doc to the tab folder
        // First get current parents, then move
        const fileResponse = await gapi.client.drive.files.get({
            fileId: docId,
            fields: 'parents'
        });
        
        const previousParents = fileResponse.result.parents ? fileResponse.result.parents.join(',') : '';
        
        await gapi.client.drive.files.update({
            fileId: docId,
            addParents: tabFolderId,
            removeParents: previousParents,
            fields: 'id, parents'
        });
        
        return docId;
    } catch (error) {
        console.error('Error creating Google Doc for page:', error);
        throw error;
    }
};

// Update an existing Google Doc with page content
const updateGoogleDoc = async (docId, page) => {
    try {
        await ensureAuthenticated();
        
        // First, get the current document to find the end index
        const getResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`Failed to get Google Doc: ${getResponse.statusText}`);
        }
        
        const doc = await getResponse.json();
        const endIndex = doc.body?.content?.[doc.body.content.length - 1]?.endIndex || 1;
        
        // Delete all content (except the first newline which is required)
        const requests = [];
        if (endIndex > 2) {
            requests.push({
                deleteContentRange: {
                    range: {
                        startIndex: 1,
                        endIndex: endIndex - 1
                    }
                }
            });
        }
        
        // Add new content
        const contentRequests = convertBlocksToDocsRequests(page.rows);
        requests.push(...contentRequests);
        
        if (requests.length > 0) {
            const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests })
            });
            
            if (!updateResponse.ok) {
                console.error('Failed to update Google Doc:', await updateResponse.text());
            }
        }
        
        // Update title if changed
        await gapi.client.drive.files.update({
            fileId: docId,
            resource: { name: page.name }
        });
        
        return docId;
    } catch (error) {
        console.error('Error updating Google Doc:', error);
        throw error;
    }
};

// Create a Google Drive shortcut to an existing file
const createDriveShortcut = async (name, targetFileId, parentFolderId) => {
    try {
        await ensureAuthenticated();
        
        const metadata = {
            name: name,
            mimeType: 'application/vnd.google-apps.shortcut',
            shortcutDetails: {
                targetId: targetFileId
            },
            parents: [parentFolderId]
        };
        
        const response = await gapi.client.drive.files.create({
            resource: metadata,
            fields: 'id, name, shortcutDetails'
        });
        
        return response.result;
    } catch (error) {
        console.error('Error creating Drive shortcut:', error);
        throw error;
    }
};

// Update a Drive shortcut (rename only - target cannot be changed)
const updateDriveShortcut = async (shortcutId, newName) => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.files.update({
            fileId: shortcutId,
            resource: { name: newName },
            fields: 'id, name'
        });
        
        return response.result;
    } catch (error) {
        console.error('Error updating Drive shortcut:', error);
        throw error;
    }
};

// Rename a Drive item (file or folder)
const renameDriveItem = async (itemId, newName) => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.files.update({
            fileId: itemId,
            resource: { name: newName },
            fields: 'id, name'
        });
        
        return response.result;
    } catch (error) {
        console.error('Error renaming Drive item:', error);
        throw error;
    }
};

// Move a Drive item to a new parent folder
const moveDriveItem = async (itemId, newParentId, oldParentId) => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.files.update({
            fileId: itemId,
            addParents: newParentId,
            removeParents: oldParentId,
            fields: 'id, parents'
        });
        
        return response.result;
    } catch (error) {
        console.error('Error moving Drive item:', error);
        throw error;
    }
};

// Delete (trash) a Drive item
const deleteDriveItem = async (itemId) => {
    try {
        await ensureAuthenticated();
        
        // Move to trash instead of permanent delete
        await gapi.client.drive.files.update({
            fileId: itemId,
            resource: { trashed: true }
        });
        
        return true;
    } catch (error) {
        console.error('Error deleting Drive item:', error);
        // Don't throw - deletion failure shouldn't break the app
        return false;
    }
};

// Get a page token to start tracking changes
const getStartPageToken = async () => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.changes.getStartPageToken({});
        return response.result.startPageToken;
    } catch (error) {
        console.error('Error getting start page token:', error);
        throw error;
    }
};

// Get changes since a page token
const getDriveChanges = async (pageToken, rootFolderId) => {
    try {
        await ensureAuthenticated();
        
        const changes = [];
        let nextPageToken = pageToken;
        
        while (nextPageToken) {
            const response = await gapi.client.drive.changes.list({
                pageToken: nextPageToken,
                fields: 'newStartPageToken, nextPageToken, changes(fileId, removed, file(id, name, mimeType, parents, trashed))',
                includeRemoved: true,
                spaces: 'drive'
            });
            
            // Filter changes to only include items under our root folder
            for (const change of response.result.changes || []) {
                if (change.file && change.file.parents) {
                    // Check if this file is under our Strata folder hierarchy
                    changes.push({
                        fileId: change.fileId,
                        removed: change.removed,
                        file: change.file
                    });
                }
            }
            
            nextPageToken = response.result.nextPageToken;
            if (response.result.newStartPageToken) {
                // Return the new token along with changes
                return {
                    changes,
                    newPageToken: response.result.newStartPageToken
                };
            }
        }
        
        return { changes, newPageToken: pageToken };
    } catch (error) {
        console.error('Error getting Drive changes:', error);
        throw error;
    }
};

// List contents of a folder
const listFolderContents = async (folderId) => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.files.list({
            q: `'${folderId}' in parents and trashed=false`,
            fields: 'files(id, name, mimeType, modifiedTime)',
            orderBy: 'name'
        });
        
        return response.result.files || [];
    } catch (error) {
        console.error('Error listing folder contents:', error);
        throw error;
    }
};

// Get file content
const getFileContent = async (fileId) => {
    try {
        await ensureAuthenticated();
        
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error getting file content:', error);
        throw error;
    }
};

// Full sync - sync entire app structure to Drive
const fullSyncToDrive = async (data) => {
    try {
        await ensureAuthenticated();
        
        const rootFolderId = await getOrCreateRootFolder();
        const updatedData = JSON.parse(JSON.stringify(data)); // Deep clone
        
        for (const notebook of updatedData.notebooks) {
            // Sync notebook folder
            const notebookFolderId = await syncNotebookToDrive(notebook, rootFolderId);
            notebook.driveFolderId = notebookFolderId;
            
            for (const tab of notebook.tabs) {
                // Sync tab folder
                const tabFolderId = await syncTabToDrive(tab, notebookFolderId);
                tab.driveFolderId = tabFolderId;
                
                for (const page of tab.pages) {
                    // Sync page file
                    const pageFileId = await syncPageToDrive(page, tabFolderId);
                    page.driveFileId = pageFileId;
                }
            }
        }
        
        return { data: updatedData, rootFolderId };
    } catch (error) {
        console.error('Error in full sync to Drive:', error);
        throw error;
    }
};

// ===== Picker API Functions =====

// Show Google Drive Picker
// mimeTypeFilter: optional MIME type to filter files (e.g., 'application/vnd.google-apps.document')
const showDrivePicker = (callback, mimeTypeFilter = null) => {
    if (typeof google === 'undefined' || !google.picker) {
        console.error('Google Picker API not loaded');
        return;
    }

    if (!accessToken) {
        console.error('Not authenticated');
        return;
    }

    const view = new google.picker.DocsView(google.picker.ViewId.DOCS);
    view.setIncludeFolders(true);
    view.setSelectFolderEnabled(false);
    
    // Apply MIME type filter if provided
    if (mimeTypeFilter) {
        view.setMimeTypes(mimeTypeFilter);
    }

    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(accessToken)
        .setDeveloperKey(GOOGLE_CONFIG.API_KEY)
        .setCallback((data) => {
            if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
                const docs = data[google.picker.Response.DOCUMENTS];
                if (docs && docs.length > 0 && callback) {
                    // Get file details from Drive API
                    gapi.client.drive.files.get({
                        fileId: docs[0].id,
                        fields: 'id, name, mimeType, webViewLink'
                    }).then(response => {
                        callback({
                            id: response.result.id,
                            name: response.result.name,
                            mimeType: response.result.mimeType,
                            webViewLink: response.result.webViewLink,
                            url: response.result.webViewLink
                        });
                    }).catch(error => {
                        console.error('Error getting file details:', error);
                        // Fallback to basic info
                        callback({
                            id: docs[0].id,
                            name: docs[0].name,
                            mimeType: docs[0].mimeType,
                            url: docs[0].url
                        });
                    });
                }
            }
        })
        .addView(view)
        .build();

    picker.setVisible(true);
};

// ===== Portable Backup Functions =====

// Sanitize filename to be filesystem-safe
const sanitizeFileName = (name) => {
    if (!name) return 'Untitled';
    // Remove/replace characters that are invalid in filenames
    return name
        .replace(/[<>:"/\\|?*]/g, '-')  // Replace invalid chars with dash
        .replace(/\s+/g, ' ')            // Normalize whitespace
        .replace(/^\.+/, '')             // Remove leading dots
        .replace(/\.+$/, '')             // Remove trailing dots
        .trim()
        .substring(0, 200);              // Limit length
};

// Create or update manifest.json in the root folder
const updateManifest = async (data, rootFolderId, appVersion) => {
    try {
        await ensureAuthenticated();
        
        const manifest = {
            version: appVersion || '2.2.0',
            exportedAt: new Date().toISOString(),
            notebooks: data.notebooks.map(nb => ({
                id: nb.id,
                name: nb.name,
                icon: nb.icon || '📓',
                folder: sanitizeFileName(nb.name),
                driveFolderId: nb.driveFolderId,
                tabs: nb.tabs.map(tab => ({
                    id: tab.id,
                    name: tab.name,
                    icon: tab.icon || '📋',
                    color: tab.color || 'blue',
                    folder: sanitizeFileName(tab.name),
                    driveFolderId: tab.driveFolderId,
                    pages: tab.pages.map(page => ({
                        id: page.id,
                        name: page.name,
                        icon: page.icon || '📄',
                        file: sanitizeFileName(page.name) + '.json',
                        type: page.type || 'block',
                        driveFileId: page.driveFileId,
                        // For Google pages, include the link
                        ...(page.embedUrl && { embedUrl: page.embedUrl }),
                        ...(page.webViewLink && { webViewLink: page.webViewLink })
                    }))
                }))
            }))
        };
        
        // Check if manifest.json already exists
        const searchResponse = await gapi.client.drive.files.list({
            q: `name='manifest.json' and '${rootFolderId}' in parents and trashed=false`,
            fields: 'files(id)',
            pageSize: 1
        });
        
        const manifestContent = JSON.stringify(manifest, null, 2);
        const manifestBlob = new Blob([manifestContent], { type: 'application/json' });
        
        if (searchResponse.result.files && searchResponse.result.files.length > 0) {
            // Update existing manifest
            const fileId = searchResponse.result.files[0].id;
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify({ name: 'manifest.json' })], { type: 'application/json' }));
            form.append('file', manifestBlob);
            
            await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: form
            });
            
            return fileId;
        } else {
            // Create new manifest
            const metadata = {
                name: 'manifest.json',
                parents: [rootFolderId],
                mimeType: 'application/json'
            };
            
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', manifestBlob);
            
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: form
            });
            
            const result = await response.json();
            return result.id;
        }
    } catch (error) {
        console.error('Error updating manifest:', error);
        throw error;
    }
};

// Upload index.html offline viewer to root folder
const uploadIndexHtml = async (htmlContent, rootFolderId) => {
    try {
        await ensureAuthenticated();
        
        // Check if index.html already exists
        const searchResponse = await gapi.client.drive.files.list({
            q: `name='index.html' and '${rootFolderId}' in parents and trashed=false`,
            fields: 'files(id)',
            pageSize: 1
        });
        
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        
        if (searchResponse.result.files && searchResponse.result.files.length > 0) {
            // Update existing index.html
            const fileId = searchResponse.result.files[0].id;
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify({ name: 'index.html' })], { type: 'application/json' }));
            form.append('file', htmlBlob);
            
            await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: form
            });
            
            return fileId;
        } else {
            // Create new index.html
            const metadata = {
                name: 'index.html',
                parents: [rootFolderId],
                mimeType: 'text/html'
            };
            
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', htmlBlob);
            
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: form
            });
            
            const result = await response.json();
            return result.id;
        }
    } catch (error) {
        console.error('Error uploading index.html:', error);
        throw error;
    }
};

// Export functions
window.GoogleAPI = {
    loadGapi,
    initGoogleAuth,
    signIn,
    signOut,
    getAccessToken,
    checkAuthStatus,
    handleTokenExpiration,
    getUserInfo,
    getAppDataFile,
    createAppDataFile,
    updateAppDataFile,
    createDriveFolder,
    getOrCreateFolder,
    updateDriveFolder,
    deleteDriveFolder,
    uploadFileToDrive,
    getOrCreateRootFolder,
    showDrivePicker,
    // Two-way sync functions
    syncNotebookToDrive,
    syncTabToDrive,
    syncPageToDrive,
    renameDriveItem,
    moveDriveItem,
    deleteDriveItem,
    getStartPageToken,
    getDriveChanges,
    listFolderContents,
    getFileContent,
    fullSyncToDrive,
    createDriveShortcut,
    updateDriveShortcut,
    // Portable backup functions
    sanitizeFileName,
    updateManifest,
    uploadIndexHtml
};
