import analysis from '../analysis'
import { expect, test } from 'vitest'
test('analysis', () => {
  new analysis().unpkg_dependencies()
  expect(1).toBe(1)
})
