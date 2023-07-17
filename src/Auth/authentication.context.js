//  0 - import required functions and variables
import React, { createContext, useEffect, useRef, useState } from 'react'
import server from '../server'

//  1 - create context
export const AuthenticationContext = createContext()

// export const useAuth = () => {
//   return useContext(AuthenticationContext);
// };

//  2 - create provider
export const AuthenticationContextProvider = ({ children }) => {
  //  2.0 - grap required states, states handlers and functions from other providers

  //  2.1 - define our states
  const [isLoading, setIsLoading] = useState(true)
  const [screenLoading, setScreenLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)
  const [toastStatus, setToastStatus] = useState({})

  const toast = useRef()

  useEffect(() => {
    if (toastStatus !== {}) {
      setTimeout(() => {
        setToastStatus({})
      }, 3000)
    }
    // console.log('toastStatus', toastStatus)
  }, [toastStatus])
  //  2.2 - define our functions
  //    2.2.1 - manage state
  //      2.2.1.1 - handle login
  const onLogin = async (email, password) => {
    setIsLoading(true)

    server
      .post('/users/login', {
        email: email,
        password: password,
      })
      .then((response) => {
        const token = response.data.accessToken
        setIsLoading(false)
        setScreenLoading(true)
        // get user data
        server
          .get('/getUser', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setScreenLoading(false)
            setIsAdmin(response.data.user.role === 'admin' ? true : false)
            setUser(response.data.user)
          })
          .catch((e) => {
            setScreenLoading(false)
            console.log(e)
          })
        // save access token
        setAccessToken(response.data.accessToken)
        localStorage.setItem('SPEEDBALL_HUB::TOKEN', response.data.accessToken)
      })
      .catch((error) => {
        console.log(error.response.data.message)
        toast.current.show({
          severity: 'error',
          summary: 'Error in Login',
          detail: error.response.data.message,
        })
        setIsLoading(false)
      })
  }

  //      2.2.1.2 - handle register
  const onRegister = (name, email, password, repeatedPassword) => {
    setIsLoading(true)
    if (password !== repeatedPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Registering',
        detail: 'The passwords you entered do not match',
      })
      setIsLoading(false)
      return
    }
    server
      .post('/users/register', {
        full_name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        // console.log(response.data)
        toast.current.show({
          severity: 'success',
          summary: 'User Created',
          detail: response.data.message,
        })

        onLogin(email, password)
      })
      .catch((error) => {
        console.log(error)
        toast.current.show({
          severity: 'error',
          summary: 'Error in Registering',
          detail: error.response.data.message,
        })
      })
  }

  const onVerify = (id, password, repeatedPassword) => {
    setIsLoading(true)

    if (password !== repeatedPassword) {
      setError('The passwords you entered do not match')
      return
    }
    if (password === '') {
      setError('You must enter a password')
      return
    }

    server
      .post('/users/verify-email', {
        uuid: id,
        password: password,
      })
      .then((response) => {
        setToastStatus({
          toastStatus: 'success',
          msg: response.data.message,
        })
        window.location.href = '/'
      })
      .catch((error) => {
        setError(error.response.data.message)
        setIsLoading(false)
      })
  }

  //      2.2.1.3 - handle send forgot password email | Post request to send email for forget password usage
  const onSendForgetPasswordEmail = (email) => {
    setIsLoading(true)

    server
      .post('/users/send-forget-password-email', {
        email,
      })
      .then((response) => {
        // console.log('response', response)
        setToastStatus({
          toastStatus: 'success',
          msg: response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.response.data.message)
        setToastStatus({
          toastStatus: 'error',
          msg: error.response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
        console.log(error)
        setIsLoading(false)
      })
    setIsLoading(false)
  }

  //      2.2.1.4 - handle change password with old password | Patch request to change password on user profile
  const onChangePasswordProfile = (
    oldPassword,
    newPassword,
    confirmPassword
  ) => {
    setIsLoading(true)

    if (newPassword !== confirmPassword) {
      setToastStatus({
        toastStatus: 'error',
        msg: 'Password & Repeat Password fields do not match',
      })
      // setTimeout(() => {
      //   setToastStatus({})
      // }, 3000)
      setIsLoading(false)
      return false
    }

    if (oldPassword === confirmPassword) {
      setToastStatus({
        toastStatus: 'error',
        msg: 'Please enter a new password ',
      })
      // setTimeout(() => {
      //   setToastStatus({})
      // }, 3000)

      setIsLoading(false)
      return false
    }

    server
      .patch('/users/change-password', {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((response) => {
        console.log(response)
        setToastStatus({
          toastStatus: 'success',
          msg: response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
      })
      .catch((error) => {
        setError(error.response.data.message)
        setToastStatus({
          toastStatus: 'error',
          msg: error.response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
        console.log(error)
        setIsLoading(false)
      })
    setIsLoading(false)
  }

  //      2.2.1.5 - handle change password using access token | Patch request to change password using access token
  const onChangePassword = (accessToken, password, repeatedPassword) => {
    if (password !== repeatedPassword) {
      setError('The passwords you entered do not match')

      return
    }
    if (password === '') {
      setError('You must enter a password')
      return
    }

    server
      .patch('/users/change-password-link', {
        token: accessToken,
        newPassword: password,
      })
      .then((response) => {
        // console.log('response',response)
        setToastStatus({
          toastStatus: 'success',
          msg: response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)

        setIsLoading(false)
        window.location.href = '/'
      })
      .catch((error) => {
        setError(error.response.data.message)
        console.log(error)
        setIsLoading(false)
      })
  }

  //      2.2.1.6 - get user data
  const onGetUserData = () => {
    setScreenLoading(true)
    server
      .get('/getUser', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((response) => {
        // console.log('user data', response.data.user)
        setScreenLoading(false)
        setIsAdmin(response.data.user.role === 'admin' ? true : false)
        setUser(response.data.user)
        setError(null)
      })
      .catch((err) => {
        console.log(err)
        setScreenLoading(false)
      })
  }

  //      2.2.1.7 - handle profile update
  const onProfileUpdate = async (playerInfo) => {
    setScreenLoading(true)

    server
      .patch('/users', playerInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        toast.current.show({
          severity: 'success',
          summary: 'User Updated',
          detail: response.data.message,
        })

        server
          .get('/getUser', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'SPEEDBALL_HUB::TOKEN'
              )}`,
            },
          })
          .then((response) => {
            setIsAdmin(response.data.user.role === 'admin' ? true : false)
            setUser(response.data.user)
            setScreenLoading(false)
          })
      })
      .catch((error) => {
        console.log('error', error)
        toast.current.show({
          severity: 'error',
          summary: 'Error updating profile',
          detail: error.response.data.message,
        })
        setScreenLoading(false)
      })
  }
  //      2.2.1.8 - handle logout
  const onLogout = () => {
    localStorage.removeItem('SPEEDBALL_HUB::TOKEN')
    setUser(null)
    setAccessToken(null)
    setIsAdmin(null)
  }

  // 2.3 - return needed states, states handlers and functions in you provider
  return (
    <AuthenticationContext.Provider
      value={{
        user,
        error,
        isAdmin,
        isLoading,
        toast,
        accessToken,
        toastStatus,
        screenLoading,
        setIsAdmin,
        setError,
        setUser,
        setIsLoading,
        setToastStatus,
        setScreenLoading,
        onLogin,
        onVerify,
        onChangePassword,
        onChangePasswordProfile,
        onSendForgetPasswordEmail,
        onGetUserData,
        onProfileUpdate,
        onRegister,
        onLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
