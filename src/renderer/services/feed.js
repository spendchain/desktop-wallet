import ky from 'ky'

export default {
  /**
   * Fetches and parses the RSS of the feed URL and returns its entries
   * @param {String} url
   * @return {Array} array of items of the feed
   */
  async fetchItems (url) {
    return ky.post('http://localhost:9081/misc/getRssFeed', {
      json: { url }
    }).json()
  }
}
