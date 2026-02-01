import { useState, useCallback } from 'react'
import { APP_VERSION, DEFAULT_SCHEMA, DEFAULT_ROWS } from './lib/constants'
import { generateId, generateUUID } from './lib/utils'
import {
  Plus, Trash2, GripVertical
} from './components/icons'
import { BlockComponent } from './components/blocks'
import { 
  CanvasPageComponent, 
  TablePage, 
  MermaidPageComponent, 
  MapBlock 
} from './components/pages'

function App() {
  // Current view tab
  const [activeTab, setActiveTab] = useState('blocks')

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

  // ========== MERMAID PAGE TEST DATA ==========
  const [mermaidPage, setMermaidPage] = useState({
    id: 'mermaid-1',
    name: 'Diagram Demo',
    icon: '📐',
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
    { id: 'mermaid', label: 'Mermaid', icon: '📐' },
    { id: 'map', label: 'Map', icon: '🗺️' },
  ]

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center">
          Strata v{APP_VERSION} - Migration in Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm mt-1">
          Section F Complete: Page Type Components extracted
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
