import analysis from '../analysis'
import { expect, test } from 'vitest'
test('analysis', () => {
  new analysis().unpkg_node_modules()
  expect(1).toBe(1)
})
