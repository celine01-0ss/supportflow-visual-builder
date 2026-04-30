function Connector({ paths }) {
  return (
    <svg
      className="connector-layer"
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      {paths.map((path) => (
        <path
          key={path.id}
          d={path.d}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export default Connector
