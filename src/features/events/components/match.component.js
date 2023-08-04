import React from 'react'
import {
  capitalizeWords,
  extractNamesFromFullName,
  removeExtraSpaces,
} from '../../../components/shared/utils'

const Match = ({ match }) => {
  return (
    <div className='flex justify-content-between mt-3'>
      <div className=' my-1'>
        <div className='flex align-items-center'>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${match.registration1.players[0].club.image_url})`,
            }}
          />
          <p className='m-0 p-0 text-sm'>{`${extractNamesFromFullName(
            capitalizeWords(
              removeExtraSpaces(match.registration1.players[0].full_name)
            )
          )} - `}</p>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mx-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${match.registration1.players[1].club.image_url})`,
            }}
          />

          <p className='m-0 p-0 text-sm'>{`${extractNamesFromFullName(
            capitalizeWords(
              removeExtraSpaces(match.registration1.players[1].full_name)
            )
          )}`}</p>
        </div>
        <div className='flex align-items-center'>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${match.registration2.players[0].club.image_url})`,
            }}
          />
          <p className='m-0 p-0 text-sm'>{`${extractNamesFromFullName(
            capitalizeWords(
              removeExtraSpaces(match.registration2.players[0].full_name)
            )
          )} - `}</p>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mx-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${match.registration2.players[1].club.image_url})`,
            }}
          />

          <p className='m-0 p-0 text-sm'>{`${extractNamesFromFullName(
            capitalizeWords(
              removeExtraSpaces(match.registration2.players[1].full_name)
            )
          )}`}</p>
        </div>
      </div>
    </div>
  )
}

export default Match
