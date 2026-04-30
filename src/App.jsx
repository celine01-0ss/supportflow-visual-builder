import { useMemo, useState } from 'react'
import Canvas from './components/Canvas.jsx'
import ChatPreview from './components/ChatPreview.jsx'
import EditPanel from './components/EditPanel.jsx'
import initialNodes from './data/nodes.json'
import './App.css'

function App() {
  const [mode, setMode] = useState('editor')
  const [nodes, setNodes] = useState(initialNodes)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [draftQuestion, setDraftQuestion] = useState('')
  const isEditorMode = mode === 'editor'
  const modeLabel = isEditorMode ? 'Editor Mode' : 'Preview Mode'
  const sortedNodes = useMemo(
    () => [...nodes].sort((left, right) => Number(left.id) - Number(right.id)),
    [nodes],
  )
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const handleSelectNode = (node) => {
    setSelectedNodeId(node.id)
    setDraftQuestion(node.question)
  }

  const handleUpdateNode = (nodeId, newQuestion) => {
    const nodeToUpdate = nodes.find((node) => node.id === nodeId)
    if (!nodeToUpdate) {
      return
    }

    const trimmedQuestion = newQuestion.trim()
    const nextQuestion = trimmedQuestion || nodeToUpdate.question
    if (nextQuestion === nodeToUpdate.question) {
      handleClosePanel()
      return
    }

    setUndoStack((previousStack) => [...previousStack, nodes])
    setRedoStack([])

    setNodes((previousNodes) =>
      previousNodes.map((node) =>
        node.id === nodeId ? { ...node, question: nextQuestion } : node,
      ),
    )
    handleClosePanel()
  }

  const handleUndo = () => {
    if (undoStack.length === 0) {
      return
    }

    const previousState = undoStack[undoStack.length - 1]
    setUndoStack((previousStack) => previousStack.slice(0, -1))
    setRedoStack((previousStack) => [...previousStack, nodes])
    setNodes(previousState)

    if (selectedNodeId) {
      const restoredNode = previousState.find((node) => node.id === selectedNodeId)
      setDraftQuestion(restoredNode?.question ?? '')
    }
  }

  const handleRedo = () => {
    if (redoStack.length === 0) {
      return
    }

    const nextState = redoStack[redoStack.length - 1]
    setRedoStack((previousStack) => previousStack.slice(0, -1))
    setUndoStack((previousStack) => [...previousStack, nodes])
    setNodes(nextState)

    if (selectedNodeId) {
      const restoredNode = nextState.find((node) => node.id === selectedNodeId)
      setDraftQuestion(restoredNode?.question ?? '')
    }
  }

  const handleClosePanel = () => {
    setSelectedNodeId(null)
    setDraftQuestion('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Support Flow Builder</h1>
          <p className="subtitle">{modeLabel}</p>
        </div>
        <div className="topbar-actions">
          {isEditorMode && (
            <>
              <button
                type="button"
                className="history-button"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
              >
                Undo
              </button>
              <button
                type="button"
                className="history-button"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              >
                Redo
              </button>
            </>
          )}
          <button
            type="button"
            className="mode-toggle"
            onClick={() =>
              setMode((currentMode) =>
                currentMode === 'editor' ? 'preview' : 'editor',
              )
            }
          >
            Switch to {isEditorMode ? 'Preview' : 'Editor'}
          </button>
        </div>
      </header>
      {isEditorMode ? (
        <>
          <Canvas
            mode={mode}
            nodes={sortedNodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
          />
          {selectedNode && (
            <EditPanel
              nodeId={selectedNode.id}
              question={draftQuestion}
              onQuestionChange={setDraftQuestion}
              onUpdateNode={handleUpdateNode}
              onClose={handleClosePanel}
            />
          )}
        </>
      ) : (
        <ChatPreview nodes={sortedNodes} />
      )}
    </main>
  )
}

export default App
