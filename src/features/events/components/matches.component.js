import React, { useEffect, useState } from 'react'
import server from '../../../server'
import Match from './match.component'
import MatchesGroup from './matches-group.component'
import { createNumberSequence } from '../../../components/shared/utils'

const Matches = ({ groups }) => {
  return (
    <>
      {groups ? (
        groups.map((group) => {
          let rounds = group.registrations.length - 1
          if (rounds % 2 === 0) {
            rounds += 1
          }

          const roundsArray = createNumberSequence(rounds)

          return (
            <div key={group._id}>
              {roundsArray.map((round) => (
                <MatchesGroup groupId={group._id} key={round} round={round} />
              ))}
            </div>
          )
        })
      ) : (
        <div className='flex align-items-center justify-content-center'>
          <i className='pi pi-spin pi-spinner p-5 text-red-400' />
        </div>
      )}
    </>
  )
}

export default Matches
