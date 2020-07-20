export function getMarkDefaultAction (store) {
  const currentDesk = store.getters.currentDesk
  store.dispatch('markDefaultDesk', currentDesk)
  const notification = document.querySelector('mosaic-notification')
  notification.success('Current desk marked default sucessfully', '2000', 'close')
}
