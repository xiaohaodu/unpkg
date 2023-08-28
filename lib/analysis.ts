import fs from 'fs'
import path from 'path'
import option from './option.js'
import semver from 'semver'
/**
 * @description npm包分析对象，目前支持解析通过npm install命令下载的node_modules
 */
class Analysis {
  public root: string = ''
  public prod: boolean = false
  public analysisTreeStore: Analyser.treeAnalyser = {
    dependencies: [],
    devDependencies: [],
    dependencyTree: [],
    devDependencyTree: [],
  }
  public foundStore: Analyser.foundStore = []
  public echartsFormatData: Array<any> = []
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
    this.analysisTreeStore.dependencies = unpkg!.dependencies
    this.analysisTreeStore.devDependencies = unpkg!.devDependencies

    this.echartsFormatData[0] = {
      name: 'dependencies',
      value: 1,
      children: [],
    }
    this.echartsFormatData[1] = {
      name: 'devDependencies',
      value: 1,
      children: [],
    }
  }
  /**
   * @description 解析出package.json文件的dependencies和devDependencies和version
   * @param dirPath package.json 文件路径
   * @returns Analyser.treeObjectNodeList
   */
  public unpkg(dirPath: string): Analyser.treeObjectNodeList | null {
    if (!fs.existsSync(path.join(dirPath, 'package.json'))) {
      return null
    }
    const data = fs.readFileSync(path.join(dirPath, 'package.json'), {
      encoding: option.encoding,
    })
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
    }
  }
  /**
   * @description 解包dependencies对应的node_modules
   * @param dependencyTree 待挂载数据的MapTree
   * @param dependencies 待解包的依赖列表对象
   */
  public unpkg_dependencies(
    dependencyTree: Analyser.treeNode[],
    dependencies: Analyser.treeObjectNode[],
    fullPath?: Analyser.treeFullPath,
    current?: any[],
  ): void {
    for (const { name, version } of dependencies) {
      if (this.foundStore.includes(name + version)) continue
      const unpkg = this.unpkg_node_modules_head(
        name,
        version,
        fullPath?.fullPath || '',
      )
      if (!unpkg) {
        continue
      }
      const analysis = {
        dependencies: unpkg.dependencies,
        dependencyTree: [],
      }
      const parentNode: Analyser.treeObjectNode = {
        name,
        version,
      }
      const currentFullPath = {
        depend: fullPath?.depend || parentNode,
        fullPath: (fullPath?.fullPath || '.') + '/' + name,
      }
      dependencyTree.push({ node: parentNode, analysis: analysis })
      const currentChildren: Array<any> = []
      current?.push({
        ...parentNode,
        value: 1,
        path: currentFullPath.fullPath,
        children: currentChildren,
      })
      this.foundStore.push(name + version)
      this.unpkg_dependencies(
        analysis.dependencyTree,
        analysis.dependencies,
        currentFullPath,
        currentChildren,
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
    dependencyKey: string,
    dependencyVersion: string,
    fullPath: string,
  ): Analyser.treeObjectNodeList | null {
    if (!fullPath || fullPath === '.') {
      if (!fs.existsSync(path.join(this.root, 'node_modules', dependencyKey))) {
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
        return this.unpkg_node_modules_head(
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
        return this.unpkg_node_modules_head(
          dependencyKey,
          dependencyVersion,
          fullPathList.join('/'),
        )
      }
      const flag = this.versionMatch(dependencyVersion, unpkg.version)
      if (flag) {
        return unpkg
      }
      return this.unpkg_node_modules_head(
        dependencyKey,
        dependencyVersion,
        fullPathList.join('/'),
      )
    }
  }
  /**
   * @description 全局解包函数,封装了所有操作
   */
  public unpkg_node_modules(): void {
    this.unpkg_dependencies(
      this.analysisTreeStore.dependencyTree as Analyser.treeNode[],
      this.analysisTreeStore.dependencies as Analyser.treeObjectNode[],
      undefined,
      this.echartsFormatData[0].children,
    )
    this.unpkg_dependencies(
      this.analysisTreeStore.devDependencyTree as Analyser.treeNode[],
      this.analysisTreeStore.devDependencies as Analyser.treeObjectNode[],
      undefined,
      this.echartsFormatData[1].children,
    )
  }
  /**
   *
   * @param pkgVersion 从dependencies/devDependencies 中取出的版本限制 例如：^0.2.0
   * @param version 找到的npm包的package.json显示版本
   * @returns version是否符合pkgVersion的限制
   */
  public versionMatch(pkgVersion: string, version: string): boolean {
    return semver.satisfies(version, pkgVersion)
  }
}

export default Analysis
