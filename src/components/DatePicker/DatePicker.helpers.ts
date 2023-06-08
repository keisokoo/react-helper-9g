export const extractNumber = (value: string): string => {
  return value
    .split('')
    .filter((character) => /\d/.test(character))
    .join('')
}
