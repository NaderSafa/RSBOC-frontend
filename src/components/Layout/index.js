import React from 'react'

import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import TopBar from '../../infrastrucrure/layout/components/topbar.component'
import { Button } from 'primereact/button'
import Warning from '../../infrastrucrure/layout/components/warning.component'
import SideMenu from '../../infrastrucrure/layout/components/side-menu.component'

const MainLayout = () => {
  return (
    <React.Fragment>
      <Warning msg='Please complete your profile info!' />
      <div className='mx-2 md:mx-4'>
        <TopBar />
        {/*<Header />
        <Sidebar />*/}
        {/*<div className='grid h-screen w-screen m-0'>
          <div className='flex bg-white flex-column justify-content-between col-1 md:col-2 h-screen overflow-scroll'>
            <SideMenu />
          </div>
          <div className='col h-screen overflow-scroll'>
            <div className='main-content'>
              <Outlet />
            </div>
          </div>
      </div>*/}

        <Footer />
      </div>
    </React.Fragment>
  )
}

export default MainLayout
