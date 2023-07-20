import React, { useContext, useEffect, useState } from 'react'

import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import Footer from './Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import TopBar from '../../infrastrucrure/layout/components/topbar.component'
import { Button } from 'primereact/button'
import Warning from '../../infrastrucrure/layout/components/warning.component'
import SideMenu from '../../infrastrucrure/layout/components/side-menu.component'
import Container from '../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../Auth/authentication.context'

const MainLayout = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  const [menuItems, setMenuItems] = useState(['dsfdsg'])

  const { user } = useContext(AuthenticationContext)
  const navigate = useNavigate()

  const PLAYER_MENU_ITEMS = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => navigate('/'),
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => navigate('/profile'),
    },
    {
      label: 'Players',
      icon: 'pi pi-users',
      command: () => navigate('/players'),
    },
    {
      label: 'Championships',
      icon: 'pi pi-sitemap',
      command: () => navigate('/championships'),
    },
  ]
  useEffect(
    () => (user.role === 'player' ? setMenuItems(PLAYER_MENU_ITEMS) : null),
    []
  )

  return (
    <React.Fragment>
      {(!user.height ||
        !user.profile_picture_url ||
        !user.preferred_hand ||
        !user.country ||
        !user.gender ||
        !user.phone_number ||
        !user.dob) && <Warning msg='Please complete your profile info!' />}
      {!user.verified && (
        <Warning msg='Please verify your email address!' color='bg-red-300' />
      )}

      <div className='mx-2 md:mx-4'>
        <TopBar menuItems={menuItems} />
        {
          <div className='grid h-full'>
            <div
              className={`hidden lg:inline-block lg:col-${
                menuCollapsed ? 1 : 2
              } h-screen overflow-scroll`}
            >
              <Container className='h-full'>
                <SideMenu
                  menuCollapsed={menuCollapsed}
                  setMenuCollapsed={setMenuCollapsed}
                  menuItems={menuItems}
                />
              </Container>
            </div>
            <div className='col h-screen overflow-scroll'>
              <Outlet />
            </div>
          </div>
        }
      </div>
    </React.Fragment>
  )
}

export default MainLayout
