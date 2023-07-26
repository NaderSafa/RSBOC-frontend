import { Image } from 'primereact/image'
import React, { useContext, useEffect, useState } from 'react'
import logoHorizontal from '../../../assets/images/logo-h.png'
import { Navigate } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const AuthContainer = ({ children }) => {
  const { user, isAdmin } = useContext(AuthenticationContext)
  const [shownBackground, setShownBackground] = useState(
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-0.jpg?alt=media&token=ee543b4b-dfd7-4a8c-b324-d9b906e629b0'
  )

  const backgroundList = [
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-0.jpg?alt=media&token=ee543b4b-dfd7-4a8c-b324-d9b906e629b0',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-1.jpg?alt=media&token=0ee1deb1-c2b2-4b66-8028-1503646fd7b9',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-2.jpg?alt=media&token=82b58c72-d494-480f-a54e-bef2b5827f86',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-3.jpg?alt=media&token=6991cb3f-2b4f-473b-8954-459ca1ffa232',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-4.jpg?alt=media&token=b3f2b717-af94-470b-aadf-e127d5b998f3',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-5.jpg?alt=media&token=cb16dfbe-be42-405b-a851-4a3f698cbebb',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-6.jpg?alt=media&token=26802015-10a5-4d21-83df-689cfd7cee9d',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-7.jpg?alt=media&token=481e152a-4746-4953-b50a-63a37e86e3da',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-8.jpg?alt=media&token=6cba9eb0-bf3a-4892-9a4c-b79966732678',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-9.jpg?alt=media&token=ff5d892b-9754-45e3-9ae2-5b14cc37d4fe',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-10.jpg?alt=media&token=c2bbf896-5cef-4bd0-92bc-53cdf18821c8',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-11.jpg?alt=media&token=64dd7d17-bdf4-406b-9475-de7438a05641',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-12.jpg?alt=media&token=80517c26-9840-4b4e-941e-5ff0ae495e4c',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-13.jpg?alt=media&token=b762a4f4-4090-458f-a66e-f526ce7d2ae1',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-14.jpg?alt=media&token=da94635f-b61e-4dac-8cc3-54271d6fbdcd',
    'https://firebasestorage.googleapis.com/v0/b/rsboc-b0e57.appspot.com/o/backgrounds%2Fbackground-15.jpg?alt=media&token=4c650f28-7ce9-48f9-a640-dedf091ac5d7',
  ]

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
          <div className='flex flex-column justify-content-between col-12 md:col-6 lg:col-4 h-screen p-5 bg-white overflow-hidden'>
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
            className='hidden md:inline-block col bg-black-alpha-90 h-screen overflow-hidden bg-cover bg-center p-0'
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
