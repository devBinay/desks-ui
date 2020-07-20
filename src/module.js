import { module as shellComponentsModule } from 'https://cdn.svc.oneadvanced.com/mosaic-shell-components/0.5.0/module.js'
import { createStores } from './stores/create-stores.js'
import { getRoutes } from './routes.js'
import { creatDeskActionDialog } from './overlays/multi-action-desk-dialog.js'
import { createDeleteDeskDialog } from './overlays/delete-desk-dialog.js'
import { getDeskActions } from './actions/desk-actions.js'

const components = {
  addDeskDialog: { tag: 'desk-action-dialog', creator: creatDeskActionDialog },
  deleteDeskDialog: { tag: 'desks-delete-desk-dialog', creator: createDeleteDeskDialog }
}

// Export the module object that is invoked by the `use` function
export const module = {
  create (helpers) {
    // use the shell components
    helpers.use(shellComponentsModule)

    // create stores
    createStores(helpers)

    // add routes dynamically
    const router = helpers.getRouter()
    router.addRoutes(getRoutes(helpers))

    // actions
    helpers.addActions({
      deskActions: getDeskActions(helpers.getOverlay)
    })

    // create components
    Object.keys(components).forEach(k => helpers.createComponent(components[k].tag, components[k].creator(helpers)))
  }
}
