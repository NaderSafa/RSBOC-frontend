//  0 - import required functions and variables
import React, { createContext, useEffect, useState } from 'react'
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
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)
  const [toastStatus, setToastStatus] = useState({})

  let catchErr = () => {
    setToastStatus({
      toastStatus: 'error',
      msg: error.response.data.message,
    })
  }

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
      .post('/users/signin', {
        email: email,
        password: password,
      })
      .then((response) => {
        const token = response.data.accessToken
        // get user data
        server
          .get('/users', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setIsAdmin(response.data.user.role === 'admin' ? true : false)
            setUser(response.data.user)
            setError(null)
            setIsLoading(false)
          })
        // save access token
        setAccessToken(response.data.accessToken)
        localStorage.setItem('accessToken', response.data.accessToken)
      })
      .catch((error) => {
        console.log(error.response.data.message)
        setToastStatus({
          toastStatus: 'error',
          msg: error.response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
        setError(error.response.data.message)
        setIsLoading(false)
      })
  }

  //      2.2.1.2 - handle register
  const onRegister = (name, email, pharmacyname) => {
    server
      .post('/users/signup', {
        displayName: name,
        email: email,
        name: pharmacyname,
      })
      .then((response) => {
        console.log(response)
        setError(null)
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
        setIsLoading(false)
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
    server
      .get('/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('user data', response.data.user)
        setIsAdmin(response.data.user.role === 'admin' ? true : false)
        setUser(response.data.user)
        setError(null)
      })
  }

  //      2.2.1.7 - handle profile update
  const onProfileUpdate = (displayName, pharmacyName = '') => {
    let requestBody

    isAdmin
      ? (requestBody = {
          displayName: displayName,
        })
      : (requestBody = {
          displayName: displayName,
          pharmacyName: pharmacyName,
        })

    server
      .patch('/users', requestBody)
      .then((response) => {
        // console.log('response', response)
        setToastStatus({
          toastStatus: 'success',
          msg: response.data.message,
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)

        onGetUserData()
      })
      .catch((error) => {
        // console.log('error', error)
        // setError(error.response.data.message)
        setToastStatus({
          toastStatus: 'error',
          msg: 'Error updating profile',
        })
        // setTimeout(() => {
        //   setToastStatus({})
        // }, 3000)
      })
  }
  //      2.2.1.8 - handle logout
  const onLogout = () => {
    localStorage.removeItem('accessToken')
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
        accessToken,
        toastStatus,
        setIsAdmin,
        setError,
        setUser,
        setIsLoading,
        setToastStatus,
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