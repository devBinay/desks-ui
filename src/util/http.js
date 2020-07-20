import { showDangerNotification } from './notifications.js'

const headers = {
  'Content-Type': 'application/json'
}

function handleErrors (res) {
  if (!res.ok) {
    throw Error(res.statusText)
  }
  return res
}

export function get (url) {
  return window.fetch(url, {
    method: 'GET',
    headers
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => {
      showDangerNotification(`Error Fetching data: ${e.message}`)
    })
}
