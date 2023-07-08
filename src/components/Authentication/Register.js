import React, { useContext, useEffect, useRef } from 'react'
import { AuthenticationContext } from '../../Auth/authentication.context'
import { Toast } from 'primereact/toast'

import { Form, FormFeedback, Label, Input } from 'reactstrap'

// Formik validation
import * as Yup from 'yup'
import { useFormik } from 'formik'

import { Link, useNavigate } from 'react-router-dom'

import LoggedOutFooter from '../Layout/LoggedOutFooter'
import AuthFormsLayout from '../Layout/AuthFormsLayout'
import { ToastPopUp } from '../shared/utils'

const Register = (props) => {
  const navigate = useNavigate()
  const { onRegister, error, toastStatus } = useContext(AuthenticationContext)

  const toast = useRef(null)
  useEffect(() => {
    // console.log(toastStatus)
    if (toastStatus.toastStatus !== undefined) {
      ToastPopUp(toast, toastStatus?.toastStatus, toastStatus?.msg)
      if (toastStatus.toastStatus === 'success') {
        navigate('/Login')
      }
    }
  }, [toastStatus])

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: '',
      email: '',
      pharmacyname: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please Enter Valid Email')
        .required('Please Enter Your Email'),
      name: Yup.string().required('Please Enter Your Name'),
      pharmacyname: Yup.string().required('Please Enter Pharmacy name'),
    }),
    onSubmit: (values) => {
      onRegister(values.name, values.email, values.pharmacyname)
    },
  })

  // handleValidSubmit
  // const handleValidSubmit = (event, values) => {
  //   props.registerUser(values);
  // };

  document.title = 'Register | Speedball Hub'
  return (
    <React.Fragment>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      <AuthFormsLayout
        title='Free Register'
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
          {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
          <div className='mb-3'>
            <Label className='form-label' htmlFor='name'>
              Full Name
            </Label>
            <Input
              name='name'
              value={validation.values.name || ''}
              type='text'
              id='name'
              className='form-control'
              placeholder='Enter Your Name'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched.name && validation.errors.name ? true : false
              }
            />
            {validation.touched.name && validation.errors.name ? (
              <FormFeedback type='invalid'>
                {validation.errors.name}
              </FormFeedback>
            ) : null}
          </div>
          <div className='mb-3'>
            <Label className='form-label' htmlFor='useremail'>
              Email
            </Label>
            <Input
              name='email'
              className='form-control'
              placeholder='Enter Email'
              type='email'
              id='useremail'
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
            <Label className='form-label' htmlFor='pharmacyname'>
              Pharmacy Name
            </Label>
            <Input
              name='pharmacyname'
              className='form-control'
              placeholder='Enter Pharmacy Name'
              type='text'
              id='pharmacyname'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.pharmacyname || ''}
              invalid={
                validation.touched.pharmacyname &&
                validation.errors.pharmacyname
                  ? true
                  : false
              }
            />
            {validation.touched.pharmacyname &&
            validation.errors.pharmacyname ? (
              <FormFeedback type='invalid'>
                {validation.errors.pharmacyname}
              </FormFeedback>
            ) : null}
          </div>

          <div className='mb-3 row'>
            <div className='col-12 text-end'>
              <button
                className='btn btn-primary w-md waves-effect waves-light'
                type='submit'
              >
                Register
              </button>
            </div>
          </div>

          <div className='mt-2 mb-0 row'>
            <div className='col-12 mt-4'>
              <p className='mb-0'>
                By registering you agree to Speedball Hub
                <Link to='#' className='text-primary'>
                  &nbsp;Terms of Use
                </Link>
              </p>
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
    </React.Fragment>
  )
}

export default Register
