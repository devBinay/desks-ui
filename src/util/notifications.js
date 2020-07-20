export function showDangerNotification (msg) {
  const notifications = document.querySelector('mosaic-notification')
  if (notifications && notifications.danger) {
    notifications.danger(msg)
  } else {
    console.error(msg)
  }
}

export function showSuccessNotification (msg) {
  const notifications = document.querySelector('mosaic-notification')
  if (notifications && notifications.success) {
    notifications.success(msg)
  } else {
    console.log(msg)
  }
}
