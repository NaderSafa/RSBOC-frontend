import React from 'react'
import { Link } from 'react-router-dom'

const SidebarElement = ({ name, link, iconClass, children }) => {
  return (
    <li>
      <Link to={link} className={`waves-effect ${children && 'has-arrow'}`}>
        <i className={iconClass} />
        {/* {notifications.length > 0 && (
          <span className='badge rounded-pill bg-primary float-end'>
            {notifications.length}
          </span>
        )} */}
        <span>{name}</span>
      </Link>
      {children && (
        <ul className='sub-menu' aria-expanded='false'>
          {children.map((child) => (
            <li key={child.key}>
              <Link to={child.link}>{child.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default SidebarElement
