function NodeCard({ node, mode, nodeRef, selected, onSelect }) {
  const x = Number(node.position?.x ?? 0)
  const y = Number(node.position?.y ?? 0)
  const cardStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  }

  return (
    <article
      className={`node-card ${selected ? 'selected-node' : ''}`}
      style={cardStyle}
      ref={nodeRef}
      onClick={() => onSelect(node)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(node)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className="node-id">Node {node.id}</span>
      <h2 className="node-question">{node.question}</h2>
      <ul className="option-list">
        {node.options.map((option) => (
          <li key={`${node.id}-${option.label}`} className="option-item">
            <span>{option.label}</span>
            {mode === 'editor' && (
              <span className="next-node">Next: {option.nextNodeId}</span>
            )}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default NodeCard
