import React from 'react'

import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import Container from '../../../infrastrucrure/layout/components/container.component'

const VerifiedScreen = () => {
  document.title = 'Email Verified Successfully | Speedball Hub'

  const navigate = useNavigate()
  return (
    <div className='flex w-screen h-screen align-items-center justify-content-center'>
      <Container className='w-9 md:w-6 lg:w-4 text-center lg:py-5'>
        <i
          className='pi pi-check-circle
        text-8xl text-red-200'
        />
        <h1 className='text-black-alpha-80 text-2xl md:text-4xl'>
          Email Verified Successfully!
        </h1>
        <p className='lg:px-4 text-sm md:text-base'>
          Login into your account and Enjoy your sport more!
        </p>
        <div className='flex justify-content-center mt-3'>
          <Button
            label='Login'
            icon='pi pi-sign-in'
            text
            onClick={() => {
              navigate('/login')
            }}
            className='text-red-300'
          />
        </div>
      </Container>
    </div>
  )
}

export default VerifiedScreen
