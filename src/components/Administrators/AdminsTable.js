import React, { useState, useEffect, useRef } from 'react'
import { classNames } from 'primereact/utils'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

import server from '../../server'
import MainContentLayout from '../Layout/MainContentLayout'

import { ToastPopUp } from '../shared/utils'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import DeleteAdmin from './DeleteAdmin'

document.title = 'Speedball Like Never Before'
export default function AdminsTable() {
  let emptyAdmin = {
    email: '',
    displayName: '',
  }

  const [admins, setAdmins] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [statusFilter, setStatusFilter] = useState([
    { label: 'Verified', value: 'true' },
    { label: 'Pending', value: 'false' },
  ])
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })

  const [admin, setAdmin] = useState(emptyAdmin)
  const [adminDialog, setAdminDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const dt = useRef()
  const DeleteRef = useRef()
  const toast = useRef(null)

  const requestParams =
    `?page=${Number(state?.page) + 1}` + `&limit=${1000}` + `&role=admin`

  const getData = () => {
    setTableLoading(true)
    server
      .get(`/users/get-users${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setAdmins(response.data.users)
        setTableLoading(false)
      })
      .catch((error) => {
        setTableLoading(false)
      })
    initState()
  }

  useEffect(() => {
    getData()
  }, [submitted])

  useEffect(() => {
    checkClearBtn()
  }, [state])

  const checkClearBtn = () => {
    if (globalFilterValue) {
      setClearBtnDisabled(false)
      return
    }
    if (state.sortField || state.sortOrder) {
      setClearBtnDisabled(false)
      return
    }
    for (const key in state?.filters) {
      if (key === 'global') {
        continue
      } else if (
        state?.filters[key].constraints[0].value ||
        state?.filters[key]?.constraints[1]?.value
      ) {
        setClearBtnDisabled(false)
        return
      }
    }
    setClearBtnDisabled(true)
  }

  const clearFilter = () => {
    initState()
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...state.filters }

    _filters['global'].value = value

    setState((prevState) => {
      return {
        ...prevState,
        filters: _filters,
      }
    })
    setGlobalFilterValue(value)
  }

  const initState = () => {
    setState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        displayName: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        verified: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
    }))
    setGlobalFilterValue('')
  }

  const openNew = () => {
    setAdmin(emptyAdmin)
    setSubmitted(false)
    setAdminDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setAdminDialog(false)
  }

  const onInputChange = (e, displayName) => {
    const val = (e.target && e.target.value) || ''
    let _admin = { ...admin }

    _admin[`${displayName}`] = val

    setAdmin(_admin)
  }

  const saveAdmin = () => {
    if (admin.displayName.trim() && admin.email.trim()) {
      server
        .post('/users/create-admin', admin, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          ToastPopUp(
            toast,
            'success',
            'Invitation Sent',
            'An invitation has been sent to the admin email'
          )
          setSubmitted(true)
        })
        .catch((e) => {
          if (e.response.status === 400) {
            ToastPopUp(
              toast,
              'error',
              'Email Already Exists',
              e.response.data.message
            )
          }
          setSubmitted(true)
        })

      setAdminDialog(false)
      setAdmin(emptyAdmin)
    } else {
      setSubmitted(true)
    }
  }

  const adminDialogFooter = (
    <React.Fragment>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button label='Save' icon='pi pi-check' onClick={saveAdmin} />
    </React.Fragment>
  )

  const statusBodyTemplate = (rowData) => {
    let val
    let severity
    if (rowData.verified) {
      val = 'Verified'
      severity = 'success'
    } else {
      val = 'Pending'
      severity = 'warning'
    }
    return <Tag value={val} severity={severity}></Tag>
  }

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statusFilter}
        onChange={(e) => {
          options.filterCallback(e.value, options.index)
        }}
        // itemTemplate={statusBodyTemplate}
        placeholder='Select One'
        className='p-column-filter'
        showClear
      />
    )
  }

  const topLeftToolbarTemplate = () => {
    return (
      <div className='d-flex gap-2'>
        <Button
          type='button'
          icon='pi pi-filter-slash'
          label='Clear'
          outlined
          onClick={clearFilter}
          disabled={clearBtnDisabled}
        />
        <Button
          label='New Admin'
          icon='pi pi-plus'
          severity='success'
          onClick={openNew}
        />
      </div>
    )
  }

  const topRightToolbarTemplate = () => {
    return (
      <div>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Keyword Search'
          />
        </span>
      </div>
    )
  }

  // (Delete) column body template
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div className='d-flex justify-content-center gap-2'>
          <Button
            icon='pi pi-trash'
            rounded
            outlined
            severity='danger'
            onClick={() => {
              DeleteRef.current.confirmDeleteAdmin(rowData)
            }}
          />
        </div>
      </React.Fragment>
    )
  }

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      <MainContentLayout title='Administrators'>
        <div className='card'>
          <Toolbar
            className='mb-2'
            left={topLeftToolbarTemplate}
            right={topRightToolbarTemplate}
          />
          <DataTable
            ref={dt}
            value={admins}
            paginator
            rows={state.rows}
            first={state.first}
            showGridlines
            removableSort
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={tableLoading}
            dataKey='id'
            sortField={state.sortField}
            sortOrder={state.sortOrder}
            onPage={(e) => setState(e)}
            onSort={(e) => setState(e)}
            onFilter={(e) => setState(e)}
            filters={state.filters}
            globalFilterFields={['displayName', 'email']}
            selectionMode='single'
            selection={selectedAdmin}
            onSelectionChange={(e) => setSelectedAdmin(e.value)}
            emptyMessage='No admins found.'
          >
            <Column
              field='displayName'
              header='Name'
              filter
              sortable
              filterPlaceholder='Search by Name'
              style={{ minWidth: '12rem' }}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            />
            <Column
              field='email'
              header='Email'
              filter
              sortable
              filterPlaceholder='Search by Email'
              style={{ minWidth: '12rem' }}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            />
            <Column
              field='verified'
              header='Status'
              filter
              filterElement={statusFilterTemplate}
              filterPlaceholder='Search by Email'
              style={{ minWidth: '12rem' }}
              body={statusBodyTemplate}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '12rem' }}
            ></Column>
          </DataTable>

          <DeleteAdmin
            ref={DeleteRef}
            getData={getData}
            admin={admin}
            setAdmin={setAdmin}
            emptyAdmin={emptyAdmin}
          />

          <Dialog
            visible={adminDialog}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header='Send Invitation'
            modal
            className='p-fluid'
            footer={adminDialogFooter}
            onHide={hideDialog}
          >
            <div className='field'>
              <label htmlFor='displayName' className='font-bold'>
                Name
              </label>
              <InputText
                id='displayName'
                value={admin.displayName}
                onChange={(e) => onInputChange(e, 'displayName')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !admin.displayName,
                })}
              />
              {submitted && !admin.displayName && (
                <small className='p-error'>Name is required.</small>
              )}
            </div>

            <div className='field mt-4'>
              <label htmlFor='email' className='font-bold'>
                Email
              </label>
              <InputText
                id='email'
                type='email'
                value={admin.email}
                onChange={(e) => onInputChange(e, 'email')}
                required
                className={classNames({
                  'p-invalid': submitted && !admin.email,
                })}
              />
              {submitted && !admin.email && (
                <small className='p-error'>Email is required.</small>
              )}
              {admin.email &&
                !admin.email.toLowerCase().match(/^\S+@\S+\.\S+$/) && (
                  <small className='p-error'>
                    Please enter vaild email address.
                  </small>
                )}
            </div>
          </Dialog>
        </div>
      </MainContentLayout>
    </>
  )
}
