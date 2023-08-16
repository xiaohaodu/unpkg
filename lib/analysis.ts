import fs from 'fs'
import path from 'path'
import option from './option'
class analysis {
  public root: string
  public prod: boolean
  public dependencies: object
  public devDependencies: object
  public dependencyTree: object
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
    this.unpkg()
  }
  public unpkg(): void {
    const data = fs.readFileSync(path.join(this.root, 'package.json'), {
      encoding: option.encoding,
    })
    const packageJson = JSON.parse(data)
    const { dependencies, devDependencies } = packageJson
    this.dependencies = dependencies
    this.devDependencies = devDependencies
  }
  public unpkg_dependencies(): void {
    for (const key in this.dependencies) {
      console.log(key)
    }
  }
  public unpkg_devDependencies(): void {}
}

export default analysis
