import { describe, expect, test } from 'vitest'
import { readDirOrFileSize } from '../../server/utils'
import fs from 'fs'
describe('fs', () => {
  test('readDirOrFileSize', () => {
    expect(readDirOrFileSize('./test/fs/fs-dir-test')).toBe(38)
    expect(readDirOrFileSize('./node_modules/chalk'))
    expect(readDirOrFileSize('./node_modules/axios')).toBe(1797704)
  })
  test('fs link', () => {
    const dir = './node_modules/.pnpm/mime-types@2.1.35/node_modules/mime-db'
    const stat = fs.statSync(dir)
    console.log(stat.isDirectory())
    console.log(readDirOrFileSize(dir) / 1024)
  })
})
