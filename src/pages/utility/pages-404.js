import React from 'react'
import Container from '../../infrastrucrure/layout/components/container.component'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'

const Pages404 = () => {
  document.title = '404 | Speedball Hub'

  const navigate = useNavigate()
  return (
    <div className='flex w-screen h-screen align-items-center justify-content-center'>
      <Container className='w-9 md:w-6 lg:w-4 text-center lg:py-5'>
        <i
          className='pi pi-exclamation-triangle
        text-6xl'
        />
        <h1 className='text-red-400 text-2xl md:text-4xl'>Error 404!</h1>
        <p className='lg:px-4 text-sm md:text-base'>Page not found</p>
        <div className='flex justify-content-around mt-3'>
          <Button
            label='Back'
            icon='pi pi-arrow-left
            '
            size='small'
            text
            onClick={() => {
              navigate(-1)
            }}
          />
          <Button
            label='Home'
            icon='pi pi-home'
            size='small'
            text
            onClick={() => {
              navigate('/')
            }}
          />
        </div>
      </Container>
    </div>
  )
}

export default Pages404
