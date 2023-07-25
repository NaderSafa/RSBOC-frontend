import React, { useEffect } from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { ScrollTop } from 'primereact/scrolltop'
const MainContentLayout = (props) => {
  useEffect(() => {
    if (props?.title) {
      document.title = `${props.title} | Speedball Hub`
    }
  }, [props?.title])

  const exportCSV = () => props.dt.current.exportCSV()

  const rightToolbarTemplate = () => (
    <Button
      label='Export CSV'
      icon='pi pi-upload'
      className='p-button-help'
      onClick={exportCSV}
      size='small'
      text
    />
  )

  return (
    <div className='page-content'>
      <div className='container-fluid'>
        <h2 className='fs-3 fw-bold mt-4 mb-4'>{props.title}</h2>

        <div>
          <div>
            {props.children}
            {props.dt && (
              <Toolbar
                className='mt-2 border-1'
                style={{ backgroundColor: '#f5f5f5', borderColor: '#ebebeb' }}
                end={rightToolbarTemplate}
              />
            )}
          </div>
        </div>
        <ScrollTop />
      </div>
    </div>
  )
}

export default MainContentLayout
