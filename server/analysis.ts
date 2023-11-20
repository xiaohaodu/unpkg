import fs from 'fs'
import path from 'path'
import { config as option } from './config.js'
import semver from 'semver'
import { readDirOrFileSize } from './utils.js'
/**
 * @description npm包分析对象，目前支持解析通过npm install命令下载的node_modules
 */
class Analysis {
  // 分析根目录
  public root: string = option.root
  // 是否仅分析dependence
  public prod: boolean = option.prod
  // 是否分析层数深度——一级、二级...
  public deep: number = option.deep
  // 指定运行端口
  public port: number = option.port
  // 输出json文件目录
  public jsonDir: string = option.jsonDir
  // 输出json文件名字
  public jsonFileName: string = option.jsonFileName
  // 树状分析结构
  public analysisTreeStore: Analyser.TreeAnalyser = {
    dependencies: [],
    devDependencies: [],
    dependencyTree: [],
    devDependencyTree: [],
  }
  // npm分析图
  public analysisNpmStore: Analyser.NpmAnalyser = {
    nodes: [],
    edges: [],
  }
  // 已查找到的tree状存储
  public foundTreeStore: Analyser.FoundTreeStore = []
  // 已查找到的npm状存储
  public foundNpmStore: Analyser.FoundNpmStore = []

  // echarts 状内容
  public echartsFormatData: Analyser.TreeData = []

  public pkgUtil: 'npm' | 'pnpm' = 'npm'

  public constructor(
    root?: string,
    prod?: boolean,
    deep?: number,
    port?: number,
    jsonDir?: string,
    jsonFileName?: string,
  ) {
    const rootPath = fs.realpathSync(process.cwd(), option.encoding)
    const isExistJsonConfig = fs.existsSync(
      path.join(rootPath, option.configFileNameJson),
    )
    if (isExistJsonConfig) {
      const data = fs.readFileSync(
        path.join(rootPath, option.configFileNameJson),
        {
          encoding: option.encoding,
        },
      )
      const config = JSON.parse(data)
      this.root =
        (root ? path.join(rootPath, root) : '') ||
        (config?.root
          ? path.join(rootPath, config?.root)
          : path.join(rootPath, option?.root))
      this.prod = prod || config?.prod || option?.prod
      this.deep = deep || config?.deep || option?.deep
      this.port = port || config?.port || option?.port
      this.jsonDir = jsonDir || config?.jsonDir || option?.jsonDir
      this.jsonFileName =
        jsonFileName || config?.jsonFileName || option?.jsonFileName
    } else {
      this.root =
        (root ? path.join(rootPath, root) : '') ||
        path.join(rootPath, option?.root)
      this.prod = prod || option?.prod
      this.deep = deep || option?.deep
      this.jsonDir = jsonDir || option?.jsonDir
      this.jsonFileName = jsonFileName || option?.jsonFileName
    }
    const unpkg = this.unpkg(this.root)
    if (fs.existsSync(path.join(this.root, 'node_modules/.pnpm'))) {
      this.pkgUtil = 'pnpm'
    }
    if (!unpkg) {
      throw new Error(
        '请设置正确的工作路径，保证路径下含有node_modules和package.json',
      )
    }
    if (!this.jsonFileName.endsWith('.json')) {
      throw new Error('请设置正确的json输出文件名，文件名必须以.json结尾')
    }
    if (this.deep <= 0) {
      throw new Error('请设置正确的分析深度deep，必须>0')
    }
    //数据处理中的数据，便于处理，可读性好，信息丰富-格式相对灵活
    this.analysisTreeStore.dependencies = unpkg?.dependencies || []
    this.analysisTreeStore.devDependencies = unpkg?.devDependencies || []

    //格式化展示数据的初始化，便于后面数据处理后的挂载，用于直接返回前端渲染图表-格式相对固定，部分可灵活修改
    this.echartsFormatData[0] = {
      name: 'dependencies',
      children: [],
    }
    if (!this.prod) {
      this.echartsFormatData[1] = {
        name: 'devDependencies',
        children: [],
      }
    }
  }
  /**
   * @description 解析出package.json文件的dependencies和devDependencies和version
   * @param dirPath package.json 文件路径(包路径)
   * @returns Analyser.TreeNodeAnalysis
   */
  public unpkg(dirPath: string): Analyser.TreeNodeAnalysis | null {
    if (!fs.existsSync(path.join(dirPath, 'package.json'))) {
      return null
    } else {
      const data = fs.readFileSync(path.join(dirPath, 'package.json'), {
        encoding: option.encoding,
      })
      const size = readDirOrFileSize(dirPath)
      const packageJson = JSON.parse(data)
      const { dependencies, devDependencies, version } = packageJson
      return {
        dependencies: (() =>
          Object.keys(dependencies || {}).map((key) => ({
            name: key,
            version: dependencies[key],
          })))(),
        devDependencies: (() =>
          Object.keys(devDependencies || {}).map((key) => ({
            name: key,
            version: devDependencies[key],
          })))(),
        version,
        size,
      }
    }
  }
  /**
   * @description 解包dependencies对应的node_modules
   * @param dependencyTree 待挂载数据的MapTree——————便于处理数据，保存处理内容
   * @param dependencies 待解包的依赖列表对象
   * @param fullPath 可选 为undefined时为初次解包
   * @param current 可选 当前解包进度,待挂载数据的TreeData————展示数据的格式化，直接“输出”
   */
  public unpkg_dependencies(
    dependencyTree: Analyser.TreeNode[],
    dependencies: Analyser.TreeNodeInfo[],
    fullPath?: Analyser.TreeFullPath,
    current?: Analyser.TreeData,
  ): void {
    for (const { name, version } of dependencies) {
      if (!this.foundTreeStore.includes(name + version)) {
        const unpkg = this.unpkg_node_modules_handler(
          name,
          version,
          fullPath?.fullPath || '',
        )
        if (unpkg) {
          const analysis = {
            dependencies: unpkg.dependencies,
            dependencyTree: new Array<Analyser.TreeNode>(),
          }
          const parentNode: Analyser.TreeNodeInfo = {
            name,
            version,
          }
          const currentFullPath = {
            depend: fullPath?.depend || parentNode,
            fullPath: (fullPath?.fullPath || '.') + '/' + name,
          }
          dependencyTree.push({ node: parentNode, analysis: analysis })
          const currentChildren: Analyser.TreeData = []
          current?.push({
            ...parentNode,
            value: unpkg.size,
            path: currentFullPath.fullPath,
            children: currentChildren,
          })
          const nameToNumber = parseInt(
            name
              .split('')
              .reduce((pr, cu) =>
                (pr.charCodeAt(0) + cu.charCodeAt(0)).toString(),
              ),
          )
          const nameToNumberString = nameToNumber.toString(16).substring(0, 5)
          this.analysisNpmStore.nodes.push({
            color: '#' + nameToNumberString.padStart(6, nameToNumberString),
            label: name + ' version: ' + version,
            attributes: {},
            y: 0,
            x: 0,
            id: name + ' version: ' + version,
            size: unpkg.size,
          })
          if (fullPath) {
            this.analysisNpmStore.edges.push({
              sourceID:
                fullPath?.depend.name + ' version: ' + fullPath.depend.version,
              attributes: {},
              targetID: name + ' version: ' + version,
              size: 1,
            })
          }
          this.foundTreeStore.push(name + version)
          this.unpkg_dependencies(
            analysis.dependencyTree,
            analysis.dependencies,
            currentFullPath,
            currentChildren,
          )
        }
      }
    }
  }
  /**
   * @description 首次解包（从root工作目录下解包）
   * @param dependencyKey 依赖名
   * @param dependencyVersion 依赖版本限制(例如:^0.2.0)
   * @returns
   */
  public unpkg_node_modules_handler(
    dependencyKey: string,
    dependencyVersion: string,
    fullPath?: string,
  ): Analyser.TreeNodeAnalysis | null {
    if (this.pkgUtil === 'pnpm') {
      if (!fullPath || fullPath === '.') {
        const pnpmDir = fs.readdirSync(
          path.join(this.root, 'node_modules/.pnpm'),
        )
        const RexExp = /(@?[^@]+)@?([^_@]+)[_]?/g
        const match = pnpmDir.find((pnpm) => {
          const pnpmL = Array.from(pnpm.matchAll(RexExp))
          if (
            pnpmL[0][1] === dependencyKey.replace('/', '+') &&
            this.versionMatch(dependencyVersion, pnpmL[0][2])
          ) {
            return true
          }
        })

        if (match) {
          const unpkg = this.unpkg(
            path.join(
              this.root,
              'node_modules/.pnpm',
              match,
              'node_modules',
              dependencyKey,
            ),
          )
          return unpkg
        } else {
          return null
        }
      } else {
        const unpkg = this.unpkg_node_modules_handler(
          dependencyKey,
          dependencyVersion,
          undefined,
        )
        if (!unpkg) {
          console.log(
            'not found',
            dependencyKey,
            dependencyVersion,
            fullPath,
            '\n',
          )
        }
        return unpkg
      }
    } else {
      if (!fullPath || fullPath === '.') {
        if (
          !fs.existsSync(path.join(this.root, 'node_modules', dependencyKey))
        ) {
          return null
        }
        const unpkg = this.unpkg(
          path.join(this.root, 'node_modules', dependencyKey),
        )
        if (!unpkg) {
          return null
        }
        const flag = this.versionMatch(dependencyVersion, unpkg.version)
        if (flag) {
          return unpkg
        }
        return null
      } else {
        const fullPathList = fullPath.split('/')
        for (let i = 0; i < fullPathList.length; i++) {
          if (fullPathList[i][0] === '@') {
            fullPathList[i] += '/' + fullPathList[i + 1]
            fullPathList.splice(i + 1, 1)
          }
        }
        if (fullPathList.length > this.deep) {
          return null
        }
        const searchPath = fullPathList.pop() || ''
        if (
          !fs.existsSync(
            path.join(
              this.root,
              'node_modules',
              searchPath,
              'node_modules',
              dependencyKey,
            ),
          )
        ) {
          return this.unpkg_node_modules_handler(
            dependencyKey,
            dependencyVersion,
            fullPathList.join('/'),
          )
        }
        const unpkg = this.unpkg(
          path.join(
            this.root,
            'node_modules',
            searchPath,
            'node_modules',
            dependencyKey,
          ),
        )
        if (!unpkg) {
          return this.unpkg_node_modules_handler(
            dependencyKey,
            dependencyVersion,
            fullPathList.join('/'),
          )
        }
        const flag = this.versionMatch(dependencyVersion, unpkg.version)
        if (flag) {
          return unpkg
        }
        return this.unpkg_node_modules_handler(
          dependencyKey,
          dependencyVersion,
          fullPathList.join('/'),
        )
      }
    }
  }
  /**
   * @description 全局解包函数,封装了所有操作
   */
  public unpkg_node_modules(): void {
    this.unpkg_dependencies(
      this.analysisTreeStore.dependencyTree as Analyser.TreeNode[],
      this.analysisTreeStore.dependencies as Analyser.TreeNodeInfo[],
      undefined,
      this.echartsFormatData[0].children,
    )
    if (!this.prod) {
      this.unpkg_dependencies(
        this.analysisTreeStore.devDependencyTree as Analyser.TreeNode[],
        this.analysisTreeStore.devDependencies as Analyser.TreeNodeInfo[],
        undefined,
        this.echartsFormatData[1].children,
      )
    }
  }

  public dataToTreeAnalyser(): void {
    // 集成在unpkg函数中
  }
  public dataToNpmAnalyser(): void {}
  /**
   *
   * @param pkgVersion 从dependencies/devDependencies 中取出的版本限制 例如：^0.2.0
   * @param version 找到的npm包的package.json显示版本
   * @returns version是否符合pkgVersion的限制
   */
  public versionMatch(pkgVersion: string, version: string): boolean {
    return semver.satisfies(version, pkgVersion)
  }
  /**
   *
   * @param root
   * @param jsonDir
   * @param jsonFileName
   */
  public printJSON(
    root: string = this.root,
    jsonDir: string = this.jsonDir,
    jsonFileName: string = this.jsonFileName,
  ) {
    const output = path.join(root, jsonDir, jsonFileName)
    fs.mkdirSync(path.join(root, jsonDir), { recursive: true })
    fs.writeFileSync(output, JSON.stringify(this.echartsFormatData))
  }
  /**
   *
   * @param fullPath
   */
  public printJsonBash(
    fullPath: string = path.join(this.jsonDir, this.jsonFileName),
  ) {
    fs.mkdirSync(path.parse(path.join(this.root, fullPath)).dir, {
      recursive: true,
    })
    fs.writeFileSync(
      path.join(this.root, fullPath),
      JSON.stringify(this.echartsFormatData),
    )
  }
}
export default Analysis
