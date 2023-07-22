import React from 'react'
import { useParams } from 'react-router-dom'

const ChampionshipScreen = () => {
  document.title = 'Championship | Speedball Hub'

  const { championshipId } = useParams()

  return <div>ChampionshipScreen with id = {championshipId}</div>
}

export default ChampionshipScreen
