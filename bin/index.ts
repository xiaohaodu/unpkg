#!/usr/bin/env node
import * as pkg from '../package.json'
import * as commander from 'commander'
// import chalk from 'chalk'
// import figlet from "figlet"
// import inquirer from 'inquirer'
// 创建新的 commander 实例
const program = new commander.Command()

program
  .name(Object.keys(pkg.bin)[0]) // 设置 usage 的 name
  .usage('<command>[options]') // 设置 usage 的 message
  .version(pkg.version, '-v, --version') // 设置 Version 命令
  .option(
    '-i, --info',
    '这是一个node_modules分析工具,目前支持npm install的下载包分析',
  )
  .action((source, destination) => {
    console.log(source, destination)
  })

program.parse(process.argv)
const option = program.opts()
if (Reflect.ownKeys(option).length === 0) {
  program.outputHelp()
}
