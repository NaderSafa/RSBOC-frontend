import React, { useContext, useRef, useEffect } from 'react'
import { AuthenticationContext } from '../../Auth/authentication.context'

import { Label, Form, FormFeedback, Input } from 'reactstrap'

import { Link, Navigate, useLocation } from 'react-router-dom'

// Formik validation
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Toast } from 'primereact/toast'

import LoggedOutFooter from '../Layout/LoggedOutFooter'
import AuthFormsLayout from '../Layout/AuthFormsLayout'
import { ToastPopUp } from '../shared/utils'

const Login = (props) => {
  const { onLogin, user, isAdmin, error, toastStatus } = useContext(
    AuthenticationContext
  )

  const toast = useRef(null)

  useEffect(() => {
    // console.log(toastStatus)
    if (toastStatus.toastStatus !== undefined) {
      ToastPopUp(
        toast,
        toastStatus?.toastStatus,
        toastStatus?.summary,
        toastStatus?.msg
      )
    }
  }, [toastStatus])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed

    initialValues: {
      email: '',
      password: '',
    },
    enableReinitialize: false,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please Enter Valid Email')
        .required('Please Enter Your User Name'),
      password: Yup.string().min(8).required('Please Enter Your Password'),
    }),
    onSubmit: (values) => {
      onLogin(values.email, values.password)
    },
  })

  document.title = 'Login'

  return (
    <React.Fragment>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      {user ? (
        isAdmin ? (
          <Navigate to='/admin' />
        ) : (
          <Navigate to='/' />
        )
      ) : (
        <>
          <AuthFormsLayout
            title='Welcome Back !'
            subtitle='Login to continue to Speedball Hub.'
          >
            <Form
              className='mt-4'
              onSubmit={(e) => {
                e.preventDefault()
                validation.handleSubmit()
                return false
              }}
              action='#'
              noValidate
              // autoComplete='off'
            >
              {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
              <div className='mb-3'>
                <Label className='form-label' htmlFor='email'>
                  Email
                </Label>
                <Input
                  name='email'
                  className='form-control'
                  placeholder='Enter Email'
                  type='email'
                  id='email'
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.email || ''}
                  invalid={
                    validation.touched.email && validation.errors.email
                      ? true
                      : false
                  }
                />
                {validation.touched.email && validation.errors.email ? (
                  <FormFeedback type='invalid'>
                    {validation.errors.email}
                  </FormFeedback>
                ) : null}
              </div>

              <div className='mb-3'>
                <Label className='form-label' htmlFor='userpassword'>
                  Password
                </Label>
                <Input
                  name='password'
                  value={validation.values.password || ''}
                  type='password'
                  className='form-control'
                  placeholder='Enter Password'
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.password && validation.errors.password
                      ? true
                      : false
                  }
                />
                {validation.touched.password && validation.errors.password ? (
                  <FormFeedback type='invalid'>
                    {validation.errors.password}
                  </FormFeedback>
                ) : null}
              </div>

              <div className='mb-3 row'>
                <div className='col-sm-6'>
                  <div className='form-check'>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id='customControlInline'
                    />
                    <label
                      className='form-check-label'
                      htmlFor='customControlInline'
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <div className='col-sm-6 text-end'>
                  <button
                    className='btn btn-primary w-md waves-effect waves-light'
                    type='submit'
                  >
                    Log In
                  </button>
                </div>
              </div>

              <div className='mt-2 mb-0 row'>
                <div className='col-12 mt-4'>
                  <Link to='/forget-password'>
                    <i className='mdi mdi-lock'></i> Forget your password?
                  </Link>
                </div>
              </div>
            </Form>
          </AuthFormsLayout>

          <div className='mt-2 text-center'>
            <p>
              Don&#39;t have an account ?
              <Link to='/register' className='fw-medium text-primary'>
                &nbsp;Register now
              </Link>
            </p>
          </div>
          {/* <LoggedOutFooter /> */}
        </>
      )}
    </React.Fragment>
  )
}

export default Login
