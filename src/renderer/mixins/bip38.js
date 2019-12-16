import ky from 'ky'

export default {
  methods: {
    async bip38_encrypt ({ passphrase, password, wif }) {
      const response = await ky.post('http://localhost:9081/bip38/encrypt', {
        json: { passphrase, password, wif }
      }).json()

      if (response.error) {
        throw new Error(response.error)
      }

      return response
    },

    async bip38_decrypt ({ bip38key, password, wif }) {
      const response = await ky.post('http://localhost:9081/bip38/decrypt', {
        json: { bip38key, password, wif }
      }).json()

      if (response.error) {
        throw new Error(response.error)
      }

      return response
    }
  }
}
