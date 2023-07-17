import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { AuthenticationContext } from '../Auth/authentication.context'
import server from '../server'
import Container from '../infrastrucrure/layout/components/container.component'
import { Button } from 'primereact/button'

const PrivateRoutes = () => {
  const { user, setUser, toast } = useContext(AuthenticationContext)
  const [sessionExpired, setSessionExpired] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const toastify = toast.current
    return () => {
      if (sessionExpired) {
        toastify.show({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Your session expired, Please login again.',
        })
        navigate('./login')
      }
    }
  }, [sessionExpired, navigate, toast])

  server.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        setSessionExpired(true)
        setUser(null)
      }
      return Promise.reject(error)
    }
  )

  return (
    <Fragment>
      {user ? (
        <Outlet />
      ) : window.location.href.endsWith('.com/') ||
        window.location.href.endsWith('3000/') ? (
        <Navigate to='/login' />
      ) : (
        <div className='flex w-screen h-screen align-items-center justify-content-center'>
          <Container className='w-9 md:w-6 lg:w-4 text-center lg:py-5'>
            <i className='pi pi-ban text-6xl' />
            <h1 className='text-red-400 text-2xl md:text-4xl'>Calm down!</h1>
            <p className='lg:px-4 text-sm md:text-base'>
              This is a private route please sign in to continue
            </p>
            <Button
              label='Log in'
              text
              size='small'
              onClick={() => navigate('/login')}
            />
            <Button
              label='Register'
              text
              size='small'
              severity='secondary'
              onClick={() => navigate('/register')}
            />
          </Container>
        </div>
      )}
    </Fragment>
  )
}

export default PrivateRoutes
