import cors from 'cors'
import express from 'express'
import Analysis from '../lib/analysis.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = express()
const port = 3000

export function generateServer(
  root: string,
  prod: boolean,
  deep: number,
  json: string,
) {
  json
  server.use(
    cors({
      origin: '*',
    }),
  )
  server.get('/data', (_, res) => {
    const analysis = new Analysis(root, prod, deep)
    analysis.unpkg_node_modules()
    res.send(JSON.stringify(analysis.echartsFormatData))
  })
  server.use('/view', express.static(path.join(__dirname, './public')))
  server.listen(port, () => {
    console.log('http://localhost:' + port + '/view')
  })
}
