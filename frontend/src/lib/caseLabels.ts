const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const formatSpecimenLabel = (index: number) => `Prélèvement ${index + 1}`

export const formatBlockLabel = (index: number) => {
  let label = ''
  let cursor = index
  do {
    label = alphabet[cursor % 26] + label
    cursor = Math.floor(cursor / 26) - 1
  } while (cursor >= 0)
  return `Bloc ${label}`
}

export const formatSlideLabel = (index: number) => `Lame ${index + 1}`
