import React from 'react'

function Container({ className, children }) {
  return (
    <div
      className={`border-1 w-full border-round-md p-4 ${className}`}
      style={{ backgroundColor: '#f5f5f5', borderColor: '#ebebeb' }}
    >
      {children}
    </div>
  )
}

export default Container
