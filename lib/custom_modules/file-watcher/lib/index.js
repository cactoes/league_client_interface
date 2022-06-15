const { EventEmitter } = require("events")
const fs = require('fs')

class FileWatcher extends EventEmitter {
  constructor(path) {
    super()
    this.targetFile = path
    this.currentFileSize = 0
    this.previousFileSize = 0
  }

  stop() {
    if (this.fileWatcherLoop)
      clearInterval(this.fileWatcherLoop)
  }

  start() {
    // update prev size
    this.previousFileSize = this.currentFileSize

    // update current size
    this.currentFileSize = fs.existsSync(this.targetFile)? fs.readFileSync(this.targetFile).toString().length:0

    // was the file created
    if (this.currentFileSize > 0 && this.previousFileSize == 0)
      this.emit("create", this.targetFile)

    // was the file edited, with a change in string length
    if (this.currentFileSize !== this.previousFileSize && this.currentFileSize > 0)
      this.emit("change", this.targetFile)

    // was the file removed
    if (this.currentFileSize == 0)
      this.emit("remove")

    // loop if fileWatcher doesnt exist
    this.fileWatcherLoop = this.fileWatcherLoop || setInterval(this.watch.bind(this, this.targetFile), 1000)
  }
}

module.exports = FileWatcher