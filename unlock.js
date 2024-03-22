const fs = require('fs')
const path = require('path')

function copyDir (src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }

  let items = fs.readdirSync(src)
  items.forEach(item => {
    let itemPath = path.join(src, item)
    let info = fs.statSync(itemPath)

    if (info.isDirectory() && item !== 'node_modules') {
      // 跳过名为 "node_modules" 的文件夹
      copyDir(itemPath, path.join(dest, item)) // 递归调用，复制子目录
    } else if (info.isFile()) {
      let readStream = fs.createReadStream(itemPath, {
        encoding: 'utf8', // 可选，设置编码方式
        highWaterMark: 16384 // 可选，设置缓冲区大小
      })
      let writeStream = fs.createWriteStream(path.join(dest, item))
      readStream.on('error', error => {
        console.error(`读取文件 ${itemPath} 时发生错误: ${error}`)
      })
      readStream.pipe(writeStream)
      console.log(
        `正在处理第${items.indexOf(item) + 1}个文件，文件名为：${item}`
      )
    }
  })
  console.log('文件全部解码完成！')
}

const srcDir = process.argv[2]
const destDir = `${process.cwd()}/uncode_${srcDir}`
copyDir(srcDir, destDir)
