const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const FileWatcher = require("../../file-watcher")

const sleep = ms => new Promise(r => setTimeout(r, ms))

const platform = {
  CURRENT: process.platform,
  REGEX: process.platform == "win32"? /"--install-directory=(.*?)"/:/--install-directory=(.*?)( --|\n|$)/,
  COMMAND: process.platform == "win32"? "wmic process where caption='LeagueClientUx.exe' get commandline": "ps x -o args | grep 'LeagueClientUx'"
}

class LCConnector extends EventEmitter {
  constructor() {
    super()
    this.lockFilePath = false
    this.clientPath = false
    this.listening = false
    this.getProcessLoop = false
    this.fileWatcher = false
    this.getProcessInterval = 1000
    this.checkProcessInterval = 1000
    this.connected = false
    this.data = {
      protocol: "https",
      address: "127.0.0.1",
      port: -1,
      pid: -1,
      username: "riot",
      password: ""
    }
  }

  async removed() {
    if (this.connected) {
      this.connected = false
      this.emit("disconnect")
    }
  }

  async created() {
    this.connected = true
    const lockFileData = fs.readFileSync(this.lockFilePath).toString().split(":")

    this.data.pid = parseInt(lockFileData[1])
    this.data.port = parseInt(lockFileData[2])
    this.data.password = lockFileData[3]

    this.emit("connect", this.data)
  }

  async stop_watcher() {
    if (this.fileWatcher)
      this.fileWatcher.stop()
  }

  async watch_lockfile() {
    if (this.fileWatcher)
      return
    
    this.fileWatcher = new FileWatcher(this.lockFilePath)

    this.fileWatcher.on("create" || "change", () => this.created())
    this.fileWatcher.on("remove", () => this.removed())

    this.fileWatcher.start()
  }

  async get_path() {
    return new Promise( (resolve) => {
      exec(platform.COMMAND, (error, stdout, stderr) => {
        if (error || !stdout || stderr)
          return resolve()
  
        const processPath = stdout.match(platform.REGEX) || []
    
        this.clientPath = processPath[1]
        this.lockFilePath = path.join(this.clientPath, "lockfile")
        resolve(processPath[1])
      })
    })
  }

  async get_process() {
    while(!this.clientPath) {
      await this.get_path()
      await sleep(this.getProcessInterval)
    }
    return true
  }

  setGetProcessInterval(getProcessInterval) {
    this.getProcessInterval = getProcessInterval
  }

  async connect() {
    if (!["win32", "linux","darwin"].includes(platform.CURRENT))
      throw new Error(`Inavlid platform: ${platform.CURRENT}`)

    if (!this.listening) {
      this.listening = true

      await this.get_process()
      this.watch_lockfile()
    }
  }

  disconnect() {
    this.listening = false
    this.stop_watcher()
    clearTimeout(this.getProcessLoop)
    this.removed()
  }
}

module.exports = LCConnector