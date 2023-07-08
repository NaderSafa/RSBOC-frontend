import React from 'react'

import Header from './Header/Header'
import Sidebar from './Sidebar/Sidebar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <React.Fragment>
      <div id='layout-wrapper'>
        <Header />
        <Sidebar />
        <div className='main-content'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default MainLayout
