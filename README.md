# npm-unpkg

## 这是一个node_modules分析工具,支持npm、pnpm等包管理工具的下载包分析

```bash
unpkg -h
> Usage: unpkg <command>[options]

> Options:
  -v, --version     output the version number
  -i, --info        information
  -r --root <path>  设置根路径
  -p --prod         设置是否仅分析生产环境依赖
  -d --deep <deep>  设置分析深度
  -a --analyse      开始分析
  -h, --help        display help for command
```

## Installation

```js
$ npm i -g npm-unpkg
$ npm i npm-unpkg
```

## Use

### 直接在命令行中使用

```js
npm-unpkg -a  /**或者*/ unpkg -a
//在项目package.json和node_modules文件所在路径调用
```

### 在项目中使用

> 测试中...

## 命令参数

### 使用帮助

```js
unpkg -h /**或者 */ unpkg
```

### 通过配置文件配置

```json
//.unpkg.json
{
  "root": ".", //string    package.json路径（分析路径）——默认为'.'
  "prod": false //boolean   是否仅分析生产依赖（dependence）——默认为false
}
```

### 在调用时配置

```js
unpkg -r . -p false -a
```
