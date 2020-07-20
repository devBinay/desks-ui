export function createDesksListNav ({ createComponent, html, nothing, getStore, getRouter }) {
  createComponent('desks-list-nav', {
    store: getStore('mwp.apps.desks'),
    router: getRouter(),
    methods: {
      navigateTo (path) {
        this.router.push(path)
      }
    },
    render () {
      if (this.store.getters.deskList.length === 0) return nothing
      return html`
        ${this.store.getters.deskList.map(d => html`<mosaic-button onclick="${() => this.methods.navigateTo(d.path)}" icon="circle" data-desk-id="${d.id}">${d.name}</mosaic-button>`)}
      `
    }
  })
}
