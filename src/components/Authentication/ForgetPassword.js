import React, { useContext, useEffect, useRef } from 'react'
import { Alert, Form, FormFeedback, Label, Input } from 'reactstrap'

// Formik Validation
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Toast } from 'primereact/toast'
// import { withRouter, Link } from "react-router-dom"
import { Link } from 'react-router-dom'

import LoggedOutFooter from '../Layout/LoggedOutFooter'
import { AuthenticationContext } from '../../Auth/authentication.context'
import AuthFormsLayout from '../Layout/AuthFormsLayout'
import { ToastPopUp } from '../shared/utils'

const ForgetPasswordPage = (props) => {
  const { onSendForgetPasswordEmail, toastStatus } = useContext(
    AuthenticationContext
  )
  const toast = useRef(null)
  useEffect(() => {
    // console.log(toastStatus)
    if (toastStatus.toastStatus !== undefined) {
      ToastPopUp(toast, toastStatus?.toastStatus, toastStatus?.msg)
    }
  }, [toastStatus])
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please Enter Valid Email')
        .required('Please Enter Your Email'),
    }),
    onSubmit: (values) => {
      onSendForgetPasswordEmail(values.email)
    },
  })

  document.title = 'Forget Password | Speedball Hub'
  return (
    <React.Fragment>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      <AuthFormsLayout
        title='Forget Password'
        subtitle='Please enter your registered email below'
      >
        {props.forgetError && props.forgetError ? (
          <Alert color='danger' style={{ marginTop: '13px' }} className='mt-5'>
            {props.forgetError}
          </Alert>
        ) : null}
        {props.forgetSuccessMsg ? (
          <Alert color='success' style={{ marginTop: '13px' }} className='mt-5'>
            {props.forgetSuccessMsg}
          </Alert>
        ) : null}

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            validation.handleSubmit()
            return false
          }}
          className='mt-4'
        >
          <div className='mb-3'>
            <Label className='form-label' htmlor='useremail'>
              Email
            </Label>
            <Input
              name='email'
              className='form-control'
              placeholder='Enter email'
              type='email'
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
                <div>{validation.errors.email}</div>
              </FormFeedback>
            ) : null}
          </div>

          <div className='row  mb-0'>
            <div className='col-12 text-end'>
              <button
                className='btn btn-primary w-md waves-effect waves-light'
                type='submit'
              >
                Reset
              </button>
            </div>
          </div>
        </Form>
      </AuthFormsLayout>

      <div className='mt-2 text-center'>
        <p>
          Remember It ?
          <Link to='/login' className='fw-medium text-primary'>
            &nbsp;Sign In here
          </Link>
        </p>
      </div>
      {/* <LoggedOutFooter /> */}
    </React.Fragment>
  )
}

export default ForgetPasswordPage
