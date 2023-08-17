import fs from 'fs'
import path from 'path'
import option from './option'
/**
 * @description npm包分析对象，目前支持解析通过npm install命令下载的node_modules
 */
class analysis {
  public root: string = ''
  public prod: boolean = false
  public analysisTreeMapStore: Analyser.treeAnalyser = new Map()
  public foundMapStore: Analyser.foundMapStore = new Map()
  public constructor() {
    const rootPath = fs.realpathSync(process.cwd(), option.encoding)
    const isExist = fs.existsSync(path.join(rootPath, option.configFileName))
    if (isExist) {
      const data = fs.readFileSync(path.join(rootPath, option.configFileName), {
        encoding: option.encoding,
      })
      const config = JSON.parse(data)
      this.root = config.root
        ? path.join(rootPath, config.root)
        : path.join(rootPath, option.root)
      this.prod = config.prod || option.prod
    } else {
      this.root = path.join(rootPath, option.root)
      this.prod = option.prod
    }
    const unpkg = this.unpkg(this.root)
    this.analysisTreeMapStore.set('dependencies', unpkg!.dependencies)
    this.analysisTreeMapStore.set('devDependencies', unpkg!.devDependencies)
    this.analysisTreeMapStore.set('devDependencyTree', new Map())
    this.analysisTreeMapStore.set('dependencyTree', new Map())
  }
  /**
   * @description 解析出package.json文件的dependencies和devDependencies和version
   * @param dirPath package.json 文件路径
   * @returns Analyser.treeObjectNodeList
   */
  public unpkg(dirPath: string): Analyser.treeObjectNodeList | void {
    if (!fs.existsSync(path.join(dirPath, 'package.json'))) {
      return
    }
    const data = fs.readFileSync(path.join(dirPath, 'package.json'), {
      encoding: option.encoding,
    })
    const packageJson = JSON.parse(data)
    const { dependencies, devDependencies, version } = packageJson

    return {
      dependencies,
      devDependencies,
      version,
    }
  }
  /**
   * @description 解包dependencies对应的node_modules
   * @param dependencyTree 待挂载数据的MapTree
   * @param dependencies 待解包的依赖列表对象
   */
  public unpkg_dependencies(
    dependencyTree: Analyser.treeMapNode,
    dependencies: Analyser.treeObjectNode,
  ): void {
    for (const key in dependencies) {
      const pkgSplitList = key.split('/')
      if (this.foundMapStore.has(key)) continue
      const unpkg = this.unpkg_node_modules_head(
        pkgSplitList,
        dependencies[key],
      )
      if (!unpkg) {
        console.log('unpkg', pkgSplitList, dependencies[key], key, unpkg)
        continue
      }

      const map = new Map()
        .set('dependencies', unpkg.dependencies)
        .set('dependencyTree', new Map())
      dependencyTree.set(
        {
          key: key,
          value: dependencies[key],
        },
        map,
      )
      this.foundMapStore.set(key, dependencies[key])
      this.unpkg_dependencies(
        map.get('dependencyTree'),
        map.get('dependencies'),
      )
    }
  }
  /**
   * @description 首次解包（从root工作目录下解包）
   * @param dependencyKey 依赖名
   * @param dependencyVersion 依赖版本限制(例如:^0.2.0)
   * @returns
   */
  public unpkg_node_modules_head(
    dependencyKey: Array<string>,
    dependencyVersion: string,
  ): Analyser.treeObjectNodeList | void {
    if (!fs.existsSync(path.join(this.root, 'node_modules'))) return
    const dirFiles = fs.readdirSync(path.join(this.root, 'node_modules'), {
      encoding: option.encoding,
      withFileTypes: true,
    })
    for (const dirent of dirFiles) {
      if (dirent.name === dependencyKey[0]) {
        const unpkg = this.unpkg(path.join(dirent.path, dirent.name))
        if (!unpkg) {
          continue
        }
        const flag = this.versionMatch(dependencyVersion, unpkg.version)
        if (flag) {
          return unpkg
        }
      }
    }
  }
  /**
   * @description 全局解包函数,封装了所有操作
   */
  public unpkg_node_modules(): void {
    this.unpkg_dependencies(
      this.analysisTreeMapStore.get('dependencyTree') as Analyser.treeMapNode,
      this.analysisTreeMapStore.get('dependencies') as Analyser.treeObjectNode,
    )
    // this.unpkg_dependencies(
    //   this.analysisTreeMapStore.get(
    //     'devDependencyTree',
    //   ) as Analyser.treeMapNode,
    //   this.analysisTreeMapStore.get(
    //     'devDependencies',
    //   ) as Analyser.treeObjectNode,
    // )
    console.log(this.analysisTreeMapStore.get('dependencyTree'))
  }
  /**
   *
   * @param pkgVersion 从dependencies/devDependencies 中取出的版本限制 例如：^0.2.0
   * @param version 找到的npm包的package.json显示版本
   * @returns version是否符合pkgVersion的限制
   */
  public versionMatch(pkgVersion: string, version: string): boolean {
    const versionReg = /[1-9]?\d(\.([1-9]?\d)){2}/
    const temp = pkgVersion.match(versionReg)
    if (!temp) {
      console.warn(pkgVersion, version)
      return false
    }
    const versionMatch = temp[0]
    if (compareVersion(version, versionMatch)) {
      return true
    }
    return false
    /**
     * @param version1 从dependencies/devDependencies 中取出的版本限制 例如：^0.2.0
     * @param version2 找到的npm包的package.json显示版本
     * @returns boolean
     * @description 判断version1是否大于等于version2
     */
    function compareVersion(version1: string, version2: string): boolean {
      const version11 = version1.split('.').map((value) => parseInt(value))
      const version22 = version2.split('.').map((value) => parseInt(value))
      for (const i in version11) {
        if (version11[i] < version22[i]) {
          return false
        }
      }
      return true
    }
  }
}

export default analysis
