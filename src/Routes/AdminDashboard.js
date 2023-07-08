import React, { useContext } from 'react'
import { AuthenticationContext } from '../Auth/authentication.context'
import { Navigate, Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  const { isAdmin } = useContext(AuthenticationContext)

  return <>{isAdmin ? <Outlet /> : <Navigate to='/' />}</>
}

export default AdminDashboard
