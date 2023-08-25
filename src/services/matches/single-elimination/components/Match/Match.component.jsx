import React, { useEffect, useState } from 'react'
import './Match.styles.scss'
import Player from '../Player/Player.component'
import RegistrationName from '../../../../../features/events/components/registration-name.component'

const Match = ({ id, match }) => {
  const [scores, setScores] = useState([0, 0])

  useEffect(() => {
    match?.sets &&
      match?.sets?.map((set) =>
        set.registration1_score > set.registration2_score
          ? setScores((prevState) => [prevState[0] + 1, prevState[1]])
          : set.registration1_score < set.registration2_score
          ? setScores((prevState) => [prevState[0], prevState[1] + 1])
          : [0, 0]
      )
  }, [])

  return (
    <div className='reacket-match'>
      <div className='reacket-match-id'>{id}</div>
      <div className='reacket-players'>
        <Player
          name={
            match?.registration1 ? (
              <RegistrationName registration={match.registration1} />
            ) : (
              ''
            )
          }
          seed={1}
          id={match?.registration1?._id}
          sets={
            match?.sets?.length > 1
              ? match.sets.map((set) => set.registration1_score)
              : [0, 0]
          }
          played={match?.played}
          winner={scores[0] > scores[1]}
        />
        <Player
          name={
            match?.registration2 ? (
              <RegistrationName registration={match.registration2} />
            ) : (
              ''
            )
          }
          seed={2}
          id={match?.registration2?._id}
          sets={
            match?.sets?.length > 1
              ? match.sets.map((set) => set.registration2_score)
              : [0, 0]
          }
          played={match?.played}
          winner={scores[1] > scores[0]}
        />
      </div>
    </div>
  )
}

export default Match
