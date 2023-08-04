import React, { useEffect, useState } from 'react'
import Match from './match.component'

const MatchesGroup = ({ groupId, round, allMatches, loading }) => {
  const [localMatches, setLocalMatches] = useState()
  useEffect(() => {
    if (!loading && allMatches) {
      setLocalMatches(
        allMatches.filter(
          (match) => match.round === round && match.group._id === groupId
        )
      )
    }
  }, [loading, allMatches, setLocalMatches, groupId, round])
  return (
    <div className='bg-white my-2 p-2 lg:p-4 border-round-lg'>
      {!loading && localMatches ? (
        <>
          <div className='flex'></div>
          {/*
           */}
          <div className='text-xs font-medium'>
            {localMatches[0].event.name}
          </div>
          <div className='text-xs font-medium'>{`Group ${localMatches[0].group.name} Round ${round}`}</div>
          {localMatches.map((match, idx) => (
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
