#!/usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import { readFileSync } from 'fs'
import * as commander from 'commander'
import open from 'open'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import { generateServer } from '../server/index.js'
// import inquirer from 'inquirer'
// 创建新的 commander 实例
const program = new commander.Command()
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, '../package.json'), {
    encoding: 'utf-8',
  }),
)

program
  .name(Object.keys(pkg.bin)[0]) // 设置 usage 的 name
  .usage('<command>[options]') // 设置 usage 的 message
  .version(pkg.version, '-v, --version') // 设置 Version 命令
  .option('-i, --info', 'information', () => {
    console.log(
      chalk.blue('info: ') +
        '这是一个node_modules分析工具,支持npm、pnpm等包管理工具的下载包分析',
    )
  })
  .option('-r --root <path>', '设置根路径')
  .option('-p --prod', '设置是否仅分析生产环境依赖')
  .option('-d --deep <deep>', '设置分析深度')
  .option('-a --analyse', '开始分析')
  .action(() => {
    const option = program.opts()
    if (Reflect.ownKeys(option).length === 0) {
      program.outputHelp()
      console.log(
        '\r\n' +
          figlet.textSync('npm-unpkg', {
            font: 'Ghost',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            whitespaceBreak: true,
          }),
      )
    } else {
      if (option.analyse) {
        generateServer(option?.root, option?.prod, option?.deep)
        open('http://localhost:3000/view')
      }
    }
  })

program.parse(process.argv)
