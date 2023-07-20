import React from 'react'

function Warning({ msg, color }) {
  return (
    <div
      className={`${
        color ? color : 'bg-yellow-400'
      } p-1 m-0 flex justify-content-center align-items-center text-xs`}
    >
      <i className='pi pi-info-circle text-black-alpha-90 mr-2 p-0 text-xs' />
      <p className='text-center text-black-alpha-90 font-semibold m-0'>{msg}</p>
    </div>
  )
}

export default Warning
