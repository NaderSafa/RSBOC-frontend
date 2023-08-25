import React from 'react'
import {
  normalizeName,
  superNormalizeName,
} from '../../../components/shared/utils'

const RegistrationName = ({ registration, className }) => {
  return (
    <div className={`flex align-items-center ${className}`}>
      {registration.players.map((player) => (
        <div key={player._id} className='flex align-items-center'>
          {player?.club?.image_url && (
            <div
              className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
              shape='circle'
              style={{
                backgroundImage: `url(${player.club.image_url})`,
              }}
            />
          )}
          <p className='m-0 p-0 text-sm mr-2'>{`${
            registration.players.length === 1
              ? normalizeName(player.full_name)
              : superNormalizeName(player.full_name)
          }`}</p>
        </div>
      ))}
    </div>
  )
}

export default RegistrationName
