import Analysis from '../Analysis'
import { expect, test } from 'vitest'
test('Analysis', () => {
  const an = new Analysis()
  an.unpkg_node_modules()
  console.log(an.analysisTreeMapStore)

  expect(1).toBe(1)
})
