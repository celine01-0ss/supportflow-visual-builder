import { useLayoutEffect, useRef, useState } from 'react'
import Connector from './Connector.jsx'
import NodeCard from './NodeCard.jsx'

function Canvas({ mode, nodes, selectedNodeId, onSelectNode }) {
  const [paths, setPaths] = useState([])
  const surfaceRef = useRef(null)
  const nodeRefs = useRef({})

  const canvasStyle = {
    position: 'relative',
  }

  const setNodeRef = (nodeId) => (element) => {
    nodeRefs.current[nodeId] = element
  }

  useLayoutEffect(() => {
    const surfaceElement = surfaceRef.current
    if (!surfaceElement) {
      return undefined
    }

    const updatePaths = () => {
      const surfaceRect = surfaceElement.getBoundingClientRect()
      const nextPaths = []

      nodes.forEach((node) => {
        const parentElement = nodeRefs.current[node.id]
        if (!parentElement) {
          return
        }

        const parentRect = parentElement.getBoundingClientRect()
        const startX = parentRect.right - surfaceRect.left
        const startY = parentRect.top + parentRect.height / 2 - surfaceRect.top

        node.options.forEach((option) => {
          const childElement = nodeRefs.current[option.nextNodeId]
          if (!childElement) {
            return
          }

          const childRect = childElement.getBoundingClientRect()
          const endX = childRect.left - surfaceRect.left
          const endY = childRect.top + childRect.height / 2 - surfaceRect.top
          const controlOffset = Math.max(60, Math.abs(endX - startX) / 2)
          const d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`

          nextPaths.push({
            id: `${node.id}-${option.nextNodeId}-${option.label}`,
            d,
          })
        })
      })

      setPaths(nextPaths)
    }

    updatePaths()

    const resizeObserver = new ResizeObserver(updatePaths)
    resizeObserver.observe(surfaceElement)

    Object.values(nodeRefs.current).forEach((element) => {
      if (element) {
        resizeObserver.observe(element)
      }
    })

    window.addEventListener('resize', updatePaths)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePaths)
    }
  }, [nodes, mode])

  return (
    <section className="canvas-wrapper" aria-label={`${mode} canvas`}>
      <div className="canvas-surface" style={canvasStyle} ref={surfaceRef}>
        <Connector paths={paths} />
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            mode={mode}
            nodeRef={setNodeRef(node.id)}
            selected={node.id === selectedNodeId}
            onSelect={onSelectNode}
          />
        ))}
      </div>
    </section>
  )
}

export default Canvas
