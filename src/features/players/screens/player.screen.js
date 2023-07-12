import React from 'react'
import { useParams } from 'react-router-dom'

const PlayerScreen = () => {
  const { playerId } = useParams()

  return <div>PlayerScreen with player id = {playerId}</div>
}

export default PlayerScreen
