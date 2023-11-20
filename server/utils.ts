import fs from 'fs'

export const readDirOrFileSize = (dir: string): number => {
  const dirStat = fs.statSync(dir)
  if (dirStat.isDirectory()) {
    const dirFiles = fs.readdirSync(dir)
    let size = 0
    if (dirFiles.length)
      for (const dirFile of dirFiles) {
        const dirPath = dir + '/' + dirFile
        size += readDirOrFileSize(dirPath)
      }
    return size
  } else {
    return dirStat.size || 0
  }
}

export const generateXYNoRepeat = () => {}
