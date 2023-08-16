import fs from 'fs'
import path from 'path'
import option from './option'
class analysis {
  public root: string = ''
  public prod: boolean = false
  public analysisTreeMapStore: Analyser.treeAnalyser = new Map()
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
    this.analysisTreeMapStore.set('dependencies', unpkg.dependencies)
    this.analysisTreeMapStore.set('devDependencies', unpkg.devDependencies)
    this.analysisTreeMapStore.set('devDependencyTree', new Map())
    this.analysisTreeMapStore.set('dependencyTree', new Map())
  }
  public unpkg(dirPath: string): Analyser.treeObjectNodeList {
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
  public unpkg_dependencies(
    dependencyTree: Analyser.treeMapNode = this.analysisTreeMapStore.get(
      'dependencyTree',
    ) as Analyser.treeMapNode,
    dependencies: Analyser.treeObjectNode = this.analysisTreeMapStore.get(
      'dependencies',
    ) as Analyser.treeObjectNode,
  ): void {
    for (const key in dependencies) {
      const pkgSplitList = key.split('/')
      const unpkg = this.unpkg_node_modules_head(
        pkgSplitList,
        dependencies[key],
      ) as Analyser.treeObjectNodeList
      dependencyTree.set(
        {
          key: key,
          value: dependencies[key],
        },
        new Map()
          .set('dependencies', unpkg.dependencies)
          .set('devDependencies', unpkg.devDependencies),
      )
    }
    console.log(dependencyTree)
  }
  public unpkg_node_modules_head(
    dependencyKey: Array<string>,
    dependencyVersion: string,
  ): Analyser.treeObjectNodeList | void {
    const dirFiles = fs.readdirSync(path.join(this.root, 'node_modules'), {
      encoding: option.encoding,
      withFileTypes: true,
    })
    for (const dirent of dirFiles) {
      if (dirent.name === dependencyKey[0]) {
        const unpkg = this.unpkg(path.join(dirent.path, dirent.name))
        const flag = this.versionMatch(dependencyVersion, unpkg.version)
        if (flag) {
          return unpkg
        }
      }
    }
  }
  public unpkg_node_modules(): void {
    this.unpkg_dependencies(
      this.analysisTreeMapStore.get('dependencyTree') as Analyser.treeMapNode,
      this.analysisTreeMapStore.get('dependencies') as Analyser.treeObjectNode,
    )
    this.unpkg_dependencies(
      this.analysisTreeMapStore.get(
        'devDependencyTree',
      ) as Analyser.treeMapNode,
      this.analysisTreeMapStore.get(
        'devDependencies',
      ) as Analyser.treeObjectNode,
    )
  }
  public versionMatch(pkgVersion: string, version: string): boolean {
    const versionReg = /[1-9]\d?(\.([1-9]?\d)){2}/
    const versionMatch = (pkgVersion.match(versionReg) as RegExpMatchArray)[0]
    if (compareVersion(version, versionMatch)) {
      return true
    }
    return false
    /**
     * @param version1
     * @param version2
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
