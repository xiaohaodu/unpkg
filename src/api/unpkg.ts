import axios from 'axios'
import { baseUrl } from './http'
export function unpkgRequest() {
  return axios({
    method: 'get',
    url: baseUrl,
  })
}
