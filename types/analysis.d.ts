declare namespace Analyser {
  type treeObjectNodeList = {
    dependencies: treeObjectNode[]
    devDependencies: treeObjectNode[]
    version: string
  }
  // Map<treeObjectNode, treeAnalyser>
  type treeNode = {
    node?: treeObjectNode
    analysis?: treeAnalyser
  }
  type treeAnalyser = {
    // string, treeMapNode | treeObjectNode
    dependencies?: treeObjectNode[]
    devDependencies?: treeObjectNode[]
    dependencyTree?: Array<treeNode>
    devDependencyTree?: Array<treeNode>
  }
  type treeObjectNode = {
    name: string
    version: string
  }
  type treeFullPath = {
    depend: {
      name: string
      version: string
    }
    fullPath: string
  }
  type foundStore = Array<string>
}
