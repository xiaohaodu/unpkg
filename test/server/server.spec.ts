import express from 'express'
import { AddressInfo } from 'net'
import { test } from 'vitest'
test('server', () => {
  const Express = express()
  Express.listen(3000)
  const Express2 = express()
  const Server = Express2.listen(3000)
  Server.on('error', () => {
    Server.listen()
  })
  setImmediate(() => {
    console.warn('server test: ', (Server.address() as AddressInfo).port)
  })
})
