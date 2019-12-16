import ky from 'ky'
import { request } from 'stream-http'

const client = ky.extend({ request, stream: false })

export default client
