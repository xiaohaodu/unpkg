import axios from 'axios'
import { baseUrl } from './http.js'
export function unpkgRequest() {
  return axios({
    method: 'get',
    url: `${baseUrl}/data`,
  })
}

export function unpkgRequestSample() {
  return axios({
    method: 'get',
    url: '/public/dist.tree.json',
  })
}
