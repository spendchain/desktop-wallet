import ky from 'ky'

export default {
  methods: {
    async misc_getNpmPackageJson (name, options) {
      return ky.post('http://localhost:9081/misc/getNpmPackageJson', {
        json: { name, options }
      }).json()
    }
  }
}
