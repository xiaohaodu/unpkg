import Analysis from '../../server/analysis'
import { describe, expect, test } from 'vitest'
import fs from 'fs'
import path from 'path'
describe('Analysis', () => {
  test('output analysis json', () => {
    const an = new Analysis()
    an.unpkg_node_modules()
    fs.writeFileSync(
      path.join(__dirname, './analysis.npm.json'),
      JSON.stringify(an.analysisNpmData),
    )
    fs.writeFileSync(
      path.join(__dirname, './analysis.json'),
      JSON.stringify(an.analysisTreeStore),
    )
    fs.writeFileSync(
      path.join(__dirname, './analysis.treeChunk.json'),
      JSON.stringify(an.echartsTreeChunkData),
    )
    expect(1).toBe(1)
  })
  test('analysis.npm.json coordinate set', () => {})
})
