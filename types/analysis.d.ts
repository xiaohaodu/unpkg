declare namespace Analyser {
  type treeObjectNodeList = {
    dependencies: object
    devDependencies: object
    version: string
  }
  type treeMapNode = Map<object, treeAnalyser>
  type treeAnalyser = Map<string, treeMapNode | object>
}
