import { Tooltip } from 'primereact/tooltip'
import React from 'react'

function Warning({ msg, color, email }) {
  return (
    <div
      className={`${
        color ? color : 'bg-yellow-400'
      } p-1 m-0 flex justify-content-center align-items-center text-xs`}
    >
      <Tooltip target='.custom-target-icon' />
      <i
        className='custom-target-icon pi pi-info-circle text-black-alpha-90 mr-2 p-0 text-xs'
        data-pr-tooltip={
          email
            ? 'You might find our verification email in your spam or junk folders'
            : 'Navigate to your profile and add required data'
        }
        data-pr-position='right'
        data-pr-at='right+5 top'
        data-pr-my='left center-2'
      />
      <p className='text-center text-black-alpha-90 font-semibold m-0'>{msg}</p>
    </div>
  )
}

export default Warning
