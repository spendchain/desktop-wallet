import { PLUGINS } from '@config'
import chunk from 'lodash/chunk'
import ky from 'ky'

const CHUNKSIZE = 50

class NpmAdapter {
  constructor () {
    this.baseUrl = 'https://registry.npmjs.com/'
  }

  async all (app) {
    let packageData = []
    const plugins = []

    let from = 0
    let totalCount = 0
    const size = 250

    while (!totalCount || plugins.length < totalCount) {
      const pluginResponse = await this.fetchPlugins({
        from,
        size
      })

      plugins.push(...pluginResponse.plugins)

      totalCount = pluginResponse.totalCount
      from = from + size
    }

    console.log('NpmAdapter all plugins', plugins)

    for (const pluginChunk of chunk(plugins, CHUNKSIZE)) {
      const requests = []

      for (const plugin of pluginChunk) {
        requests.push(await app.misc_getNpmPackageJson(plugin.name, { fullMetadata: true }))
      }

      const results = await Promise.all(requests)
      packageData = packageData.concat(results)
    }

    console.log('NpmAdapter all packageData', packageData)

    return packageData
  }

  async fetchPlugins (options = {}) {
    const keywords = PLUGINS.keywords.join(' ')

    const body = await ky('-/v1/search', {
      searchParams: {
        text: `keywords:${keywords}`,
        from: options.from || 0,
        size: options.size || 250,
        t: Date.now()
      },
      prefixUrl: this.baseUrl
    }).json()

    return {
      plugins: body.objects.map(plugin => plugin.package),
      totalCount: body.total
    }
  }
}

export default new NpmAdapter()
