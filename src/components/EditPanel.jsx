function EditPanel({ nodeId, question, onQuestionChange, onUpdateNode, onClose }) {
  return (
    <aside className="edit-panel" aria-label="Edit node panel">
      <h2 className="edit-panel-title">Edit Node {nodeId}</h2>
      <label className="edit-panel-label" htmlFor="node-question-input">
        Question
      </label>
      <input
        id="node-question-input"
        className="edit-panel-input"
        type="text"
        value={question}
        onChange={(event) => onQuestionChange(event.target.value)}
      />
      <div className="edit-panel-actions">
        <button
          type="button"
          className="panel-save-button"
          onClick={() => onUpdateNode(nodeId, question)}
        >
          Save
        </button>
        <button type="button" className="panel-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </aside>
  )
}

export default EditPanel
