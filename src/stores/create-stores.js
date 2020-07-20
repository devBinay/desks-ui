import { createDeskStore } from './desks.js'

export function createStores ({ getStoreManager, getStore, use, createPersist, getRouter }) {
  const storeManager = getStoreManager()
  storeManager.addStore('mwp.apps.desks', createDeskStore({ getStore, use, createPersist, getRouter }))
}
