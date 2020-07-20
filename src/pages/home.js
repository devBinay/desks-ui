import { createShellLayout } from '../components/layout.js'
import { createModuleNav } from '../components/module-nav.js'

export function createHomePage ({ createComponent, html, nothing, unsafeHTML, getStore, getRouter }) {
  // create components
  createShellLayout({ createComponent, html, nothing, unsafeHTML, getStore })
  createModuleNav({ createComponent, html, nothing, getStore })

  // create home page component
  createComponent('desks-home-page', {
    store: {
      desks: getStore('mwp.apps.desks'),
      layout: getStore('mosaic.shell.layout')
    },
    props: {
      deskId: {
        type: String
      }
    },
    mounted () {
      if (this.store.desks.getters.currentDesk) {
        const deskTitle = this.store.desks.getters.currentDesk.name
        if (this.store.layout.getters.pageTitle !== deskTitle) {
          this.store.layout.dispatch('setPageTitle', deskTitle)
        }
      } else {
        this.store.layout.dispatch('setPageTitle', 'Desks')
      }
    },
    render () {
      let content = html`<mosaic-placeholder-text-block rows="5"></mosaic-placeholder-text-block>`
      if (this.store.desks.state.desks.loaded) {
        content = nothing
      }
      if (this.store.desks.getters.currentDesk) {
        content = html`<desks-layout desk-id=${this.props.deskId}></desks-layout>`
      }

      return html`
        <mosaic-shell-page>
          <div>${content}</div>
        </mosaic-shell-page>
      `
    }
  })
}
