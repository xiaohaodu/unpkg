declare namespace Analyser {
  type TreeNode = {
    node?: TreeNodeInfo
    analysis?: TreeAnalyser
  }
  type TreeAnalyser = {
    dependencies?: TreeNodeInfo[]
    devDependencies?: TreeNodeInfo[]
    dependencyTree?: Array<TreeNode>
    devDependencyTree?: Array<TreeNode>
  }
  type TreeNodeInfo = {
    name: string
    version: string
  }
  type TreeNodeAnalysis = {
    dependencies: TreeNodeInfo[]
    devDependencies: TreeNodeInfo[]
    version: string
    size: number
  }
  type TreeFullPath = {
    depend: TreeNodeInfo
    fullPath: string
  }
  type FoundTreeStore = Array<string>
  //上述为处理中间所需数据结构

  //  tree数据展示格式化类型
  type TreeChunkData = Array<{
    name: string
    version?: string
    value?: number
    path?: string
    children: TreeChunkData
  }>

  /**—————————————————————————————————————————————————— */

  // npm数据展示格式化类型
  type NpmNode = {
    color: string
    label: string
    attributes: object
    y: number
    x: number
    id: string
    size: number
  }
  // npm数据展示格式化类型
  type NpmEdge = {
    sourceID: string
    attributes: object
    targetID: string
    size: number
  }
  // npm数据展示格式化类型
  type NpmAnalyser = {
    nodes: Array<NpmNode>
    edges: Array<NpmEdge>
  }

  // npm store levels
  type FoundNpmLevelStore = Array<number>
}
