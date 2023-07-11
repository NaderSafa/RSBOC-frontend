import React, { useContext, useState } from 'react'
import { Menubar } from 'primereact/menubar'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { useNavigate } from 'react-router-dom'
import logoSign from '../../../assets/images/sign-colored.png'
import logo from '../../../assets/images/logo-h.png'

export default function TopBar() {
  const [fullScreen, setFullScreen] = useState(false)
  const { onLogout } = useContext(AuthenticationContext)
  const navigate = useNavigate()

  const items = [
    {
      label: 'File',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            {
              label: 'Bookmark',
              icon: 'pi pi-fw pi-bookmark',
            },
            {
              label: 'Video',
              icon: 'pi pi-fw pi-video',
            },
          ],
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-trash',
        },
        {
          separator: true,
        },
        {
          label: 'Export',
          icon: 'pi pi-fw pi-external-link',
        },
      ],
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
    {
      label: 'Quit',
      icon: 'pi pi-fw pi-power-off',
    },
  ]

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
    <img
      alt='speedball hub logo'
      src={logo}
      height='40'
      className='mr-5'
      onClick={() => navigate('/')}
    />
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
        className='curser-pointer mr-2 md:mr-4'
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
    <>
      <div className='my-2 md:mt-2 overflow-hidden z-5'>
        <Menubar
          className='border-1 border-round-md p-3 lg:px-6 xl:px-8'
          // model={items}
          start={start}
          end={end}
        />
      </div>
    </>
  )
}
