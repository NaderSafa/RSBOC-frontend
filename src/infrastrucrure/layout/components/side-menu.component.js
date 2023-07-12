import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SideMenu({
  menuCollapsed,
  setMenuCollapsed,
  menuItems,
}) {
  const navigate = useNavigate()

  return (
    <>
      <div className='flex justify-content-between h-full flex-column'>
        <div>
          <div
            className={`transition-colors transition-duration-500 text-black-alpha-80 hover:text-black-alpha-60 flex align-items-center cursor-pointer justify-content-${
              menuCollapsed ? 'center' : 'left'
            }`}
            onClick={() => setMenuCollapsed((prevState) => !prevState)}
          >
            <p className='text-xs mr-2'>Main</p>
            <i
              className={`pi pi-arrow-circle-${
                menuCollapsed ? 'right' : 'left'
              } text-right text-sm cursor-pointer`}
            />
          </div>
          {menuItems?.map((item, idx) => (
            <div
              className={`flex surface-overlay overflow-hidden text-overflow-ellipsis white-space-nowrap justify-content-${
                menuCollapsed ? 'center' : 'start'
              } align-items-center`}
              style={{ height: 40 }}
              key={idx}
              onClick={item.command}
            >
              <div
                className={`flex align-items-center py-1 cursor-pointer transition-colors text-black-alpha-80 transition-duration-300 hover:text-red-300`}
              >
                <i
                  className={`${item.icon} my-0 ${
                    menuCollapsed ? 'text-xl' : 'mr-2 text-sm'
                  }`}
                />
                <h3
                  className={`text-sm my-0 font-medium ${
                    menuCollapsed ? 'hidden' : 'inline-block'
                  }`}
                >
                  {item.label}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`flex justify-content-${
            menuCollapsed ? 'center' : 'start'
          } align-items-center w-full`}
          style={{ height: 40 }}
          onClick={() => navigate('/logout')}
        >
          <div
            className={`flex align-items-center py-1 cursor-pointer transition-colors text-red-400 transition-duration-300 hover:text-red-300`}
          >
            <i
              className={`pi pi-power-off my-0 ${
                menuCollapsed ? 'text-xl' : 'mr-2 text-sm'
              }`}
            />
            <h3
              className={`text-sm my-0 ${
                menuCollapsed ? 'hidden' : 'inline-block'
              }`}
            >
              Logout
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}
