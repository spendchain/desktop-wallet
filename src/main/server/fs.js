import FsProxy from '../proxies/fs'

export const setupFsRoutes = (backendServer) => {
  backendServer.route({
    method: 'GET',
    path: '/fs/getHomeDir',
    handler: async (request, h) => {
      return FsProxy.getHomeDir()
    }
  })

  backendServer.route({
    method: 'POST',
    path: '/fs/ensureDirSync',
    handler: async (request, h) => {
      return FsProxy.ensureDirSync(request.payload.path)
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/fs/readFileSync',
    handler: async (request, h) => {
      const fileContents = FsProxy.readFileSync(request.query.path).toString('base64')
      const response = h.response(fileContents)
      response.type('text/plain')

      return response
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/fs/readdirSync',
    handler: async (request, h) => {
      return FsProxy.readdirSync(request.query.path)
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/fs/existsSync',
    handler: async (request, h) => {
      return FsProxy.existsSync(request.query.path)
    }
  })

  backendServer.route({
    method: 'DELETE',
    path: '/fs/trash',
    handler: async (request, h) => {
      return FsProxy.trash(request.query.path)
    }
  })
}
