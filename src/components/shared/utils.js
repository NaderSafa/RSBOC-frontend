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

// String Functions
export const removeExtraSpaces = (input) => {
  return input.replace(/\s+/g, ' ').trim()
}

export const trimText = (input, maxLength) => {
  if (input.length <= maxLength) {
    return input
  } else {
    return input.slice(0, maxLength).trim() + '...'
  }
}

export const capitalizeWords = (input) => {
  return input.replace(/\b\w/g, function (char) {
    return char.toUpperCase()
  })
}

export const extractNamesFromFullName = (fullName) => {
  const nameParts = fullName.split(' ')

  if (nameParts.length >= 2) {
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1]
    return firstName + ' ' + lastName
  } else {
    return fullName
  }
}

export const normalizeName = (fullName) =>
  extractNamesFromFullName(capitalizeWords(removeExtraSpaces(fullName)))

// array functions
export const createNumberSequence = (limit) => {
  const sequence = []

  for (let i = 1; i <= limit; i++) {
    sequence.push(i)
  }

  return sequence
}
