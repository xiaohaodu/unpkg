import express from 'express'
import Analysis from '../lib/Analysis'
const server = express()

const port = 3000

server.get('/', (_, res) => {
  const analysis = new Analysis()
  analysis.unpkg_node_modules()
  console.log(analysis.analysisTreeMapStore)

  res.send(JSON.stringify(analysis.analysisTreeMapStore))
})
server.listen(port, () => {
  console.log('http://localhost:' + port)
})
