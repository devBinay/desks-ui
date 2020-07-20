import { slugify } from '../util/slugify.js'

export function creatDeskActionDialog ({ html, nothing, getStore, getEvents, loadScript }) {
  return {
    store: getStore('mwp.apps.desks'),
    props: {
      namePersist: ''
    },
    methods: {
      closeDialog (e) {
        e.target.reset()
        e.target.headerTitle = 'Add desk'
      },
      submitDialog (e) {
        const dialog = e.target
        const title = dialog.headerTitle
        const currentDeskId = this.store.getters.currentDesk ? this.store.getters.currentDesk.id : null
        let data
        if (title === 'Add desk') {
          data = e.detail.data
        } else if (title === 'Edit desk' || title === 'Copy desk') {
          const dt = new Date().toJSON()
          data = { ...e.detail.data, id: currentDeskId, updatedOn: dt, slug: slugify(e.detail.data.name) }
        }

        const duplicates = this.methods.checkDuplicateDesk(data.name)
        if ((duplicates > 0 && (title === 'Add desk' || title === 'Copy desk')) ||
            (duplicates > 0 && title === 'Edit desk' && this.props.namePersist !== data.name) ||
            (duplicates > 1 && title === 'Edit desk' && this.props.namePersist === data.name)) {
          const fSheet = document.querySelector('#addDeskDuplicateNameWarning')
          const deskName = document.querySelector('#addDeskName input')
          fSheet.show()
          fSheet.addEventListener('close', (e) => {
            if (e.detail.value === true) { // if agreed to continue with same name
              this.methods.onSuccessfulSubmit(data, dialog)
            } else {
              deskName.focus() // if wish to rename duplicate name
            }
          })
        } else {
          this.methods.onSuccessfulSubmit(data, dialog) // if entered unique name
        }
      },
      checkDuplicateDesk (currentDeskName) {
        const desks = this.store.state.desks.apiData.desks
        const duplicates = desks.filter(d => currentDeskName === d.name)
        if (duplicates.length > 0) return duplicates.length
      },
      onSuccessfulSubmit (data, dialog) {
        if (dialog.headerTitle === 'Add desk' || dialog.headerTitle === 'Copy desk') {
          this.store.dispatch('addDesk', data)
        } else if (dialog.headerTitle === 'Edit desk') {
          this.store.dispatch('editDesk', data)
        }
        dialog.close()
      },
      showDialog (e) {
        const dialog = e.target
        const title = e.target.headerTitle
        const currentDesk = this.store.getters.currentDesk
        const defaultDesk = this.store.getters.defaultDesk
        const name = dialog.querySelector('[name="name"]')
        const description = dialog.querySelector('[name="description"] textarea')
        const access = dialog.querySelector('[name="access"]')
        const defaultToggle = dialog.querySelector('[name="default"]')
        access.value = 'private'

        if (title === 'Edit desk' || title === 'Copy desk') { // for edit and copy action
          this.props.namePersist = currentDesk.name
          name.value = currentDesk.name
          description.value = currentDesk.description
          access.value = currentDesk.access
          if (title === 'Edit desk') { // retain default choice
            defaultToggle.checked = JSON.stringify(currentDesk) === JSON.stringify(defaultDesk)
            defaultToggle.style.pointerEvents = defaultToggle.checked ? 'none' : 'all'
            defaultToggle.querySelector('.state').style.opacity = defaultToggle.checked ? '0.5' : '1'
          } else { // clear default choice
            defaultToggle.checked = false
            defaultToggle.style.pointerEvents = 'all'
          }
        } else { // clear default choice
          defaultToggle.checked = false
          defaultToggle.style.pointerEvents = 'all'
          defaultToggle.querySelector('.state').style.opacity = '1'
        }
      }
    },
    render () {
      return html`
        <mosaic-form-dialog
          name="desk-action-dialog"
          type="input"
          id="desk-action-dialog"
          header-title="Add desk"
          dismiss-text="Cancel"
          confirm-text="Save"
          onsubmit="${this.methods.submitDialog}"
          onclose="${this.methods.closeDialog}"
          onshow="${this.methods.showDialog}"
        >
        <mosaic-text-input
        id="addDeskName"
        name="name"
        required
        block
        label="Name"
        maxlength="255"
        valid-text="This is some valid text"
        invalid-text="This is some invalid text">
      </mosaic-text-input>
        <mosaic-textarea
        name="description"
        block
        label="Description"
        maxlength="500"
        rows="4"
        character-count
        placeholder="Describe your new desk..."
        invalid-text="This is some invalid text">
    </mosaic-textarea>
      <mosaic-radio-group id="access" value="private" button label="Access" name="access">
        <mosaic-radio color="success" label="Private" value="private" help-text="Only you will see this desk"></mosaic-radio>
        <mosaic-radio color="success" label="Public" value="public" help-text="Anyone can find this desk"></mosaic-radio>
    </mosaic-radio-group>
    <mosaic-form-dialog-footer>
    <mosaic-toggle
      name="default"
      label="Make this my default desk"
      icon="checked_2" color="success"
      value="deskSetDefault"
      >
    </mosaic-toggle>
    </mosaic-form-dialog-footer>
    <mosaic-footer-sheet
      dismiss-text="No"
      confirm-text="Yes"
      overlay
      id="addDeskDuplicateNameWarning"
      color="warning"
      message="A desk already exists with the same name. Do you want to proceed with this name ?">
    </mosaic-footer-sheet>
    </mosaic-form-dialog>
      `
    }
  }
}
