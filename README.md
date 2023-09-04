# npm-unpkg

## 这是一个node_modules分析工具,支持npm、pnpm等包管理工具的下载包分析

```bash
unpkg -h
Usage: unpkg <command>[options]

Options:
  -v, --version         当前版本
  -i, --info            information
  -r, --root <path>     设置根路径
  -p, --prod            设置是否仅分析生产环境依赖
  -d, --deep <deep>     设置分析深度
  -a, --analyse         开始分析,网页展示
  -port, --port         设置端口号
  -json, --json [path]  开始分析,输出json文件展示,[path]为可选项:设置json文件输出路径,如果不加path则按照json文件配置输出
  -h, --help            display help for command
```

## Installation

```js
/**全局安装的话可以直接使用 */
$ npm i -g npm-unpkg
/**如果非全局安装的话可以在package.json文件中配置命令使用 */
$ npm i npm-unpkg
```

## Use

### 直接在命令行中使用

```c
/**在项目package.json和node_modules文件所在路径调用 */
/**方式1 */
npm-unpkg -a
/**方式2 */
unpkg -a
```

### 在项目中使用

```js
import * as unpkg from 'npm-unpkg'
```

## 命令参数

### 使用帮助

```c
/**方式1 */
unpkg -h
/**方式2 */
unpkg
```

### 通过配置文件配置

`.unpkg.json`

```json
{
  "root": ".",
  "prod": false,
  "deep": 100,
  "jsonDir": "unpkgJSON",
  "jsonFileName": "unpkg.analysis.json",
  "port": 3000
}
```
