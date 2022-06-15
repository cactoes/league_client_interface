const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const child = require('child_process')
const FileWatcher = require("../../file-watcher")

class LCConnector extends EventEmitter {
  constructor() {
    super()
    this.LCIPath = false
  }

  async pathFromProcess() {
    return new Promise((resolve) => {
      // get the install path of league client
      child.exec("WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline", (error, stdout, stderr) => {
        // if there was an error or we didnt get anything return nothing
        if (error || !stdout || stderr)
          return resolve()
  
        // parse the path from the output
        const processPath = stdout.match(/"--install-directory=(.*?)"/) || []
        
        // return the install path
        return resolve(processPath[1])
      })
    })
  }

  startLockFileWatcher() {
    // check if we already have a lock file watcher
    if (this.lockFileWatcher)
      return
    
    // get the lock file path
    const LFPath = path.join(this.LCIPath, "lockfile")

    // create the lock file wacther and set it to the lock file path
    this.lockFileWatcher = new FileWatcher(LFPath)

    // on file create or change
    this.lockFileWatcher.on("create" || "change", () => this.onFileCreated(LFPath))

    // on file removed
    this.lockFileWatcher.on("remove", this.onFileRemoved.bind(this))

    // start 'watching' the file
    this.lockFileWatcher.start()
  }

  stopLockFileWatcher() {
    if (this.lockFileWatcher)
      this.lockFileWatcher.stop()
  }
  
  async startProcWatcher() {
    // get the process path
    return this.pathFromProcess().then((LCIPath) => {
      // if we have a path
      if (LCIPath) {
        // save the path
        this.LCIPath = LCIPath

        // stop the Loop
        this.stopProcWatcher()

        // start watching the lock file
        this.startLockFileWatcher()

        // break out of the loop
        return
      }

      // if procWatcher doesnt exist then create it and start looping
      if (!this.procWatcher)
        this.procWatcher = setInterval(this.startProcWatcher.bind(this), 1000)
    })
  }

  stopProcWatcher() {
    clearInterval(this.procWatcher)
  }

  onFileCreated(LCIPath) {
    // get the lockfile data and parse it
    const lockFileData = fs.readFileSync(LCIPath).toString().split(":")
    
    // the connect event and send the lockfile data along with it
    this.emit("connect", {
      protocol: lockFileData[4],
      address: '127.0.0.1',
      port: parseInt(lockFileData[2]),
      username: 'riot',
      password: lockFileData[3]
    })
  }

  onFileRemoved() {
    // emit the disconnect event
    this.emit("disconnect")
  }

  connect() {
    // start the proccess watcher
    this.startProcWatcher()
  }


  disconnect() {
    // stop the proccess watcher
    this.stopProcWatcher()

    // stop the lock file watcher
    this.stopLockFileWatcher()

    // trigger event 
    this.onFileRemoved()
  }
}

module.exports = LCConnector