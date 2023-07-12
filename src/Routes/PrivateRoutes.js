import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { AuthenticationContext } from '../Auth/authentication.context'
import server from '../server'
import { ToastPopUp } from '../components/shared/utils'

const PrivateRoutes = () => {
  const { user, setUser, setToastStatus, toast } = useContext(
    AuthenticationContext
  )
  const [sessionExpired, setSessionExpired] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (sessionExpired) {
        toast.current.show({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Your session expired, Please login again.',
        })
        navigate('./login')
      }
    }
  }, [sessionExpired])

  server.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        setSessionExpired(true)
        setUser(null)
        // console.log('error 401')
      }
      return Promise.reject(error)
    }
  )

  return (
    <Fragment>
      {
        user ? (
          <Outlet />
        ) : window.location.href.endsWith('.com/') ||
          window.location.href.endsWith('3000/') ? (
          <Navigate to='/login' />
        ) : (
          <p>this is a private route please sign in to continue</p>
        )
        // : <Navigate to='/login' />
      }
    </Fragment>
  )
}

export default PrivateRoutes
