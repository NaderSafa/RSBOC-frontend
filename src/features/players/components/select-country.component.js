import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import ReactCountryFlag from 'react-country-flag'
import server from '../../../server'

const SelectCountry = ({ selectedCountry, setSelectedCountry }) => {
  const [countries, setCountries] = useState()

  useEffect(() => {
    server
      .get('/country', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => setCountries(res.data.countries))
      .catch((error) => console.log(error))
  }, [])

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
        <ReactCountryFlag countryCode={option.alpha_2} className='mr-2' />
        <p className='p-0 m-0 text-sm'>{option.name}</p>
      </div>
    )
  }

  const panelFooterTemplate = () => {
    return (
      <div className='py-2 px-3'>
        {selectedCountry ? (
          <span>
            <b>{selectedCountry}</b> selected.
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
      optionValue='alpha_2'
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

export default SelectCountry
