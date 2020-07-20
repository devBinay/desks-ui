/* eslint-disable */
export function createShellLayout ({ createComponent, html, nothing, unsafeHTML, getStore }) {
  createComponent('desks-layout', {
    store: getStore('mwp.apps.desks'),
    methods: {
      getProps (props) {
        if (!props) return ''
        const ps = Object.keys(props).map(k => `${k}="${props[k]}"`).join(' ')
        return ps && ps !== '' ? ` ${ps}` : ''
      },
      getTag (tag) {
        return '<' + tag + '></' + tag + '>'
      }
    },
    render () {
      if (!this.store.state.desks.loaded) return nothing
      const currentDesk = this.store.getters.currentDesk
      const layout = `<mosaic-grid${this.methods.getProps(currentDesk.layout.grid.props)}>
${currentDesk.layout.applets.map(a => {
        return `<mosaic-grid-item${this.methods.getProps(a.props)}>
  ${this.methods.getTag(a.tag)}
</mosaic-grid-item>`
      }).join('')}
</mosaic-grid>`
      return html`<div>${unsafeHTML(layout)}</div>`
    }
  })
}
