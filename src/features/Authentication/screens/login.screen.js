import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthInput from '../components/auth-input.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import AuthContainer from '../containers/auth.container'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [inputError, setInputError] = useState(false)

  const { onLogin, isLoading } = useContext(AuthenticationContext)

  const onSubmitHandler = (e) => {
    !inputError && onLogin(email.toLowerCase().trim(), password)

    e.preventDefault()
  }

  document.title = 'Login | Speedball Hub'

  return (
    <AuthContainer>
      <div>
        <h2 className='text-center text-color font-semibold text-base outline-none text-black'>
          Welcome Back !
        </h2>
        <p className='text-center text-sm mt-2'>
          Sign in to continue to Speedball Hub.
        </p>
        <form onSubmit={onSubmitHandler}>
          <AuthInput
            state={email}
            stateHandler={setEmail}
            type='email'
            setInputError={setInputError}
          />
          <AuthInput
            state={password}
            stateHandler={setPassword}
            type='password'
            setInputError={setInputError}
          />
          <div className='flex align-items-bottom mt-3'>
            <Checkbox
              inputId='rememberMe'
              onChange={() => setRememberMe((prevState) => !prevState)}
              checked={rememberMe}
            />
            <label htmlFor='rememberMe' className='ml-2 text-sm font-semibold'>
              Remember me
            </label>
          </div>
          <Button
            label='Log in'
            type='submit'
            className='w-full text-sm mt-4'
            size='small'
            disabled={inputError ? true : false}
            loading={isLoading}
          />
        </form>
        <p className='text-center text-sm mt-5'>
          Don't have an account?{' '}
          <Link className='font-medium' to='/register'>
            Sign up
          </Link>
          <br />
          <b>or</b>
          <br />
          <Link
            className='font-medium text-center text-sm '
            to='/forgot-password'
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </AuthContainer>
  )
}

export default LoginScreen
