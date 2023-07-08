import React, { useState, useRef } from 'react'
import { Label, Form, FormFeedback, Input, Spinner } from 'reactstrap'

import MainContentLayout from '../Layout/MainContentLayout'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import server from '../../server'

import { ToastPopUp } from '../shared/utils'
import { Toast } from 'primereact/toast'

const AdminUploadFile = () => {
  // const SUPPORTED_FORMATS = [
  //   'text/csv',
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // ]
  const FILE_SIZE = 1024 * 1024 * 5

  const [file, setFile] = useState()
  // const [fileType, setFileType] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const toast = useRef(null)

  const validation = useFormik({
    initialValues: {
      displayName: '',
      email: '',
      supplier: 'default',
      file: '',
    },
    enableReinitialize: false,
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please Enter Valid Email')
        .required('Please Enter Your User Name'),
      displayName: Yup.string().required('Please Enter Pharmacy Owner'),
      supplier: Yup.mixed().test(
        'check if select',
        'Please Select a Supplier',
        (value) => {
          return !value || value === 'default' ? false : true
        }
      ),
      file: Yup.mixed()
        .required('A file is required')
        .test(
          'file-size',
          'File is too large, file size should not exceed 5 MB.',
          (value, ctx) => {
            if (fileSize === null) {
              return true
            }
            return fileSize && fileSize <= FILE_SIZE
          }
        ),
      // .test(
      //   'file-type',
      //   'Wrong File Formate, please use .xls or .csv files.',
      //   (value) => {
      //     console.log(fileType)
      //     if (fileType === null) {
      //       return true
      //     }
      //     return SUPPORTED_FORMATS.includes(fileType)
      //   }
      // ),
    }),
    onSubmit: (values, { resetForm }) => {
      uploadFile(values, resetForm)
    },
  })

  const uploadFile = (values, resetForm) => {
    setIsUploading(true)
    const data = new FormData()
    data.append('displayName', values.displayName)
    data.append('email', values.email)
    data.append('file', file)
    server
      .post('/uploads/kf', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setIsUploading(false)
        ToastPopUp(
          toast,
          'success',
          'File Uploaded',
          `Results will be emailed to you and "${values.displayName}" once ready.`
        )
        resetForm()
      })
      .catch((error) => {
        setIsUploading(false)
        ToastPopUp(toast, 'error', 'Error', error.response.data.message)
        resetForm()
      })
  }

  const onFileInputChange = (e) => {
    setTimeout(() => {
      e.target.blur()
    }, 50)
  }

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      <MainContentLayout title='Upload File'>
        <div>
          <Form
            className='mt-4'
            onSubmit={(e) => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
            action='#'
            noValidate
            // enctype='multipart/form-data'
          >
            <div className='mb-3'>
              <Label className='form-label' htmlFor='pharmacy-owner'>
                Pharmacy Owner
              </Label>
              <Input
                name='displayName'
                className='form-control'
                placeholder='Enter Pharmacy Owner'
                type='text'
                id='pharmacy-owner'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.displayName || ''}
                invalid={
                  validation.touched.displayName &&
                  validation.errors.displayName
                    ? true
                    : false
                }
              />
              {validation.touched.displayName &&
              validation.errors.displayName ? (
                <FormFeedback type='invalid'>
                  {validation.errors.displayName}
                </FormFeedback>
              ) : null}
            </div>
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
              <Label className='form-label' htmlFor='supplier'>
                Supplier
              </Label>
              <Input
                name='supplier'
                className='form-control'
                placeholder='Enter supplier'
                type='select'
                id='supplier'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.supplier || ''}
                invalid={
                  validation.touched.supplier && validation.errors.supplier
                    ? true
                    : false
                }
              >
                <option defaultValue value='default'>
                  Choose A Supplier
                </option>
                <option value={1}>K+F</option>
              </Input>
              {validation.touched.supplier && validation.errors.supplier ? (
                <FormFeedback type='invalid'>
                  {validation.errors.supplier}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label className='form-label' htmlFor='file'>
                Upload File
              </Label>
              <Input
                name='file'
                className='form-control'
                placeholder='Upload File'
                type='file'
                id='file'
                // accept='.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                onBlur={validation.handleBlur}
                onChange={(e) => {
                  setFile(e.currentTarget.files[0])
                  setFileSize(e.target.files[0]?.size)
                  // setFileType(e.currentTarget.files[0]?.type)

                  validation.handleChange(e)
                  onFileInputChange(e)
                }}
                value={validation.values.file || ''}
                invalid={
                  validation.touched.file && validation.errors.file
                    ? true
                    : false
                }
              />
              {validation.touched.file && validation.errors.file ? (
                <FormFeedback type='invalid'>
                  {validation.errors.file}
                </FormFeedback>
              ) : null}
            </div>
            <button
              style={
                isUploading
                  ? { backgroundColor: '#abb3f4', borderColor: '#abb3f4' }
                  : {}
              }
              className='btn btn-primary w-md waves-effect waves-light mt-4'
              type='submit'
            >
              Submit
            </button>
          </Form>
        </div>
        {isUploading && (
          <div className='d-flex'>
            <Spinner color='primary' size='sm' className='mt-3' />
            <p
              className='align-text-center'
              style={{ margin: '14px 0 0 10px' }}
            >
              Uploading...
            </p>
          </div>
        )}
      </MainContentLayout>
    </>
  )
}

export default AdminUploadFile
