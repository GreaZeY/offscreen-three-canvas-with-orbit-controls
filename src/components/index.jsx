import React, { useState } from 'react'
import OffscreenCanvas from './offscreen-canvas'

const worker = new Worker(new URL('./worker/index.js', import.meta.url))

const App = () => {
  const [position, setPosition] = useState([0, 0, 0]);

  const handleClick = () => {
  }

  return (
    <OffscreenCanvas
      worker={worker}
      position={position}
      onClick={handleClick}
    />
  )
}

export default App
