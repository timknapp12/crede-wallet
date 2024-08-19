export const removeWhitSpace = (name = '') => name?.replace(/\s/g, '')

const splitDisplayName = displayName => displayName?.split(' ')

export const getInitials = (displayName = '') => {
  const split = splitDisplayName(displayName)
  const initials = `${split?.[0]?.charAt(0) ?? ''}${split?.[1]?.charAt(0) ?? ''}`
  return initials
}
