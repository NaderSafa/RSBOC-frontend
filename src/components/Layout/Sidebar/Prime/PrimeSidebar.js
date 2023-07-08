import React, { useContext, useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { AuthenticationContext } from '../../../../Auth/authentication.context'
import { Link } from 'react-router-dom'
import paLogo from '../../../../assets/images/Logo.png'
import AdminSidebarContentPrime from './AdminSidebarContentPrime'

export default function PrimeSidebar(props) {
  const { isAdmin } = useContext(AuthenticationContext)
  const [selectedNodeKey, setSelectedNodeKey] = useState()

  return (
    <Sidebar visible={props.visible} onHide={() => props.setVisible(false)}>
      <Link to='/'>
        <img src={paLogo} alt='' height='40' style={{ marginBottom: 30 }} />
      </Link>
      {isAdmin ? (
        <AdminSidebarContentPrime
          selected={selectedNodeKey}
          setSelected={setSelectedNodeKey}
        />
      ) : (
        <p>Pharmacy</p>
      )}
    </Sidebar>
  )
}
