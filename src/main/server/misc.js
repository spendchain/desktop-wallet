import packageJson from 'package-json'
import walletPackageJson from '../../../package.json'
import RssParser from 'rss-parser'

export const setupMiscRoutes = (backendServer) => {
  backendServer.route({
    method: 'POST',
    path: '/misc/getNpmPackageJson',
    handler: async (request, h) => {
      return packageJson(request.payload.name, request.payload.options || {})
    }
  })

  backendServer.route({
    method: 'POST',
    path: '/misc/getRssFeed',
    handler: async (request, h) => {
      const parser = new RssParser({
        'User-Agent': walletPackageJson.name
      })

      const feed = await parser.parseURL(request.payload.url)

      return feed.items
    }
  })
}
