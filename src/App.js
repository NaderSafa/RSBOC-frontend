import { useContext, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Row, Spinner } from 'reactstrap'
import { AuthenticationContext } from './Auth/authentication.context'
import server from './server'

import { router } from './Routes'

import './App.css'
// import './scss/theme.scss'
import { Toast } from 'primereact/toast'

function App() {
  const { toast, setUser, setIsAdmin, setError, setIsLoading } = useContext(
    AuthenticationContext
  )

  const token = localStorage.getItem('accessToken')
  const getUser = () => {
    server
      .get('/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setIsAdmin(response.data.user.role === 'admin' ? true : false)
        setUser(response.data.user)
        setError(null)
        setIsLoading(false)
      })
      .catch((e) => {
        // setUser(null)
        // if (e.response.status === 401) {
        //   setUser(null)
        //   console.log('catched error')
        // }
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(false)
    if (token) {
      setIsLoading(true)
      getUser()
    }
  }, [])

  return (
    <>
      <RouterProvider className='App' router={router} />
      <Toast ref={toast} />
    </>
  )
}

export default App
