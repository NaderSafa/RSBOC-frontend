import React, { useEffect, useState } from 'react'
import server from '../../../server'
import Match from './match.component'

const MatchesGroup = ({ groupId, round }) => {
  const [matches, setMatches] = useState()

  const getMatches = (groupId, round) => {
    const params = {}
    if (round) params.round = round
    if (groupId) params.group = groupId

    server
      .get('/match', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: params,
      })
      .then((res) => setMatches(res.data.matches))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getMatches(groupId, round)
  }, [])

  return (
    <div className='bg-white my-2 p-2 lg:p-4 border-round-lg'>
      {matches ? (
        <>
          <div className='flex'></div>
          <div className='text-xs font-medium'>{matches[0].event.name}</div>
          <div className='text-xs font-medium'>{`Group ${matches[0].group.name} Round ${round}`}</div>
          {matches.map((match, idx) => (
            <Match match={match} key={idx} />
          ))}
        </>
      ) : (
        <div className='flex align-items-center justify-content-center'>
          <i className='pi pi-spin pi-spinner p-5 text-red-400' />
        </div>
      )}
    </div>
  )
}

export default MatchesGroup
