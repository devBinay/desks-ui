export function loadBaseApplets (use, mods = []) {
  const applets = {
    card: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/card/index.js').then(m => use(m.card)),
    chart: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/chart/index.js').then(m => use(m.chart)),
    metric: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/metric/index.js').then(m => use(m.metric)),
    post: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/post/index.js').then(m => use(m.post)),
    profile: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/profile/index.js').then(m => use(m.profile)),
    statistic: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/statistic/index.js').then(m => use(m.statistic)),
    table: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/table/index.js').then(m => use(m.table)),
    tile: () => import('https://cdn.svc.oneadvanced.com/mosaic-applet-components/0.6.0/components/tile/index.js').then(m => use(m.tile))
  }
  if (!mods.length) return Promise.resolve(mods)
  const appletPromises = []
  mods.forEach(m => {
    if (m.module.baseApplets) m.module.baseApplets.forEach(a => appletPromises.push(applets[a]()))
  })
  return Promise.all(appletPromises)
    .then(() => Promise.resolve(mods))
}
