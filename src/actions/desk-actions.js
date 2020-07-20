export function getDeskActions (getOverlay) {
  return function () {
    getOverlay('desk-action-dialog')
      .then((dialog) => {
        dialog.show()
      })
  }
}
