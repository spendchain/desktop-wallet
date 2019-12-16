import ledgerService from '../services/ledger'

export const setupLedgerRoutes = (backendServer) => {
  backendServer.route({
    method: 'GET',
    path: '/ledger/getWallet',
    handler: async (request, h) => {
      // try {
      return ledgerService.getWallet(request.query)
      // } catch (error) {
      //   console.log('POST getWallet error', error)
      // }
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/ledger/getPublicKey',
    handler: async (request, h) => {
      // try {
      return (await ledgerService.getWallet(request.query)).publicKey
      // } catch (error) {
      //   console.log('POST getPublicKey error', error)
      // }
    }
  })

  backendServer.route({
    method: 'POST',
    path: '/ledger/signTransaction',
    handler: async (request, h) => {
      // try {
      return ledgerService.signTransaction(request.payload)
      // } catch (error) {
      //   console.log('POST signTransaction error', error)
      // }
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/ledger/connect',
    handler: async (request, h) => {
      // try {
      return ledgerService.connect()
      // } catch (error) {
      //   console.log('POST connect error', error)
      // }
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/ledger/disconnect',
    handler: async (request, h) => {
      // try {
      return ledgerService.disconnect()
      // } catch (error) {
      //   console.log('POST disconnect error', error)
      // }
    }
  })

  backendServer.route({
    method: 'GET',
    path: '/ledger/isConnected',
    handler: async (request, h) => {
      // try {
      return ledgerService.isConnected()
      // } catch (error) {
      //   console.log('POST isConnected error', error)
      // }
    }
  })
}
