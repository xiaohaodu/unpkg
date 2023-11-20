import { expect, test } from 'vitest'
import { readDirOrFileSize } from '../../server/utils'
test('fs', () => {
  expect(readDirOrFileSize('./test/fs/fs-dir-test')).toBe(30)
  expect(readDirOrFileSize('./node_modules/chalk') / Math.pow(10, 5)).toBe(
    0.43736,
  )
})
