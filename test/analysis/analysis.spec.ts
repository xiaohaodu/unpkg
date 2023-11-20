import Analysis from '../../server/analysis'
import { expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
test('Analysis', () => {
  const an = new Analysis()
  an.unpkg_node_modules()
  fs.writeFileSync(
    path.join(__dirname, './analysis.npm.json'),
    JSON.stringify(an.analysisNpmStore),
  )
  fs.writeFileSync(
    path.join(__dirname, './analysis.json'),
    JSON.stringify(an.analysisTreeStore),
  )
  fs.writeFileSync(
    path.join(__dirname, './analysis.format.json'),
    JSON.stringify(an.echartsFormatData),
  )
  expect(1).toBe(1)
})
