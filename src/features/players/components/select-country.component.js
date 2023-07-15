import React, { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import ReactCountryFlag from 'react-country-flag'

export default function SelectCountry({ selectedCountry, setSelectedCountry }) {
  const countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
  ]

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <ReactCountryFlag countryCode={option.code} className='mr-2' />
          <div>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const countryOptionTemplate = (option) => {
    return (
      <div className='flex align-items-center p-0'>
        <ReactCountryFlag countryCode={option.code} className='mr-2' />
        <p className='p-0 m-0 text-sm'>{option.name}</p>
      </div>
    )
  }

  const panelFooterTemplate = () => {
    return (
      <div className='py-2 px-3'>
        {selectedCountry ? (
          <span>
            <b>{selectedCountry.name}</b> selected.
          </span>
        ) : (
          'No country selected.'
        )}
      </div>
    )
  }

  return (
    <Dropdown
      value={selectedCountry}
      onChange={(e) => setSelectedCountry(e.value)}
      options={countries}
      optionLabel='name'
      optionValue='code'
      placeholder='Country'
      valueTemplate={selectedCountryTemplate}
      itemTemplate={countryOptionTemplate}
      className='w-full text-sm border-0 outline-none'
      panelFooterTemplate={panelFooterTemplate}
      filter
      filterPlaceholder='type...'
      pt={{
        root: {
          className: 'bg-transparent',
        },
        input: { className: 'p-0 m-0 text-sm bg-transparent font-semibold' },
        panel: {
          className: 'shadow-none text-sm w-12rem border-1 mt-1',
          style: { backgroundColor: '#f5f5f5', borderColor: '#ebebeb' },
        },
        itemGroup: { className: '' },
      }}
    />
  )
}
