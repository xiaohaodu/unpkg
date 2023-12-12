export const config = {
  root: '.',
  prod: false,
  deep: 100,
  configFileNameJson: '.unpkg.json',
  configFileNameJs: 'unpkg.js',
  encoding: <BufferEncoding>'utf8',
  jsonDir: 'NPM_UNPKG',
  jsonFileName: 'unpkg.analysis.json',
  port: 3000,
}

export function defineUnpkgConfig(expConfig: {
  root?: string
  prod?: boolean
  deep?: number
  jsonDir?: string
  jsonFileName?: string
  port?: number
}) {
  Object.assign(config, expConfig)
}
