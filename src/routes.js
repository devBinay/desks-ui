function loadPagesAndComponents ({ createComponent, html, nothing, unsafeHTML, getStore, getRouter }) {
  return Promise.all([
    import('./pages/home.js'),
    import('./components/page-header-actions.js'),
    import('./components/desks-list-nav.js')
  ]).then(([{ createHomePage }, { createPageHeaderActions }, { createDesksListNav }]) => {
    createPageHeaderActions({ createComponent, html, nothing, getStore, getRouter })
    createDesksListNav({ createComponent, html, nothing, getStore, getRouter })
    createHomePage({ createComponent, html, nothing, unsafeHTML, getStore, getRouter })
  })
}

export function getRoutes ({ createComponent, html, nothing, unsafeHTML, getStore, getRouter }) {
  const outlets = {
    'page-header-actions': () => html`<desks-page-header-actions></desks-page-header-actions>`,
    'desks-list-nav': () => html`<desks-list-nav></desks-list-nav>`
  }

  const routes = [
    {
      path: '/desks',
      action (context, { deskId }) {
        return loadPagesAndComponents({ createComponent, html, nothing, unsafeHTML, getStore, getRouter })
          .then(() => {
            const store = getStore('mwp.apps.desks')
            store.dispatch('loadDesksIfNotLoaded', deskId)
          })
          .then(() => {
            if (deskId) {
              return html`<desks-home-page .deskId=${deskId}></desks-home-page>`
            }
            return html`<desks-home-page></desks-home-page>`
          })
      },
      componentBundles: ['data', 'forms']
    },
    {
      path: '/desks/:deskId/view',
      action (context, { deskId }) {
        return loadPagesAndComponents({ createComponent, html, nothing, unsafeHTML, getStore, getRouter })
          .then(() => {
            const store = getStore('mwp.apps.desks')
            store.dispatch('loadDesksIfNotLoaded', deskId)
          })
          .then(() => html`<desks-home-page .deskId=${deskId}></desks-home-page>`)
      },
      componentBundles: ['data', 'forms']
    }
  ]

  routes.forEach(r => (r.outlets = outlets))

  return routes
}
