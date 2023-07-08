import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { formatCurrency, formatPercentage } from '../shared/utils'
import { formatDate } from '../shared/utils'
import { useContext } from 'react'
import { AuthenticationContext } from '../../Auth/authentication.context'

export default function OrderDetailsHeader(props) {
  const [order] = useState([props.order])

  const { isAdmin } = useContext(AuthenticationContext)

  // BODY TEMPLATES
  const totalInvoiceBodyTemplate = (order) =>
    formatCurrency(order.totalInvoiceAmount)
  const orderDateBodyTemplate = (order) => formatDate(order.orderDate)

  const paPercentageBodyTemplate = (order) =>
    formatCurrency(order.totalInvoicePa)

  const totalPaPercentageBodyTemplate = (order) =>
    formatPercentage(order.totalInvoicePaPercentage)

  return (
    <div className='card mb-5'>
      <DataTable showGridlines value={order} tableStyle={{ minWidth: '50rem' }}>
        <Column
          rowSpan={2}
          header='Account Number'
          field='customerAccountCode'
        />
        {isAdmin && (
          <Column header='Account Name' rowSpan={2} field='customer' />
        )}
        <Column header='Supplier' field='supplier.name' rowSpan={2} />
        <Column header='Order Number' rowSpan={2} field='supplierInvoiceNo' />
        <Column
          header='Order Date'
          rowSpan={2}
          field='orderDate'
          body={orderDateBodyTemplate}
        />
        <Column
          header='Order Total'
          rowSpan={2}
          field='totalInvoiceAmount'
          body={totalInvoiceBodyTemplate}
        />
        <Column
          header='PA Amount'
          rowSpan={2}
          field='totalInvoicePa'
          body={paPercentageBodyTemplate}
        />
        <Column
          header='PA Percentage'
          rowSpan={2}
          field='totalInvoicePaPercentage'
          body={totalPaPercentageBodyTemplate}
        />
      </DataTable>
    </div>
  )
}
