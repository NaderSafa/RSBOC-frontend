import React, { Fragment, useContext } from 'react'
import { AuthenticationContext } from '../../Auth/authentication.context'

import { Form, FormFeedback, Label, Input } from 'reactstrap'

// Formik validation
import * as Yup from 'yup'
import { useFormik } from 'formik'

import { Link, useSearchParams, Navigate } from 'react-router-dom'

import AuthFormsLayout from '../Layout/AuthFormsLayout'

const CreatePassword = (props) => {
  const { onVerify, user, error } = useContext(AuthenticationContext)

  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get('id')

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(
          passwordRegex,
          'Password Must Contain min 8 Characters, 1 Letter, 1 Number and 1 special character:'
        )
        .required('Please Enter Your Password'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values) => {
      onVerify(id, values.password, values.confirmPassword)
    },
  })

  // handleValidSubmit
  // const handleValidSubmit = (event, values) => {
  //   props.registerUser(values);
  // };

  document.title = 'Create Password | Speedball Hub'
  return (
    <React.Fragment>
      {user ? (
        <Navigate to='/' />
      ) : (
        <>
          <AuthFormsLayout
            title='Create Password'
            subtitle='Get your free Speedball Hub account now.'
          >
            <Form
              className='mt-4'
              onSubmit={(e) => {
                e.preventDefault()
                validation.handleSubmit()
                return false
              }}
              action='#'
            >
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className='mb-3'>
                <Label className='form-label' htmlFor='userpassword'>
                  Password
                </Label>
                <Input
                  name='password'
                  value={validation.values.password || ''}
                  type='password'
                  id='userpassword'
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

              <div className='mb-3'>
                <Label className='form-label' htmlFor='confirmPassword'>
                  Repeat Password
                </Label>
                <Input
                  name='confirmPassword'
                  value={validation.values.confirmPassword || ''}
                  type='password'
                  id='confirmPassword'
                  className='form-control'
                  placeholder='Repeat Password'
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.confirmPassword &&
                    validation.errors.confirmPassword
                      ? true
                      : false
                  }
                />
                {validation.touched.confirmPassword &&
                validation.errors.confirmPassword ? (
                  <FormFeedback type='invalid'>
                    {validation.errors.confirmPassword}
                  </FormFeedback>
                ) : null}
              </div>

              <div className='mb-3 row'>
                <div className='col-12 text-end'>
                  <button
                    className='btn btn-primary w-md waves-effect waves-light'
                    type='submit'
                  >
                    Create
                  </button>
                </div>
              </div>
            </Form>
          </AuthFormsLayout>

          <div className='mt-2 text-center'>
            <p>
              Already have an account ?
              <Link to='/login' className='fw-medium text-primary'>
                &nbsp;Login
              </Link>
            </p>
          </div>
          {/* <LoggedOutFooter /> */}
        </>
      )}
    </React.Fragment>
  )
}

export default CreatePassword
