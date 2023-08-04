import React, { useEffect, useState } from 'react'
import server from '../../../server'
import MatchesGroup from './matches-group.component'
import { createNumberSequence } from '../../../components/shared/utils'

const Matches = ({ groups }) => {
  const [matches, setMatches] = useState()
  const [loading, setLoading] = useState(true)

  const getMatches = () => {
    setLoading(true)
    server
      .get('/match', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => {
        setMatches(res.data.matches)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    getMatches()
  }, [])

  return (
    <>
      {groups && !loading ? (
        groups.map((group) => {
          let rounds = group.registrations.length - 1
          if (rounds % 2 === 0) {
            rounds += 1
          }

          const roundsArray = createNumberSequence(rounds)

          return (
            <div key={group._id}>
              {roundsArray.map((round) => (
                <MatchesGroup
                  groupId={group._id}
                  key={round}
                  round={round}
                  allMatches={matches}
                  loading={loading}
                />
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
