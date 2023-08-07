import React from 'react'
import { Link } from 'react-router-dom'

const CustomLink = ({ children, to, className }) => {
  return (
    <Link
      className={`text-black-alpha-60 font-semibold transition-colors transition-duration-300 hover:text-red-400 ${
        className ? className : ''
      }`}
      to={to}
    >
      {children}
    </Link>
  )
}

export default CustomLink
