import express from 'express'
import { AddressInfo } from 'net'
import { test } from 'vitest'
test('server', () => {
  const Express = express()
  const Server = Express.listen(3000)
  const Express2 = express()
  const Server2 = Express2.listen(3000)
  Server.on('error', () => {
    Server.listen()
  })
  Server2.on('error', () => {
    Server2.listen()
  })
  setImmediate(() => {
    console.warn('server test: ', (Server.address() as AddressInfo).port)
  })
})
