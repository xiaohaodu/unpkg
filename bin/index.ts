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
import { generateServer } from '../server/server.js'
import axios from 'axios'
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
  .version(pkg.version, '-v, --version', '当前版本') // 设置 Version 命令
  .helpOption(true, '帮助信息')
  .option('-i, --info', 'information', () => {
    console.log(
      chalk.blue('info: ') +
        '这是一个node_modules分析工具,支持npm、pnpm等包管理工具的下载包分析',
    )
  })
  .option('-r, --root <path>', '设置根路径')
  .option('-p, --prod', '设置是否仅分析生产环境依赖')
  .option('-d, --deep <deep>', '设置分析深度')
  .option('-a, --analyse', '开始分析,网页展示')
  .option('-port, --port', '设置端口号')
  .option(
    '-json, --json [path]',
    '开始分析,输出json文件展示,[path]为可选项:设置json文件输出路径,如果不加path则按照json文件配置输出',
  )
  .action(async () => {
    try {
      const option = program.opts()
      // console.log(option)

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
        const { Server, Port } = await generateServer(
          option?.root,
          option?.prod,
          option?.deep,
          option?.port,
          option.json === true ? '' : path.parse(option.json || '').dir,
          option.json === true ? '' : option.json,
        )
        if (option?.analyse && option?.json) {
          open(`http://localhost:${Port}/view`)
          console.log(chalk.blue(`http://localhost:${Port}/view`))
          await axios.get(`http://localhost:${Port}/json`)
        } else if (option?.analyse) {
          open(`http://localhost:${Port}/view`)
          console.log(chalk.blue(`http://localhost:${Port}/view`))
        } else if (option?.json) {
          await axios.get(`http://localhost:${Port}/json`)
          Server.close()
        }
      }
    } catch (error) {
      console.warn(chalk.red(error))
    }
  })

program.parse(process.argv)
