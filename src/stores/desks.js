import { get } from '../util/http.js'
import { generateId } from '../util/generate-id.js'
import { slugify } from '../util/slugify.js'
import { objectHasValue } from '../util/object-has-value.js'

export function createDeskStore ({ getStore, use, createPersist, getRouter }) {
  return {
    persist: createPersist('mwp.apps.desks', 'local'),
    initialState: {
      desks: {
        loaded: false,
        apiData: null,
        currentDesk: null,
        error: null,
        applets: null
      }
    },
    actions: {
      loadDesksIfNotLoaded (context, deskId) {
        if (!context.state.desks.loaded) {
          context.dispatch('loadDesks', deskId)
        } else if (context.state.desks.loaded && deskId &&
          ((context.state.desks.currentDesk && context.state.desks.currentDesk.slug !== deskId) || !context.state.desks.currentDesk)) {
          const currentDesk = context.state.desks.apiData.desks.find(x => x.slug === deskId)
          if (currentDesk) {
            context.dispatch('loadModulesForDesk', { data: context.state.desks.apiData, desk: currentDesk })
              .then(() => {
                context.commit('setCurrentDesk', currentDesk)
                const layoutStore = getStore('mosaic.shell.layout')
                layoutStore.dispatch('setPageTitle', context.getters.currentDesk.name)
              })
          } else {
            throw new Error(`Desk not found: ${deskId}`)
          }
        } else if (context.state.desks.loaded &&
          !deskId &&
          context.state.desks.apiData.defaultDesk &&
          context.state.desks.apiData.desks.find(d => d.slug === context.state.desks.apiData.defaultDesk.slug && d.id === context.state.desks.apiData.defaultDesk.id)) {
          const pathname = getRouter().location.pathname
          if (pathname === '/desks') {
            getRouter().push(`/desks/${context.state.desks.apiData.defaultDesk.slug}/view`)
          }
        }
      },
      loadDesks (context, deskId) {
        let url = '/api/user-desks'
        if (window.mosaicShellUserDesks) url = window.mosaicShellUserDesks
        get(url)
          .then(data => {
            let desk = null
            if (deskId) desk = data.desks.find(x => x.slug === deskId)
            // if (data.defaultDesk) desk = data.desks.find(x => x.slug === data.defaultDesk)
            return context.dispatch('loadModulesForDesk', { data, desk })
          })
          .then(({ data, desk }) => {
            const d = { ...context.state.desks, loaded: true, apiData: data, currentDesk: desk }
            context.commit('setDesks', d)

            // set page title if we have a desk
            if (desk) {
              const layoutStore = getStore('mosaic.shell.layout')
              layoutStore.dispatch('setPageTitle', desk.name)
            }

            const pathname = getRouter().location.pathname
            if (pathname === '/desks') {
              if (!desk && data.defaultDesk && data.desks.find(d => d.slug === data.defaultDesk)) {
                console.log('no desk specified so use default desk', data.defaultDesk)
                getRouter().push(`/desks/${data.defaultDesk}/view`)
              } else {
                console.log('desk specified', desk)
              }
            }
          })
          .catch(e => {
            const d = { ...context.state.desks, loaded: true, error: e }
            context.commit('setDesks', d)
          })
      },
      loadModulesForDesk (context, { data, desk }) {
        if (!desk) return Promise.resolve({ data, desk })
        const bootstrapStore = getStore('mosaic.shell.bootstrap')
        const modules = {}
        bootstrapStore.state.bootstrap.modules.forEach(m => {
          if (m.applets) {
            // find the applets for this desk
            desk.layout.applets.forEach(a => {
              if (objectHasValue(m.applets, a.tag) && !modules[m.module]) {
                modules[m.module] = m
              }
            })
          }
        })
        return Promise.all(Object.keys(modules).map(m => bootstrapStore.dispatch('loadModule', m)))
          .then(() => ({ data, desk }))
      },
      addDesk (context, payload) {
        const apiData = { ...context.state.desks.apiData }
        const dt = new Date().toJSON()
        const desk = {
          id: generateId('desk'),
          name: payload.name,
          slug: slugify(payload.name),
          default: payload.default,
          createdOn: dt,
          updatedOn: dt,
          description: payload.description,
          access: payload.access,
          layout: {
            grid: {
              props: {
                'fr-columns': 6,
                'fr-rows': 4,
                gap: '15px'
              }
            },
            applets: []
          }
        }
        apiData.desks.push(desk)
        const d = { ...context.state.desks, apiData }
        context.commit('setDesks', d)
        getRouter().push(`/desks/${desk.slug}/view`)
        if (payload.default) context.commit('setDefaultDesk', desk)
      },
      deleteDesk (context, payload) {
        const apiData = { ...context.state.desks.apiData }
        apiData.desks.splice(payload, 1)
        const nextFocus = apiData.desks.length === payload ? payload - 1 : payload
        const d = { ...context.state.desks, apiData }
        context.commit('setDesks', d)
        getRouter().push(`/desks/${apiData.desks[nextFocus].slug}/view`)
      },
      editDesk (context, payload) {
        const desks = context.state.desks.apiData.desks
        const targetDeskId = desks.findIndex(x => x.id === payload.id)
        const updatedDesk = { ...desks[targetDeskId], ...payload, slug: slugify(payload.name) }
        desks[targetDeskId] = updatedDesk
        if (context.getters.currentDesk.id === payload.id) {
          const layout = context.getters.currentDesk.layout
          const newCurrentDesk = { ...updatedDesk, layout }
          context.commit('setCurrentDesk', newCurrentDesk)
        }
        if (payload.default) context.commit('setDefaultDesk', context.getters.currentDesk)
        const apiData = { ...context.state.desks.apiData, desks }
        const d = { ...context.state.desks, apiData }
        context.commit('setDesks', d)
        getRouter().push(`/desks/${updatedDesk.slug}/view`)
      },
      markDefaultDesk (context, payload) {
        context.commit('setDefaultDesk', payload)
      }
    },
    mutations: {
      setDesks (state, payload) {
        state.desks = payload
        return state
      },
      setCurrentDesk (state, payload) {
        const desks = { ...state.desks, currentDesk: payload }
        state.desks = desks
        return state
      },
      setDefaultDesk (state, payload) {
        state.desks.apiData.defaultDesk = payload
        return state
      }
    },
    getters: {
      currentDesk (state) {
        if (state.desks.loaded && state.desks.currentDesk) {
          return state.desks.currentDesk
        }
        return null
      },
      deskList (state) {
        if (!state.desks.loaded) return []
        return state.desks.apiData.desks.map(d => {
          return {
            name: d.name,
            id: d.id,
            path: `/desks/${d.slug}/view`
          }
        })
      },
      defaultDesk (state) {
        if (state.desks.loaded && state.desks.apiData.defaultDesk) {
          return state.desks.apiData.defaultDesk
        }
        return null
      }
    }
  }
}

// icon: d.icon ?? 'desktop'
