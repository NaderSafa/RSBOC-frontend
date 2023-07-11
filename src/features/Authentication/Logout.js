import React, { useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthenticationContext } from '../../Auth/authentication.context'

const Logout = () => {
  const { onLogout } = useContext(AuthenticationContext)

  useEffect(() => {
    onLogout()
  }, [onLogout])

  return (
    <>
      <Navigate to='/' />
    </>
  )
}

export default Logout
