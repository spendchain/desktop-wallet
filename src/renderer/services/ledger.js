import ky from 'ky'

export default {
  async getWallet ({ path }) {
    return ky.get('http://localhost:9081/ledger/getWallet', {
      searchParams: { path }
    }).json()
  },

  async getPublicKey ({ path }) {
    return ky.get('http://localhost:9081/ledger/getPublicKey', {
      searchParams: { path }
    }).json()
  },

  async signTransaction ({ path, transactionHex }) {
    return ky.post('http://localhost:9081/ledger/signTransaction', {
      json: { path, transactionHex }
    }).json()
  },

  async connect () {
    return ky.get('http://localhost:9081/ledger/connect').json()
  },

  async disconnect () {
    return ky.get('http://localhost:9081/ledger/disconnect').json()
  },

  async isConnected () {
    return ky.get('http://localhost:9081/ledger/isConnected').json()
  }
}
