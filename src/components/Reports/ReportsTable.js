import React, { useState, useEffect, useRef } from 'react'
import { classNames } from 'primereact/utils'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

import server from '../../server'
import { useNavigate } from 'react-router-dom'
import MainContentLayout from '../Layout/MainContentLayout'

import { ToastPopUp } from '../shared/utils'
import { Toast } from 'primereact/toast'
import { DropDownTemplate } from '../shared/FilterTemplates'

document.title = 'Reports | Speedball Hub'

export default function ReportsTable() {
  let emptyReport = {
    email: '',
    displayName: '',
  }

  const [reports, setReports] = useState([
    {
      id: '123',
      reportName: 'First Report',
      reportType: 'Molecules',
      reportData: '20/4/2023',
      dateRange: ['20/4/2023', '20/4/2023'],
      pharmacies: ['pharmacy 1', 'pharmacy 2'],
      status: 'generating',
    },
    {
      id: '1234',
      reportName: 'Second Report',
      reportType: 'Manufacturers',
      reportData: '20/4/2023',
      dateRange: ['20/4/2023', '20/4/2023'],
      pharmacies: ['pharmacy 3', 'pharmacy 4'],
      status: 'completed',
    },
  ])
  const [selectedReport, setSelectedReport] = useState(null)
  const [filters, setFilters] = useState(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState([
    { label: 'Verified', value: 'true' },
    { label: 'Pending', value: 'false' },
  ])
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  const [report, setReport] = useState(emptyReport)
  const [reportDialog, setReportDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const navigate = useNavigate()
  const toast = useRef(null)

  useEffect(() => {
    // setTableLoading(true)
    // server
    //   .get('/users/get-users', {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //     },
    //   })
    //   .then((response) => {
    //     const reportData = response.data.users.filter(
    //       (user) => user.role === 'admin'
    //     )
    //     setReports(reportData)
    //     setTableLoading(false)
    //   })
    //   .catch((error) => {
    //     setTableLoading(false)
    //   })
    // initFilters()
  }, [submitted])

  const clearFilter = () => {
    initFilters()
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      reportName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    })
    setGlobalFilterValue('')
  }

  const onRowSelect = (event) => {
    // const report = reports.find((user) => user.id === event.data.id)
    // navigate(`${event.data.displayName}`, { state: report })
    console.log('report')
  }

  const openNew = () => {
    setReport(emptyReport)
    setSubmitted(false)
    setReportDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setReportDialog(false)
  }

  const onInputChange = (e, propertyName) => {
    const val = (e.target && e.target.value) || ''
    let _report = { ...report }

    _report[`${propertyName}`] = val

    setReport(_report)
  }

  const saveReport = () => {
    if (report.displayName.trim() && report.email.trim()) {
      server
        .post('/users/create-report', report, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          ToastPopUp(
            toast,
            'success',
            'Invitation Sent',
            'An invitation has been sent to the report email'
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

      // setSubmitted(true)
      setReportDialog(false)
      setReport(emptyReport)
    }
  }

  const reportDialogFooter = (
    <React.Fragment>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button label='Generate' icon='pi pi-check' onClick={saveReport} />
    </React.Fragment>
  )

  const statusBodyTemplate = (rowData) => {
    let val
    let severity
    if (rowData.status === 'completed') {
      val = 'Completed'
      severity = 'success'
    } else if (rowData.status === 'generating') {
      val = 'Generating'
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

  const renderHeader = () => {
    return (
      <div className='d-flex flex-wrap gap-2 align-items-center justify-content-between'>
        <div className='d-flex gap-2'>
          <Button
            type='button'
            icon='pi pi-filter-slash'
            label='Clear'
            outlined
            onClick={clearFilter}
          />
          <Button
            label='Generate New Report'
            icon='pi pi-plus'
            severity='success'
            onClick={openNew}
          />
        </div>
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

  const header = renderHeader()

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      <MainContentLayout title='Reports'>
        <div className='card'>
          <DataTable
            value={reports}
            paginator
            showGridlines
            rows={10}
            rowsPerPageOptions={[2, 5, 10]}
            loading={tableLoading}
            dataKey='id'
            filters={filters}
            globalFilterFields={['reportName']}
            header={header}
            selectionMode='single'
            onRowSelect={onRowSelect}
            selection={selectedReport}
            onSelectionChange={(e) => setSelectedReport(e.value)}
            emptyMessage='No reports found.'
          >
            <Column
              field='reportName'
              header='Report Name'
              // filter
              sortable
              filterPlaceholder='Search by Name'
              style={{ minWidth: '12rem' }}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
            <Column
              field='reportType'
              header='Report Type'
              // filter
              sortable
              filterPlaceholder='Search by Type'
              style={{ minWidth: '12rem' }}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
            <Column
              field='reportData'
              header='Report Date'
              // filter
              sortable
              filterPlaceholder='Search by Email'
              // style={{ minWidth: '12rem' }}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
            <Column
              field='dateRange'
              header='Date Range'
              // filter
              sortable
              filterPlaceholder='Search by Email'
              style={{ minWidth: '12rem' }}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
            <Column
              field='pharmacies'
              header='Pharmacies'
              // filter
              sortable
              filterPlaceholder='Search by Email'
              style={{ minWidth: '12rem' }}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
            <Column
              field='status'
              header='Status'
              // filter
              filterElement={statusFilterTemplate}
              filterPlaceholder='Search by Email'
              style={{ minWidth: '12rem' }}
              body={statusBodyTemplate}
              // showFilterMatchModes={false}
              // showFilterOperator={false}
              // showAddButton={false}
            />
          </DataTable>

          <Dialog
            visible={reportDialog}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header='Generate a new report'
            modal
            className='p-fluid'
            footer={reportDialogFooter}
            onHide={hideDialog}
          >
            <div className='field'>
              <label htmlFor='reportName' className='font-bold'>
                Report Name
              </label>
              <InputText
                id='reportName'
                value={report.displayName}
                onChange={(e) => onInputChange(e, 'displayName')}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !report.displayName,
                })}
              />
              {submitted && !report.displayName && (
                <small className='p-error'>Name is required.</small>
              )}
            </div>
            <label htmlFor='reportType' className='font-bold'>
              Report Type
            </label>
            <Dropdown
              id='reportType'
              value={report.reportType}
              onChange={(e) => {
                onInputChange(e, 'reportType')
              }}
              options={[
                { label: 'Molecules', value: 'molecules' },
                { label: 'Manufacturers', value: 'manufacturers' },
              ]}
              optionLabel='name'
              placeholder='Select Report Type'
              className='w-full md:w-14rem'
            />
            <label htmlFor='dateRange' className='font-bold'>
              Date Range
            </label>
            <Calendar
              id='dateRange'
              value={report.dateRange}
              onChange={(e) => onInputChange(e, 'dateRange')}
              dateFormat='yy-mm-dd'
              placeholder='yy-mm-dd / yy-mm-dd'
              mask='99/99/99'
              selectionMode='range'
              readOnlyInput
              showIcon
              showButtonBar
            />
          </Dialog>
        </div>
      </MainContentLayout>
    </>
  )
}
