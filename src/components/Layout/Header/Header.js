import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar'

import { AuthenticationContext } from '../../../Auth/authentication.context'

import NotificationDropdown from './NotificationDropdown'
import ProfileMenu from './ProfileMenu'

import logodarkImg from '../../../assets/images/logo-dark.png'
import logosmImg from '../../../assets/images/logo-sm.png'
import logolightImg from '../../../assets/images/logo-light.png'
import paLogo from '../../../assets/images/Logo.png'
import logoSign from '../../../assets/images/sign.png'
import { Button } from 'primereact/button'
import PrimeSidebar from '../Sidebar/Prime/PrimeSidebar'

const Header = (props) => {
  const { onLogout } = useContext(AuthenticationContext)
  const [visible, setVisible] = useState(false)

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle() {
    var body = document.body
    if (window.screen.width <= 992) {
      body.classList.toggle('sidebar-enable')
    } else {
      body.classList.toggle('vertical-collpsed')
      body.classList.toggle('sidebar-enable')
    }
  }

  const navigate = useNavigate()

  return (
    <React.Fragment>
      <header id='page-topbar'>
        <div className='navbar-header'>
          <PrimeSidebar visible={visible} setVisible={setVisible} />

          <div className='d-flex'>
            <div className='navbar-brand-box'>
              <Link to='/' className='logo logo-dark'>
                <span className='logo-sm'>
                  <img src={logoSign} alt='' height='22' />
                </span>
                <span className='logo-lg'>
                  <img src={paLogo} alt='' height='30' />
                </span>
              </Link>

              <Link to='/' className='logo logo-light'>
                <span className='logo-sm'>
                  <img src={logoSign} alt='' height='22' />
                </span>
                <span className='logo-lg'>
                  <img src={paLogo} alt='' height='30' />
                </span>
              </Link>
            </div>
            {/*<Button
              icon='pi pi-arrow-right'
              onClick={() => setVisible(true)}
              style={{ height: 40, marginTop: 15, marginLeft: 15 }}
  />*/}
            <button
              type='button'
              className='btn header-item noti-icon waves-effect'
              id='vertical-menu-btn'
              onClick={() => {
                tToggle()
              }}
              data-target='#topnav-menu-content'
            >
              <i className='mdi mdi-menu'></i>
            </button>
          </div>

          <div className='d-flex'>
            <div className='dropdown d-none d-lg-inline-block'>
              <button
                type='button'
                onClick={() => {
                  toggleFullscreen()
                }}
                className='btn header-item noti-icon waves-effect'
                data-toggle='fullscreen'
              >
                <i className='mdi mdi-fullscreen'></i>
              </button>
            </div>

            <div className='dropdown d-none d-lg-inline-block'>
              <button
                type='button'
                onClick={() => navigate('/profile')}
                className='btn header-item noti-icon waves-effect'
                data-toggle='fullscreen'
              >
                <i className='mdi mdi-account-circle'></i>
              </button>
            </div>

            {/* <NotificationDropdown />
            <ProfileMenu /> */}

            <div
              onClick={() => {
                onLogout()
              }}
              className='dropdown d-inline-block wave-effect container'
            >
              <button
                type='button'
                className='btn header-item noti-icon right-bar-toggle waves-effect'
              >
                <span className='align-middle'>Logout</span>
                <i className='mdi mdi-logout align-middle ml-6'></i>
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

export default Header
