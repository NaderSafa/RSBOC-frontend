import React, { forwardRef, useState } from 'react'
import AddEditMolecule from './AddEditMolecule'
import DeleteMolecule from './DeleteMolecule'

const ModifyMolecule = forwardRef((props, ref) => {
  let emptyMolecule = {
    name: '',
    source: '',
    drugIdentificationNo: null,
    paPercentage: null,
    startDate: null,
  }

  const [molecule, setMolecule] = useState(emptyMolecule)
  return (
    <>
      <AddEditMolecule
        ref={ref}
        getData={props.getData}
        molecule={molecule}
        setMolecule={setMolecule}
        emptyMolecule={emptyMolecule}
      />
      <DeleteMolecule
        ref={ref}
        getData={props.getData}
        molecule={molecule}
        setMolecule={setMolecule}
        emptyMolecule={emptyMolecule}
      />
    </>
  )
})

export default ModifyMolecule
