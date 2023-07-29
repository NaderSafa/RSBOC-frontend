import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from '../../infrastrucrure/layout/components/topbar.component'
import Warning from '../../infrastrucrure/layout/components/warning.component'
import SideMenu from '../../infrastrucrure/layout/components/side-menu.component'
import Container from '../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../Auth/authentication.context'

const MainLayout = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  const [menuItems, setMenuItems] = useState(['dsfdsg'])

  const { user, isProfileComplete } = useContext(AuthenticationContext)

  const PLAYER_MENU_ITEMS = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      to: '/',
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      to: '/profile',
    },
    {
      label: 'Players',
      icon: 'pi pi-users',
      to: '/players',
    },
    {
      label: 'Championships',
      icon: 'pi pi-sitemap',
      to: '/championships',
    },
  ]

  const CHAMPIONSHIP_MENU_ITEMS = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      to: '/champ',
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      to: '/profile',
    },
  ]

  useEffect(
    () =>
      user.role === 'player'
        ? setMenuItems(PLAYER_MENU_ITEMS)
        : user.role === 'championship'
        ? setMenuItems(CHAMPIONSHIP_MENU_ITEMS)
        : '',
    []
  )

  return (
    <div className='h-screen'>
      {!isProfileComplete && (
        <Warning msg='Please complete your profile info!' />
      )}
      {!user.verified && (
        <>
          <Warning
            msg='Please verify your email address!'
            color='bg-red-300'
            email
          />
        </>
      )}

      <div className='h-full mx-2 md:mx-4'>
        <TopBar menuItems={menuItems} />

        <div className='grid h-full'>
          <div
            className={`hidden lg:inline-block lg:col-${
              menuCollapsed ? 1 : 2
            }  overflow-hidden`}
          >
            <Container className='h-full'>
              <SideMenu
                menuCollapsed={menuCollapsed}
                setMenuCollapsed={setMenuCollapsed}
                menuItems={menuItems}
              />
            </Container>
          </div>
          <div className='col h-full overflow-scroll'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
