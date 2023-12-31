import { useContext, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthenticationContext } from './Auth/authentication.context'

import { router } from './Routes'

import './App.css'
// import './scss/theme.scss'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'

function App() {
  const {
    toast,
    screenLoading,
    setIsLoading,
    setScreenLoading,
    onGetUserData,
  } = useContext(AuthenticationContext)

  useEffect(() => {
    setScreenLoading(false)
    setIsLoading(false)
    const token = localStorage.getItem('SPEEDBALL_HUB::TOKEN')
    token && onGetUserData()
  }, [])

  return (
    <>
      {screenLoading ? (
        <div className='h-screen flex justify-content-center align-items-center'>
          <i className='pi pi-spinner pi-spin text-red-400 text-4xl' />
        </div>
      ) : (
        <RouterProvider className='App' router={router} />
      )}
      <Toast ref={toast} />
      <ConfirmDialog />
    </>
  )
}

export default App
