export const formatCurrency = (number) =>
  typeof number === 'number'
    ? number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : number

export const formatDate = (inputDate) => {
  if (!inputDate) {
    return ''
  }
  const date = new Date(inputDate)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

export const formatPercentage = (number) =>
  typeof number === 'number' ? `${number.toFixed(1)}%` : number

export const ToastPopUp = (name, severity, summary, msg) => {
  name.current.show({
    severity: severity,
    summary: summary,
    detail: msg,
  })
}
