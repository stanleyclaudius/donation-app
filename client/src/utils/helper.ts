export const currencyFormatter = (amount: number) => {
  let formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  return formatter.format(amount).toString().slice(0, -3)
}

export const dateFormatter = (date: string) => {
  let result = ''

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const unformattedDate = date.substring(0, 10)
  const splittedDate = unformattedDate.split('-')
  
  result = splittedDate[2] + " " + month[Number(splittedDate[1]) - 1] + " " + splittedDate[0]
  
  return result
}