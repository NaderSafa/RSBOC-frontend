import { Button } from 'primereact/button'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../components/auth-input.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import AuthContainer from '../containers/auth.container'

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [inputError, setInputError] = useState(false)

  const { onRegister, isLoading } = useContext(AuthenticationContext)

  const onSubmitHandler = (e) => {
    !inputError &&
      onRegister(
        fullName,
        email.toLowerCase().trim(),
        password,
        repeatedPassword
      ).then(() => {
        setFullName('')
        setEmail('')
        setPassword('')
        setRepeatedPassword('')
      })

    e.preventDefault()
  }

  document.title = 'Register | Speedball Hub'

  return (
    <AuthContainer>
      <div>
        <h2 className='text-center text-color font-semibold text-base outline-none'>
          Free Register
        </h2>
        <p className='text-center text-sm mt-2'>
          Get your free Speedball Hub account now.
        </p>
        <form onSubmit={onSubmitHandler}>
          <AuthInput
            state={fullName}
            stateHandler={setFullName}
            type='text'
            setInputError={setInputError}
            placeholder='Full name'
            required={true}
          />
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
          <AuthInput
            state={repeatedPassword}
            stateHandler={setRepeatedPassword}
            type='password'
            setInputError={setInputError}
            placeholder='Repeat password'
          />

          <Button
            label='Register'
            type='submit'
            className='w-full text-sm mt-4'
            size='small'
            disabled={inputError ? true : false}
            loading={isLoading}
          />
        </form>
        <p className='text-center text-sm mt-5'>
          Already have an account?{' '}
          <Link className='font-medium' to='/login'>
            Login
          </Link>
        </p>
      </div>
    </AuthContainer>
  )
}

export default RegisterScreen
