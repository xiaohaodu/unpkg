module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'perf', // 性能优化
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'docs', // 文档注释
        'test', // 增加测试
        'refactor', // 重构、优化(既不增加新功能，也不是修复bug)
        'build', // 打包
        'ci', // 更改持续集成软件的配置文件和package中的scripts命令，例如scopes: Travis, Circle等
        'chore', // 变更构建流程或辅助工具
        'revert', // 回退
        'release', // 发版
        'wip',
        'workflow',
        'types',
      ],
    ],
  },
}
