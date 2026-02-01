import { useState, useCallback } from 'react'
import { APP_VERSION } from './lib/constants'
import { generateId } from './lib/utils'
import {
  Plus, Trash2, GripVertical
} from './components/icons'
import { BlockComponent } from './components/blocks'

function App() {
  // Test blocks data - as specified in Section E plan
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'h1', content: 'Welcome to Block Components' },
    { id: '2', type: 'text', content: 'This is a <b>text block</b> with some <i>formatting</i>. Type / for commands.' },
    { id: '3', type: 'h2', content: 'List Examples' },
    { id: '4', type: 'ul', content: '<li>Bullet item 1</li><li>Bullet item 2</li><li>Bullet item 3</li>' },
    { id: '5', type: 'ol', content: '<li>Numbered item 1</li><li>Numbered item 2</li><li>Numbered item 3</li>' },
    { id: '6', type: 'todo', content: '<li data-checked="false">Unchecked task</li><li data-checked="true">Completed task</li><li data-checked="false">Another task</li>' },
    { id: '7', type: 'h3', content: 'Media & Special Blocks' },
    { id: '8', type: 'divider', content: '' },
    { id: '9', type: 'image', content: '', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    { id: '10', type: 'link', content: 'Visit GitHub', url: 'https://github.com' },
    { id: '11', type: 'h4', content: 'Heading 4 Example' },
    { id: '12', type: 'text', content: 'Try editing any of these blocks. Use the drag handle to reorder.' },
  ])

  const [autoFocusId, setAutoFocusId] = useState(null)
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [lastAction, setLastAction] = useState('')

  // Block update handler
  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    ))
    setLastAction(`Updated block ${blockId}: ${JSON.stringify(updates).substring(0, 50)}...`)
  }, [])

  // Block delete handler
  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === blockId)
      const prevBlockId = index > 0 ? prev[index - 1].id : null
      // Focus the previous block after deletion
      if (prevBlockId) {
        setTimeout(() => setAutoFocusId(prevBlockId), 0)
      }
      return prev.filter(b => b.id !== blockId)
    })
    setLastAction(`Deleted block ${blockId}`)
  }, [])

  // Insert block after handler
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

  // Request focus handler
  const handleRequestFocus = useCallback((blockId) => {
    setAutoFocusId(blockId)
  }, [])

  // Handle click handler (for selection)
  const handleHandleClick = useCallback((e, blockId) => {
    e.stopPropagation()
    setSelectedBlockId(prev => prev === blockId ? null : blockId)
    setLastAction(`Selected block ${blockId}`)
  }, [])

  // Drag handlers (simplified for demo)
  const handleDragStart = useCallback((e, block, rowId, colId) => {
    e.dataTransfer.setData('text/plain', block.id)
    setLastAction(`Started dragging block ${block.id}`)
  }, [])

  const handleDragOver = useCallback((e, blockId, path) => {
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

  // Add new block at end
  const handleAddBlock = useCallback(() => {
    const newId = generateId()
    setBlocks(prev => [...prev, { id: newId, type: 'text', content: '' }])
    setAutoFocusId(newId)
    setLastAction('Added new block')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Strata v{APP_VERSION} - Migration in Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-1">Section E Complete: Block Components extracted</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            ContentBlock | ListBlock | BlockComponent
          </p>
        </div>

        {/* Block Editor Area */}
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

          {/* Add Block Button */}
          <button
            onClick={handleAddBlock}
            className="mt-4 flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Plus size={16} />
            <span className="text-sm">Add a block</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Test Instructions:</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>- Type in any text block, use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/</code> for slash commands</li>
            <li>- Press <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Enter</code> to create new blocks</li>
            <li>- Use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Ctrl+B/I/U</code> for bold/italic/underline</li>
            <li>- Click the drag handle (left dots) to select a block</li>
            <li>- Drag blocks to reorder them</li>
            <li>- In lists, press <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Tab</code> to indent/toggle</li>
            <li>- In todo lists, click checkbox or press Tab to toggle</li>
            <li>- Press <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">Backspace</code> in empty block to delete</li>
          </ul>
        </div>

        {/* Last Action Display */}
        {lastAction && (
          <div className="bg-gray-800 text-green-400 rounded-lg p-3 font-mono text-sm overflow-x-auto">
            {lastAction}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
