export function objectHasValue (object, value) {
  if (!object) return false

  return Object.values(object).some(function (val) {
    if (val === value) {
      return true
    }
    if (val && typeof val === 'object') {
      return objectHasValue(val, value)
    }
    if (val && Array.isArray(val)) {
      return val.some((obj) => {
        return objectHasValue(obj, value)
      })
    }
  })
}
