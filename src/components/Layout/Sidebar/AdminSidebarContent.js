import React, { useState } from 'react'
import SidebarElement from './SidebarElement'

const AdminSidebarContent = () => {
  const [nodes] = useState([
    {
      key: '1',
      label: 'Dashboard',
      link: '/admin',
      icon: 'mdi mdi-home',
    },
    {
      key: '2',
      label: 'Profile',
      link: '/admin/profile',
      icon: 'mdi mdi-account',
    },
    {
      key: '3',
      label: 'Orders',
      link: '/admin/orders',
      icon: 'mdi mdi-file-document-multiple',
    },
    {
      key: '4',
      label: 'Reports',
      link: '/#',
      icon: 'mdi mdi-text-box-multiple',
      children: [
        {
          key: '4-0',
          label: 'Manufacturers',
          link: '/admin/reports/manufacturers',
          icon: 'mdi mdi-factory',
        },
        {
          key: '4-1',
          label: 'Molecules',
          link: '/admin/reports/molecules',
          icon: 'mdi mdi-chemical-weapon',
        },
      ],
    },
    {
      key: '5',
      label: 'Settings',
      link: '/#',
      icon: 'mdi mdi-cog',
      children: [
        {
          key: '5-0',
          label: 'Pharmacies',
          link: '/admin/pharmacies',
          icon: 'mdi mdi-pharmacy',
        },
        {
          key: '5-1',
          label: 'Administrators',
          link: '/admin/admins-list',
          icon: 'mdi mdi-account-group',
        },
        {
          key: '5-2',
          label: 'Edit Molecules',
          link: '/admin/molecules',
          icon: 'mdi mdi-chemical-weapon',
        },
      ],
    },
    {
      key: '6',
      label: 'Upload File',
      link: '/admin/upload-file',
      icon: 'mdi mdi-upload',
    },
    {
      key: '7',
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

export default AdminSidebarContent
