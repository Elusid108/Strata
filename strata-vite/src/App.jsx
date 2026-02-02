import { useState, useCallback, useEffect } from 'react'
import { APP_VERSION, DEFAULT_SCHEMA, DEFAULT_ROWS } from './lib/constants'
import { generateId, generateUUID } from './lib/utils'
import {
  Plus, Trash2, GripVertical, GoogleG
} from './components/icons'
import { BlockComponent } from './components/blocks'
import { 
  CanvasPageComponent, 
  TablePage, 
  MermaidPageComponent, 
  MapBlock 
} from './components/pages'
import { checkAuthStatus, signIn, signOut, getOrCreateRootFolder } from './lib/google-api'

function App() {
  // Current view tab
  const [activeTab, setActiveTab] = useState('blocks')

  // ========== GOOGLE AUTH STATE ==========
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [rootFolderId, setRootFolderId] = useState(null)

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true)
        const userInfo = await checkAuthStatus()
        if (userInfo) {
          setUser(userInfo)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthError(error.message)
      } finally {
        setAuthLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleSignIn = async () => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      const userInfo = await signIn()
      setUser(userInfo)
      setLastAction(`Signed in as ${userInfo.email}`)
    } catch (error) {
      console.error('Sign in failed:', error)
      setAuthError(error.message)
      setLastAction(`Sign in failed: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    setUser(null)
    setRootFolderId(null)
    setLastAction('Signed out')
  }

  const handleGetRootFolder = async () => {
    try {
      setAuthLoading(true)
      const folderId = await getOrCreateRootFolder()
      setRootFolderId(folderId)
      setLastAction(`Root folder ID: ${folderId}`)
    } catch (error) {
      console.error('Get root folder failed:', error)
      setAuthError(error.message)
      setLastAction(`Get root folder failed: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  // ========== BLOCKS TEST DATA ==========
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'h1', content: 'Welcome to Block Components' },
    { id: '2', type: 'text', content: 'This is a <b>text block</b> with some <i>formatting</i>. Type / for commands.' },
    { id: '3', type: 'h2', content: 'List Examples' },
    { id: '4', type: 'ul', content: '<li>Bullet item 1</li><li>Bullet item 2</li><li>Bullet item 3</li>' },
    { id: '5', type: 'ol', content: '<li>Numbered item 1</li><li>Numbered item 2</li><li>Numbered item 3</li>' },
    { id: '6', type: 'todo', content: '<li data-checked="false">Unchecked task</li><li data-checked="true">Completed task</li><li data-checked="false">Another task</li>' },
  ])
  const [autoFocusId, setAutoFocusId] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [lastAction, setLastAction] = useState('')

  // ========== CANVAS PAGE TEST DATA ==========
  const [canvasPage, setCanvasPage] = useState({
    id: 'canvas-1',
    name: 'Canvas Demo',
    icon: '🎨',
    type: 'canvas',
    canvasData: {
      containers: [
        { id: 'c1', type: 'text', x: 100, y: 200, content: '<div>Welcome to Canvas!</div>', width: 300 },
        { id: 'c2', type: 'text', x: 450, y: 200, content: '<div>Click anywhere to add text</div>', width: 250 },
      ],
      paths: [],
      pageTitle: 'Canvas Demo',
      transform: { x: 32, y: 32, scale: 1 }
    }
  })

  // ========== TABLE PAGE TEST DATA ==========
  const [tablePage, setTablePage] = useState({
    id: 'table-1',
    name: 'Database Demo',
    icon: '📊',
    type: 'database',
    content: {
      schema: DEFAULT_SCHEMA,
      rows: [
        { id: 'r1', c1: 'Project Alpha', c2: 'In Progress', c3: 5, c4: true },
        { id: 'r2', c1: 'Project Beta', c2: 'Idea', c3: 3, c4: false },
        { id: 'r3', c1: 'Project Gamma', c2: 'Done', c3: 10, c4: true },
      ]
    }
  })

  // ========== CODE PAGE TEST DATA ==========
  const [mermaidPage, setMermaidPage] = useState({
    id: 'mermaid-1',
    name: 'Diagram Demo',
    icon: '</>',
    type: 'mermaid',
    codeType: 'mermaid',
    code: `graph TD
A[Start] --> B{Is it working?}
B -->|Yes| C[Great!]
B -->|No| D[Debug]
D --> B
C --> E[Deploy]`,
    mermaidCode: `graph TD
A[Start] --> B{Is it working?}
B -->|Yes| C[Great!]
B -->|No| D[Debug]
D --> B
C --> E[Deploy]`
  })

  // ========== MAP TEST DATA ==========
  const [mapData, setMapData] = useState({
    center: [40.7128, -74.0060],
    zoom: 13,
    markers: [
      { lat: 40.7128, lng: -74.0060, label: 'New York City' }
    ],
    locked: false
  })

  // ========== BLOCK HANDLERS ==========
  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    ))
    setLastAction(`Updated block ${blockId}`)
  }, [])

  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === blockId)
      const prevBlockId = index > 0 ? prev[index - 1].id : null
      if (prevBlockId) {
        setTimeout(() => setAutoFocusId(prevBlockId), 0)
      }
      return prev.filter(b => b.id !== blockId)
    })
    setLastAction(`Deleted block ${blockId}`)
  }, [])

  const handleInsertAfter = useCallback((blockId, type = 'text') => {
    const newId = generateId()
    const newBlock = { 
      id: newId, 
      type, 
      content: type === 'ul' || type === 'ol' ? '<li></li>' : (type === 'todo' ? '<li data-checked="false"></li>' : '') 
    }
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === blockId)
      if (index === -1) return [...prev, newBlock]
      const newBlocks = [...prev]
      newBlocks.splice(index + 1, 0, newBlock)
      return newBlocks
    })
    setAutoFocusId(newId)
    setLastAction(`Inserted ${type} block after ${blockId}`)
  }, [])

  const handleRequestFocus = useCallback((blockId) => {
    setAutoFocusId(blockId)
  }, [])

  const handleHandleClick = useCallback((e, blockId) => {
    e.stopPropagation()
    setSelectedBlockId(prev => prev === blockId ? null : blockId)
    setLastAction(`Selected block ${blockId}`)
  }, [])

  const handleDragStart = useCallback((e, block) => {
    e.dataTransfer.setData('text/plain', block.id)
    setLastAction(`Started dragging block ${block.id}`)
  }, [])

  const handleDragOver = useCallback((e, blockId) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const position = y < rect.height / 2 ? 'top' : 'bottom'
    setDropTarget({ blockId, position })
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    if (!dropTarget || draggedId === dropTarget.blockId) {
      setDropTarget(null)
      return
    }
    
    setBlocks(prev => {
      const draggedIndex = prev.findIndex(b => b.id === draggedId)
      const targetIndex = prev.findIndex(b => b.id === dropTarget.blockId)
      if (draggedIndex === -1 || targetIndex === -1) return prev
      
      const newBlocks = [...prev]
      const [dragged] = newBlocks.splice(draggedIndex, 1)
      const insertIndex = dropTarget.position === 'top' 
        ? (draggedIndex < targetIndex ? targetIndex - 1 : targetIndex)
        : (draggedIndex < targetIndex ? targetIndex : targetIndex + 1)
      newBlocks.splice(insertIndex, 0, dragged)
      return newBlocks
    })
    
    setLastAction(`Moved block ${draggedId} ${dropTarget.position} ${dropTarget.blockId}`)
    setDropTarget(null)
  }, [dropTarget])

  const handleDragLeave = useCallback(() => {
    setDropTarget(null)
  }, [])

  const handleAddBlock = useCallback(() => {
    const newId = generateId()
    setBlocks(prev => [...prev, { id: newId, type: 'text', content: '' }])
    setAutoFocusId(newId)
    setLastAction('Added new block')
  }, [])

  // ========== PAGE HANDLERS ==========
  const handleCanvasUpdate = useCallback((updates) => {
    setCanvasPage(prev => ({ ...prev, ...updates }))
    setLastAction('Canvas page updated')
  }, [])

  const handleTableUpdate = useCallback((updatedPage) => {
    setTablePage(updatedPage)
    setLastAction('Table page updated')
  }, [])

  const handleMermaidUpdate = useCallback((updates) => {
    setMermaidPage(prev => ({ ...prev, ...updates }))
    setLastAction('Mermaid page updated')
  }, [])

  const handleMapUpdate = useCallback((newData) => {
    setMapData(newData)
    setLastAction('Map data updated')
  }, [])

  // Tab definitions
  const tabs = [
    { id: 'blocks', label: 'Blocks', icon: '📝' },
    { id: 'canvas', label: 'Canvas', icon: '🎨' },
    { id: 'table', label: 'Table', icon: '📊' },
    { id: 'mermaid', label: 'Code', icon: '</>' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'auth', label: 'Google API', icon: '🔐' },
  ]

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center">
          Strata v{APP_VERSION} - Migration in Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm mt-1">
          Section G Complete: Google API Integration
        </p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'blocks' && (
          <div className="h-full overflow-auto p-4">
            <div className="max-w-3xl mx-auto">
              <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
                onClick={() => setSelectedBlockId(null)}
                onDragLeave={handleDragLeave}
              >
                <div className="space-y-1">
                  {blocks.map((block, index) => (
                    <BlockComponent
                      key={block.id}
                      block={block}
                      rowId="row1"
                      colId="col1"
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      onInsertAfter={handleInsertAfter}
                      autoFocusId={autoFocusId}
                      onRequestFocus={handleRequestFocus}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      dropTarget={dropTarget}
                      isSelected={selectedBlockId === block.id}
                      onHandleClick={handleHandleClick}
                      onFocus={() => setAutoFocusId(null)}
                      isLastBlock={index === blocks.length - 1}
                      onMapConfig={(id, pos) => setLastAction(`Map config for ${id}`)}
                    />
                  ))}
                </div>
                <button
                  onClick={handleAddBlock}
                  className="mt-4 flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Plus size={16} />
                  <span className="text-sm">Add a block</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="h-full">
            <CanvasPageComponent
              page={canvasPage}
              onUpdate={handleCanvasUpdate}
              saveToHistory={() => {}}
              showNotification={(msg) => setLastAction(msg)}
            />
          </div>
        )}

        {activeTab === 'table' && (
          <div className="h-full">
            <TablePage
              page={tablePage}
              onUpdate={handleTableUpdate}
            />
          </div>
        )}

        {activeTab === 'mermaid' && (
          <div className="h-full">
            <MermaidPageComponent
              page={mermaidPage}
              onUpdate={handleMermaidUpdate}
              saveToHistory={() => {}}
              showNotification={(msg, type) => setLastAction(`${type}: ${msg}`)}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-full p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Interactive Map</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click on the map to add markers. Drag to pan, scroll to zoom.</p>
                </div>
                <MapBlock
                  data={mapData}
                  onUpdate={handleMapUpdate}
                  readOnly={false}
                  height={500}
                  disableScrollWheel={false}
                  locked={mapData.locked}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="h-full p-4 overflow-auto">
            <div className="max-w-xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Google API Integration Test
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Section G: Test the Google Drive authentication and API integration.
                </p>

                {authError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {authError}
                  </div>
                )}

                {authLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      {user.picture && (
                        <img 
                          src={user.picture} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleGetRootFolder}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Get Root Folder
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>

                    {rootFolderId && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Root Folder ID:</span><br />
                          {rootFolderId}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Sign in with Google to test the Drive API integration.
                    </p>
                    <button
                      onClick={handleSignIn}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <GoogleG size={20} />
                      <span className="font-medium text-gray-700 dark:text-white">Sign in with Google</span>
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                      Note: You need to configure .env.local with your Google API credentials.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {lastAction && (
        <div className="bg-gray-800 text-green-400 px-4 py-2 text-sm font-mono">
          {lastAction}
        </div>
      )}
    </div>
  )
}

export default App
