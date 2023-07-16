import { Image } from 'primereact/image'
import React, { useContext, useEffect, useState } from 'react'
import logoHorizontal from '../../../assets/images/logo-h.png'
import background0 from '../../../assets/images/background-0.jpg'
import background1 from '../../../assets/images/background-1.jpg'
import background2 from '../../../assets/images/background-2.jpg'
import background3 from '../../../assets/images/background-3.jpg'
import { Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const AuthContainer = ({ children }) => {
  const { user, isAdmin } = useContext(AuthenticationContext)
  const [shownBackground, setShownBackground] = useState(background1)

  const backgroundList = [background0, background1, background2, background3]

  function getRandomNumber(num) {
    // Get a random number between 0 and 1.
    let randomNumber = Math.random()

    // Multiply the random number by 3.
    randomNumber = randomNumber * num

    // Round the random number to the nearest integer.
    randomNumber = Math.floor(randomNumber)

    // Return the random number.
    return randomNumber
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShownBackground(backgroundList[getRandomNumber(backgroundList.length)])
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

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
          <div className='flex flex-column justify-content-between col-12 md:col-6 lg:col-4 h-screen p-5 bg-white overflow-scroll'>
            <div className='text-center mt-3 mb-4'>
              <Image src={logoHorizontal} width='70%' />
            </div>
            {children}
            <div className='mt-2'>
              <p className='text-center text-sm mb-0'>
                &copy; {new Date().getFullYear()} - Speedball Hub
              </p>
            </div>
          </div>
          <div
            className='hidden md:inline-block col h-screen overflow-scroll bg-cover bg-center p-0'
            style={{ backgroundImage: `url(${shownBackground})` }}
          >
            <div className='flex flex-column bg-black-alpha-40 col h-screen justify-content-end align-items-center px-5 pt-8 pb-3'>
              <h1 className='text-3xl text-center font-bold text-white-alpha-90 '>
                SPEEDBALL LIKE NEVER BEFORE!
              </h1>
              <p className='text-center text-white-alpha-70 font-medium mt-1 text-xs'>
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
