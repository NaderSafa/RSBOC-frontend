import React, { useContext } from 'react'
import './Player.styles.scss'
import HighlightContext from '../../context/HighlightContext'

const Player = ({ id, name, seed, winner, sets }) => {
  const { highlightedPlayer, setHighlightedPlayer } =
    useContext(HighlightContext)
  return (
    <div
      onMouseEnter={() => setHighlightedPlayer(id)}
      onMouseLeave={() => setHighlightedPlayer(null)}
      title={winner ? '(W)' : '(L)'}
      className={`reacket-player 
        ${winner ? 'reacket-winner' : ''} 
        ${highlightedPlayer === id ? 'reacket-highlighted' : ''}`}
    >
      <div title='Seed' className='reacket-player-seed'>
        {seed}
      </div>
      <div className='reacket-player-name'>{name}</div>

      {sets &&
        sets.map((set, idx) => (
          <div
            key={idx}
            title='Score'
            className={`text-sm font-light p-0 mx-1 text-center w-1rem reacket-player-score
            }`}
          >
            {set}
          </div>
        ))}
    </div>
  )
}

export default Player
