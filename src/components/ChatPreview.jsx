import { useEffect, useMemo, useRef, useState } from 'react'

const START_NODE_ID = '1'

function ChatPreview({ nodes }) {
  const listRef = useRef(null)
  const nodesById = useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  )
  const [currentNodeId, setCurrentNodeId] = useState(START_NODE_ID)
  const [messages, setMessages] = useState(() => {
    const startNode = nodesById.get(START_NODE_ID)
    if (!startNode) {
      return []
    }

    return [{ sender: 'bot', text: startNode.question }]
  })

  const currentNode = nodesById.get(currentNodeId)
  const isLeaf = !currentNode || currentNode.options.length === 0

  useEffect(() => {
    const listElement = listRef.current
    if (!listElement) {
      return
    }

    listElement.scrollTop = listElement.scrollHeight
  }, [messages])

  const handleOptionClick = (option) => {
    const nextNode = nodesById.get(option.nextNodeId)

    setMessages((previous) => {
      const nextMessages = [...previous, { sender: 'user', text: option.label }]

      if (nextNode) {
        nextMessages.push({ sender: 'bot', text: nextNode.question })
      }

      return nextMessages
    })

    setCurrentNodeId(nextNode ? nextNode.id : '')
  }

  const handleRestart = () => {
    const startNode = nodesById.get(START_NODE_ID)
    if (!startNode) {
      setMessages([])
      setCurrentNodeId('')
      return
    }

    setMessages([{ sender: 'bot', text: startNode.question }])
    setCurrentNodeId(START_NODE_ID)
  }

  return (
    <section className="chat-preview" aria-label="Chat preview">
      <div className="chat-messages" ref={listRef}>
        {messages.map((message, index) => (
          <div
            key={`${message.sender}-${index}`}
            className={`message-row ${message.sender === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div
              className={`message-bubble ${message.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLeaf && (
          <div className="message-row bot-row">
            <div className="message-bubble bot-bubble">
              This is the end of the conversation.
            </div>
          </div>
        )}
      </div>

      <div className="chat-actions">
        {isLeaf ? (
          <button type="button" className="choice-button restart-button" onClick={handleRestart}>
            Restart
          </button>
        ) : (
          currentNode.options.map((option) => (
            <button
              type="button"
              key={`${currentNode.id}-${option.label}`}
              className="choice-button"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </section>
  )
}

export default ChatPreview
