// Google API Helper Module for Strata
// Handles authentication, Drive API operations, and Picker integration

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient = null;
let accessToken = null;
let userEmail = null;

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

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:initTokenClient',message:'Initializing token client',data:{requestedScopes:GOOGLE_CONFIG.SCOPES,scopeString:GOOGLE_CONFIG.SCOPES.join(' ')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            scope: GOOGLE_CONFIG.SCOPES.join(' '),
            callback: async (response) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:callback:entry',message:'OAuth callback fired',data:{hasError:!!response.error,hasToken:!!response.access_token,tokenLength:response.access_token?.length||0,scopes:response.scope},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
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
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:callback:tokenSet',message:'Token assigned to accessToken',data:{tokenPrefix:accessToken?.substring(0,10),tokenLength:accessToken?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                gapi.client.setToken({ access_token: accessToken });
                
                // Resolve the pending sign-in promise
                if (signInResolver) {
                    try {
                        const userInfo = await getUserInfo();
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
};

// Get current access token
const getAccessToken = () => {
    return accessToken;
};

// Check if user is authenticated
const checkAuthStatus = async () => {
    try {
        if (!gapiLoaded) {
            await loadGapi();
        }
        if (!gisLoaded) {
            await initGoogleAuth();
        }

        // Try to get user info to verify token
        const token = gapi.client.getToken();
        if (token && token.access_token) {
            accessToken = token.access_token;
            try {
                await getUserInfo();
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
};

// Get user info - using fetch directly to avoid API key being added by gapi.client
const getUserInfo = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:getUserInfo:entry',message:'getUserInfo called',data:{hasAccessToken:!!accessToken,tokenPrefix:accessToken?.substring(0,10),tokenLength:accessToken?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
        // Use fetch directly with Authorization header (no API key)
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:getUserInfo:error',message:'fetch failed',data:{status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            throw new Error(`Failed to get user info: ${response.status}`);
        }
        
        const result = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:getUserInfo:success',message:'user info retrieved',data:{hasEmail:!!result.email,hasName:!!result.name},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        userEmail = result.email;
        return result;
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/b3d72f9b-db75-4eaa-8a60-90b1276ac978',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'google-api.js:getUserInfo:catch',message:'error caught',data:{errorMsg:error.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
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

// Get or create root folder "Strata Notebooks"
const getOrCreateRootFolder = async () => {
    try {
        await ensureAuthenticated();

        // Search for existing folder
        const response = await gapi.client.drive.files.list({
            q: "name='Strata Notebooks' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'files(id, name)',
            pageSize: 1
        });

        if (response.result.files && response.result.files.length > 0) {
            return response.result.files[0].id;
        }

        // Create if doesn't exist
        const folder = await createDriveFolder('Strata Notebooks');
        return folder.id;
    } catch (error) {
        console.error('Error getting/creating root folder:', error);
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
    updateDriveFolder,
    deleteDriveFolder,
    uploadFileToDrive,
    getOrCreateRootFolder,
    showDrivePicker
};
