import dayjs from 'dayjs'

export function formatPublicAddress(str) {
  if (str.length > 10) {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`
  } else {
    return str
  }
}

export function formatDate(dateObj) {
  return dayjs(dateObj).format('MMM D')
}

export function formatLongDate(dateObj) {
  return dayjs(dateObj).format('h A on MM/DD/YYYY')
}
