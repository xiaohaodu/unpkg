import express from 'express'
import { AddressInfo } from 'net'
const Express = express()
Express.listen(3000)
const Express2 = express()
const Server = Express2.listen(3000)
Server.on('error', (e: any) => {
  console.log(e.code)
  Server.listen()
})
setImmediate(() => {
  console.log((Server.address() as AddressInfo).port)
})
