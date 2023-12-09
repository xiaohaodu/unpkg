import axios from 'axios'
import { baseUrl } from './http.js'
export function unpkgTreeChunkRequest() {
  return axios({
    method: 'get',
    url: `${baseUrl}/TreeChunkData`,
  })
}

export function unpkgRequestSample() {
  return axios({
    method: 'get',
    url: '/view/treeChunk.echarts.json',
  })
}

export function unpkgNpmRequest() {
  return axios({
    method: 'get',
    url: `${baseUrl}/NpmData`,
  })
}

export function unpkgNpmRequestSample() {
  return axios({
    method: 'get',
    url: '/view/npm.echarts.json',
  })
}

export function unpkgTreeLineRequest() {
  return axios({
    method: 'get',
    url: `${baseUrl}/TreeLineData`,
  })
}

export function unpkgTreeLineRequestSample() {
  return axios({
    method: 'get',
    url: '/view/treeLine.echarts.json',
  })
}
