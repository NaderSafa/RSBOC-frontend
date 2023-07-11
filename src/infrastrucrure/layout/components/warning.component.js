import React from 'react'

function Warning({ msg }) {
  return (
    <div className='bg-yellow-400 p-1 m-0 flex justify-content-center align-items-center text-xs'>
      <i className='pi pi-info-circle mr-2 p-0 text-xs' />
      <p className='text-center text-black-alpha-100 font-semibold m-0'>
        {msg}
      </p>
    </div>
  )
}

export default Warning
