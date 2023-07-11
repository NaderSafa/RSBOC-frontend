import { Image } from 'primereact/image'
import React, { useContext } from 'react'
import logoHorizontal from '../../../assets/images/logo-h.png'
import background from '../../../assets/images/background.jpg'
import { Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const AuthContainer = ({ children }) => {
  const { user, isAdmin } = useContext(AuthenticationContext)

  return (
    <>
      {user ? (
        isAdmin ? (
          <Navigate to='/admin' />
        ) : (
          <Navigate to='/' />
        )
      ) : (
        <div className='grid h-screen w-screen m-0'>
          <div className='flex flex-column justify-content-between col-12 md:col-6 lg:col-4 xl:col-3 h-screen p-5 bg-white'>
            <div className='text-center my-3'>
              <Image src={logoHorizontal} width='70%' />
            </div>
            {children}
            <div>
              <p className='text-center text-sm mb-0'>
                &copy; {new Date().getFullYear()} - Speedball Hub
              </p>
            </div>
          </div>
          <div
            className='hidden md:inline-block col h-screen overflow-scroll bg-cover bg-center bg-black-alpha-90 p-0'
            style={{ backgroundImage: `url(${background})` }}
          >
            <div className='flex flex-column bg-white-alpha-50 col h-screen justify-content-end align-items-center px-5 pt-8 pb-3'>
              <h1 className='text-3xl text-center font-bold text-black-alpha-40 '>
                SPEEDBALL LIKE NEVER BEFORE!
              </h1>
              <p className='text-center text-black-alpha-40 font-medium mt-1 text-xs'>
                whether you are a speedball player, coach or spectator.
                <br /> we have a place for you.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthContainer
