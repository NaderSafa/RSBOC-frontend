import React, { useState } from 'react'
import SidebarElement from './SidebarElement'

const PharmacySidebarContent = () => {
  const [nodes] = useState([
    {
      key: '1',
      label: 'Dashboard',
      link: '',
      icon: 'mdi mdi-home',
    },
    {
      key: '2',
      label: 'Profile',
      link: 'profile',
      icon: 'mdi mdi-account',
    },
    {
      key: '3',
      label: 'Orders',
      link: 'orders',
      icon: 'mdi mdi-file-document-multiple',
    },
    {
      key: '4',
      label: 'Manufacturers',
      link: 'manufacturers',
      icon: 'mdi mdi-factory',
    },
    {
      key: '5',
      label: 'Logout',
      link: 'logout',
      icon: 'mdi mdi-logout',
    },
  ])

  return (
    <>
      {nodes.map((menuItem) => (
        <SidebarElement
          key={menuItem.key}
          name={menuItem.label}
          link={menuItem.link}
          iconClass={menuItem.icon}
          notifications={menuItem.notifications}
          children={menuItem.children}
        />
      ))}
    </>
  )
}

export default PharmacySidebarContent
