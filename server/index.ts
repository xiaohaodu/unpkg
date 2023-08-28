import cors from 'cors'
import express from 'express'
import Analysis from '../lib/Analysis'
const server = express()

const port = 3000
server.use(
  cors({
    origin: '*',
  }),
)
server.get('/', (_, res) => {
  const analysis = new Analysis()
  analysis.unpkg_node_modules()
  res.send(JSON.stringify(analysis.echartsFormatData))
})

server.listen(port, () => {
  console.log('http://localhost:' + port)
})
