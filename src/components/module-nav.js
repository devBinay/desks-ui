export function createModuleNav ({ createComponent, html, nothing, getStore }) {
  createComponent('desks-module-nav', {
    store: getStore('mwp.apps.desks'),
    methods: {
      deskClickHandler (deskId) {
        this.store.dispatch('loadDesksIfNotLoaded', deskId)
      }
    },
    render () {
      let buttons = nothing
      if (this.store.state.desks.apiData) {
        buttons = this.store.state.desks.apiData.desks.map(d => {
          return html`
            <mosaic-button onclick=${() => this.methods.deskClickHandler(d.id)}>${d.name}</mosaic-button>
          `
        })
      }

      return html`<style>
        desks-module-nav {
          all: inherit;
        }
      </style>
      <mosaic-title>Desks</mosaic-title>
      ${buttons}
      <mosaic-button icon="plus">New desk</mosaic-button>
      `
    }
  })
}
