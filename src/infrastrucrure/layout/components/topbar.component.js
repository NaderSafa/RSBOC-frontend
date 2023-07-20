import React, { useContext, useRef, useState } from 'react'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/logo-h.png'
import { Toolbar } from 'primereact/toolbar'
import { Menu } from 'primereact/menu'

export default function TopBar({ menuItems }) {
  const [fullScreen, setFullScreen] = useState(false)
  const { onLogout } = useContext(AuthenticationContext)
  const menuRef = useRef()

  const navigate = useNavigate()

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
    setFullScreen((prevState) => !prevState)
  }

  const start = (
    <div className='flex align-items-center flex-grow-1 justify-content-between'>
      <div className='flex align-items-center inline-block lg:hidden'>
        <Menu
          className='mt-3 shadow-none'
          model={menuItems}
          popup
          ref={menuRef}
          id='popup_menu_left'
        />
        <i
          className='pi pi-align-left mr-5'
          onClick={(e) => menuRef.current.toggle(e)}
          aria-controls='popup_menu_left'
          aria-haspopup
        />
      </div>
      <img
        alt='speedball hub logo'
        src={logo}
        height='40'
        className='cursor-pointer'
        onClick={() => navigate('/')}
      />
    </div>
  )
  const end = (
    <div className='flex align-items-center'>
      <div
        onClick={() => {
          toggleFullscreen()
        }}
        className='cursor-pointer mr-3'
      >
        <i className={`pi pi-window-${fullScreen ? 'min' : 'max'}imize`} />
      </div>

      <div
        onClick={() => navigate('/profile')}
        className='curser-pointer mr-3 md:mr-4'
      >
        <i className='pi pi-user' />
      </div>
      {/* <NotificationDropdown />
  <ProfileMenu /> */}
      <div
        onClick={() => {
          onLogout()
        }}
        className='curser-pointer text-red-400'
      >
        <i className='pi pi-power-off ml-2' />
      </div>
    </div>
  )

  return (
    <div className='my-2'>
      <Toolbar
        className='flex border-1 border-round-md p-3 lg:px-6 xl:px-8'
        start={start}
        end={end}
        style={{ background: '#f5f5f5' }}
      />
    </div>
  )
}
