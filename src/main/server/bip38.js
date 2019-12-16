import { fork } from 'child_process'
import { resolve } from 'path'

const worker = fork(resolve(__dirname, '../workers/bip38-worker.js'))

export const setupBip38Routes = (backendServer) => {
  const onMessage = () => new Promise((resolve, reject) => {
    worker.on('message', message => {
      message.error ? reject(message.error) : resolve(message)
    })
  })

  backendServer.route({
    method: 'POST',
    path: '/bip38/decrypt',
    handler: async (request, h) => {
      // try {
      worker.send({
        bip38key: request.payload.bip38key,
        password: request.payload.password,
        wif: request.payload.wif
      })

      return onMessage()
      // } catch (error) {
      //   console.error('POST decrypt error', error)
      // }
    }
  })

  backendServer.route({
    method: 'POST',
    path: '/bip38/encrypt',
    handler: async (request, h) => {
      // try {
      worker.send({
        passphrase: request.payload.passphrase,
        password: request.payload.password,
        wif: request.payload.wif
      })

      return onMessage()
      // } catch (error) {
      //   console.error('POST encrypt error', error)
      // }
    }
  })
}
