function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

function generate (length = 8) {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '1234567890'
  const charset = letters + letters.toUpperCase() + numbers
  let r = ''
  for (let i = 0; i < length; i++) {
    r += randomElement(charset)
  }
  return r
}

/**
 * Generate a unique identifier
 * @param {string} prefix The identifier prefix
 * @returns {string} The generated identifier
 * @example
 * generateId('button') // returns button-gh76ghF3
 */
export function generateId (prefix) {
  return `${prefix ? prefix + '-' : ''}${generate()}`
}
