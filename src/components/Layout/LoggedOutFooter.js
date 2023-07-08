import React from 'react'

const LoggedOutFooter = () => {
  return (
    <div className='text-center'>
      Copyright {new Date().getFullYear()} © Speedball Hub
      <span>
        &nbsp;| Powered By&nbsp;
        <a target='_blank' href='http://orthoplexsolutions.com/'>
          Orthoplex Solutions.
        </a>
      </span>
    </div>
  )
}

export default LoggedOutFooter
