import React, { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import '../../scss/custom/components/pharmacy-profile.scss'


const Dropdowns = ({ subbliers, setsupplierId }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  return (
    <Dropdown
      className='add-supplier'
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.value)}
      onBlur={(e) => {
        if (subbliers) {
          const singleSubbliers = subbliers.find(
            (option) => option.name === e.target.value
          )

          setsupplierId(singleSubbliers.supplierId)
        }
      }}
      options={subbliers}
      optionLabel='name'
      placeholder='Select a Supplier'
    />
  )
}

export default Dropdowns
