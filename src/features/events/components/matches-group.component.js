import React, { useEffect, useState } from 'react'
import Match from './match.component'

const MatchesGroup = ({ groupId, round, allMatches, loading, event }) => {
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
    <div className='bg-white my-2 p-2 lg:p-4 border-round-lg  max-w-30rem'>
      {!loading && localMatches ? (
        <>
          <div className='flex gap-2'>
            <div
              className={`bg-cover bg-center flex align-items-center justify-content-center w-2rem h-2rem border-1 border-red-100 border-circle`}
              shape='circle'
              style={{
                backgroundImage: `url(${event.tournament?.championship?.logo_url})`,
              }}
            />
            <div>
              <p className='text-xs font-medium m-0 p-0'>{event.name}</p>
              <p className='text-xs font-medium m-0 p-0'>{`Group ${localMatches[0].group.name} Round ${round}`}</p>
            </div>
          </div>
          {/*
           */}
          {localMatches.map((match, idx) => (
            <Match match={match} key={idx} event={event} />
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
