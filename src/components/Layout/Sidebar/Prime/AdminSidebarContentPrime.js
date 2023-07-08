import { PanelMenu } from 'primereact/panelmenu'

import React, { useState } from 'react'
import { Tree } from 'primereact/tree'
import { useNavigate } from 'react-router-dom'

export default function AdminSidebarContentPrime(props) {
  const [nodes, setNodes] = useState([
    {
      key: '0',
      label: 'Dashboard',
      link: '/admin',
      icon: 'mdi mdi-home',
    },
    {
      key: '1',
      label: 'Profile',
      link: '/admin/profile',
      icon: 'mdi mdi-account',
    },
    {
      key: '2',
      label: 'Orders',
      link: '/admin/orders',
      icon: 'mdi mdi-file-document-multiple',
    },
    {
      key: '5',
      label: 'Reports',
      icon: 'mdi mdi-text-box-multiple',
      children: [
        {
          key: '5-0',
          label: 'Manufacturers',
          link: '/admin/reports/manufacturers',
          icon: 'mdi mdi-factory',
        },
        {
          key: '5-1',
          label: 'Molecules',
          link: '/admin/reports/molecules',
          icon: 'mdi mdi-chemical-weapon',
        },
      ],
    },
    {
      key: '6',
      label: 'Settings',
      icon: 'mdi mdi-cog',
      children: [
        {
          key: '6-0',
          label: 'Pharmacies',
          link: '/admin/pharmacies',
          icon: 'mdi mdi-pharmacy',
        },
        {
          key: '6-1',
          label: 'Administrators',
          link: '/admin/admins-list',
          icon: 'mdi mdi-account-group',
        },
        {
          key: '6-2',
          label: 'Edit Molecules',
          link: '/admin/molecules',
          icon: 'mdi mdi-chemical-weapon',
        },
      ],
    },
    {
      key: '8',
      label: 'Logout',
      link: 'logout',
      icon: 'mdi mdi-logout',
    },
  ])

  const items = [
    {
      label: 'File',
      icon: 'pi pi-fw pi-file',
    },
    {
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: 'Left',
          icon: 'pi pi-fw pi-align-left',
        },
        {
          label: 'Right',
          icon: 'pi pi-fw pi-align-right',
        },
        {
          label: 'Center',
          icon: 'pi pi-fw pi-align-center',
        },
        {
          label: 'Justify',
          icon: 'pi pi-fw pi-align-justify',
        },
      ],
    },
    {
      label: 'Users',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-user-minus',
        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-users',
          items: [
            {
              label: 'Filter',
              icon: 'pi pi-fw pi-filter',
              items: [
                {
                  label: 'Print',
                  icon: 'pi pi-fw pi-print',
                },
              ],
            },
            {
              icon: 'pi pi-fw pi-bars',
              label: 'List',
            },
          ],
        },
      ],
    },
    {
      label: 'Events',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {
              label: 'Save',
              icon: 'pi pi-fw pi-calendar-plus',
            },
            {
              label: 'Delete',
              icon: 'pi pi-fw pi-calendar-minus',
            },
          ],
        },
        {
          label: 'Archive',
          icon: 'pi pi-fw pi-calendar-times',
          items: [
            {
              label: 'Remove',
              icon: 'pi pi-fw pi-calendar-minus',
            },
          ],
        },
      ],
    },
  ]

  const navigate = useNavigate()

  const onSelect = (e) => {
    if (e.node.link) {
      navigate(e.node.link)
    } else {
      const _nodes = nodes.map((node) =>
        node.key === e.node.key
          ? { ...node, expanded: !node.expanded }
          : { ...node }
      )
      setNodes(_nodes)
    }
  }
  return (
    <div className='flex justify-content-center'>
      {/*<PanelMenu model={items} className='w-full md:w-25rem my-panel' />*/}
      <Tree
        value={nodes}
        selectionMode='single'
        selectionKeys={props.selected}
        onSelectionChange={(e) => props.setSelected(e.value)}
        onSelect={onSelect}
        className='w-full md:w-30rem'
      />
    </div>
  )
}
