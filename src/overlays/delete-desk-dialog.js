export function createDeleteDeskDialog ({ html, nothing, getStore, getEvents, loadScript }) {
  return {
    store: getStore('mwp.apps.desks'),
    methods: {
      closeDialog (e) {
        if (e.detail.value === true) {
          const notification = document.querySelector('mosaic-notification')
          const currentDeskId = this.store.getters.currentDesk.id
          const targetDesk = this.store.getters.deskList
          const index = targetDesk.findIndex(targetDesk => targetDesk.id === currentDeskId)
          this.store.dispatch('deleteDesk', index)
          notification.success('The selected desk has been deleted successfully', '2000', 'close')
        }
      }
    },
    render () {
      if (JSON.stringify(this.store.getters.currentDesk) !== JSON.stringify(this.store.getters.defaultDesk)) {
        return html`
        <mosaic-dialog
              name="desks-delete-desk-dialog"
              type="danger"
              id="desks-delete-desk-dialog"
              header-title="Delete desk"
              color="danger"
              dialog="danger-dialog"
              confirm-text="Go ahead"
              dismiss-text="No thanks"
              onclose="${this.methods.closeDialog}"
            >
                  You are about to delete the current desk. This action cannot be reversed. Are you sure you want to continue?
            </mosaic-dialog>
          `
      }
    }
  }
}
