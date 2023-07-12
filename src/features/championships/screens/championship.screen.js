import React from 'react'
import { useParams } from 'react-router-dom'

const ChampionshipScreen = () => {
  const { championshipId } = useParams()

  return <div>ChampionshipScreen with id = {championshipId}</div>
}

export default ChampionshipScreen
