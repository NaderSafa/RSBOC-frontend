import { Calendar } from 'primereact/calendar'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { MultiSelect } from 'primereact/multiselect'
import { useEffect, useState } from 'react'

export const DateFilterTemplate = (props) => (
  <Calendar
    value={props.state}
    onChange={(e) => props.stateHandler(e)}
    dateFormat='yy-mm-dd'
    placeholder='Select Date Range'
    mask='99/99/99'
    selectionMode='range'
    readOnlyInput
    showIcon
    showButtonBar
    clearButtonClassName='calender-clear-btn'
    // onClearButtonClick={() => console.log('clear btn clicked')}
  />
)

export const SingleDateFilterTemplate = (props) => (
  <Calendar
    value={props.state}
    onChange={(e) => props.stateHandler(e)}
    dateFormat='yy-mm-dd'
    placeholder='Select Date'
    mask='99/99/99'
    readOnlyInput
    showIcon
    showButtonBar
  />
)

export const MinMaxTemplate = (props) => {
  const [values, setValues] = useState()
  useEffect(() => props.stateHandler(values), [values])

  return (
    <>
      <div className='p-inputgroup'>
        <span className='p-inputgroup-addon'>$</span>
        <InputNumber
          placeholder='min'
          value={values?.min}
          onChange={(e) => {
            setValues((prevValue) => ({
              ...prevValue,
              min: e.value,
            }))
          }}
        />
      </div>
      <div className='p-inputgroup mt-2'>
        <span className='p-inputgroup-addon'>$</span>
        <InputNumber
          placeholder='max'
          value={values?.max}
          onChange={(e) => {
            setValues((prevValue) => ({
              ...prevValue,
              max: e.value,
            }))
          }}
        />
      </div>
    </>
  )
}

export const InputFieldTemplate = (props) => (
  <div className='p-inputgroup '>
    <span className='p-inputgroup-addon'>
      {props.icon ? (
        <i className={props.icon} />
      ) : (
        <i
          className='pi pi-angle-right
      '
        />
      )}
    </span>
    <InputText
      placeholder={
        props.placeholder
          ? props.placeholder
          : props.matchMode === 'gte'
          ? 'min'
          : props.matchMode === 'lte'
          ? 'max'
          : 'Select'
      }
      value={props.state !== null ? props.state : ''}
      type={props.type ? props.type : 'text'}
      onChange={(e) => props.stateHandler(e.target.value)}
    />
  </div>
)

export const DropDownTemplate = (props) => {
  return (
    <Dropdown
      value={props.state}
      onChange={(e) => props.stateHandler(e)}
      options={props.options}
      optionLabel='name'
      placeholder={props.placeholder ? props.placeholder : 'Select'}
      className='w-full md:w-14rem'
    />
  )
}

export const MultiSelectTemplate = (props) => (
  <MultiSelect
    value={props.state}
    onChange={(e) => props.stateHandler(e.value)}
    options={props.options}
    optionLabel='name'
    display='chip'
    placeholder={props.placeholder ? props.placeholder : 'Select'}
    className='w-full md:w-20rem'
  />
)
