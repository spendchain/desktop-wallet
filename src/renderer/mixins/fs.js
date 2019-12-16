import ky from 'ky'

export default {
  methods: {
    async fs_getHomeDir () {
      return ky.get('http://localhost:9081/fs/getHomeDir').text()
    },

    async fs_ensureDirSync (path) {
      return ky.post('http://localhost:9081/fs/ensureDirSync', {
        json: { path }
      })
    },

    async fs_readFileSync (path) {
      const fileContents = await ky.get('http://localhost:9081/fs/readFileSync', {
        searchParams: { path }
      }).text()

      return Buffer.from(fileContents, 'base64')
    },

    fs_readdirSync (path) {
      return ky.get('http://localhost:9081/fs/readdirSync', {
        searchParams: { path }
      }).json()
    },

    // fs_lstatSync (path) {
    //   return ky.get('http://localhost:9081/fs/lstatSync', {
    //     searchParams: { path }
    //   }).json()
    // },

    fs_existsSync (path) {
      return ky.get('http://localhost:9081/fs/existsSync', {
        searchParams: { path }
      }).json()
    },

    fs_trash (path) {
      return ky.delete('http://localhost:9081/fs/trash', {
        json: { path }
      }).json()
    }
  }
}
