import React from 'react'
import Container from '../../../infrastrucrure/layout/components/container.component'

function ChampionshipsScreen() {
  return (
    <div className='flex w-full h-full align-items-center justify-content-center'>
      <Container className='w-9 md:w-6 lg:w-4 text-center lg:py-5'>
        <i className='pi pi-cog text-6xl' />
        <h1 className='text-red-400 text-2xl md:text-4xl'>Stay tuned!</h1>
        <p className='lg:px-4 text-sm md:text-base'>
          This page is currently under Consstruction
        </p>
      </Container>
    </div>
  )
}

export default ChampionshipsScreen
