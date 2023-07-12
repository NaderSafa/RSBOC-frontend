import React from 'react'

function Container({ children }) {
  return (
    <div
      className='border-1 w-full h-full border-round-md p-4'
      style={{ backgroundColor: '#f5f5f5', borderColor: '#ebebeb' }}
    >
      {children}
    </div>
  )
}

export default Container
