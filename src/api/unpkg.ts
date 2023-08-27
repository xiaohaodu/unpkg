import axios from 'axios'
import { baseUrl } from './http'
export function unpkgRequest() {
  return axios({
    method: 'get',
    url: baseUrl,
  })
}

export function unpkgRequestSample() {
  return axios({
    method: 'get',
    url: '/public/dist.tree.json',
  })
}
