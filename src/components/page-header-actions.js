import { getMarkDefaultAction } from '../actions/mark-default.js'

export function createPageHeaderActions ({ createComponent, html, nothing, getStore, getRouter }) {
  createComponent('desks-page-header-actions', {
    store: getStore('mwp.apps.desks'),
    router: getRouter(),
    get: {
      noDesks () {
        return !this.store.state.desks.apiData || this.store.state.desks.apiData.desks.length === 0
      }
    },
    methods: {
      markDefault: getMarkDefaultAction,
      showAddDialog () {
        const multiActionDialog = document.querySelector('#desk-action-dialog')
        multiActionDialog.headerTitle = 'Add desk'
        multiActionDialog.show()
      },
      showEditDialog () {
        const multiActionDialog = document.querySelector('#desk-action-dialog')
        multiActionDialog.headerTitle = 'Edit desk'
        multiActionDialog.show()
      },
      showCopyDialog () {
        const multiActionDialog = document.querySelector('#desk-action-dialog')
        multiActionDialog.headerTitle = 'Copy desk'
        multiActionDialog.show()
      },
      showDeleteDialog () {
        const deleteDeskDialog = document.querySelector('#desks-delete-desk-dialog')
        deleteDeskDialog.show()
      }
    },
    props: {
      isDefault: true
    },
    render () {
      this.props.isDefault = JSON.stringify(this.store.getters.currentDesk) === JSON.stringify(this.store.getters.defaultDesk)
      return html`
      <style>
        .desk-action-group .mc-btn__icon--toggle {
          display: none;
        }
        .desk-action-group mosaic-dropdown {
          margin-left: 5px;
        }
        .desk-action-group mosaic-dropdown .mc-dropdown__menu {
          overflow-x: hidden;
        }
        .desk-action-group #mark-default button {
          justify-content: space-between;
        }

      </style>
        <mosaic-button-group spaced class="desk-action-group">
          <mosaic-button color="light" tooltip="Delete desk" tooltip-placement="bottom" icon-only icon="trash" .disabled="${this.props.isDefault}" onclick="${this.methods.showDeleteDialog}"></mosaic-button>
          <mosaic-button color="light" tooltip="Copy desk" tooltip-placement="bottom" icon-only icon="copy" onclick="${this.methods.showCopyDialog}" .disabled="${this.get.noDesks}"></mosaic-button>
          <mosaic-button color="light" tooltip="Edit desk" tooltip-placement="bottom" icon-only icon="edit" onclick="${this.methods.showEditDialog}" .disabled="${this.get.noDesks}"></mosaic-button>
          <mosaic-dropdown color="light" icon="menu_2" icon-only dropdown-title="Dropdown">
           <mosaic-button icon="add" onclick="${this.methods.showAddDialog}">Add desk</mosaic-button>
           <mosaic-button icon="sent">Share desk</mosaic-button>
          <mosaic-button icon="search">Find desk</mosaic-button>
          <mosaic-dropdown-divider></mosaic-dropdown-divider>
          <mosaic-button
          id="mark-default"
          .disabled="${this.props.isDefault}"
          onclick="${() => this.methods.markDefault(this.store)}"
          icon="${this.props.isDefault ? 'checked_2' : 'stop'}"
          icon-right>Mark as default</mosaic-button>
        </mosaic-dropdown>
          <mosaic-button color="primary" .disabled="${this.get.noDesks}">Add applet</mosaic-button>
        </<mosaic-button-group>
      `
    }
  })
}
