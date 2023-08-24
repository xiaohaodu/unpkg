import Analysis from '../Analysis'
import { expect, test } from 'vitest'
test('Analysis', () => {
  new Analysis().unpkg_node_modules()
  expect(1).toBe(1)
})
