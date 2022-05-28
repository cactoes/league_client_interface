const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const child = require('child_process');
const FileWatcher = require("../../file-watcher")

class LCConnector extends EventEmitter {

  static s_LCPathFromProcess() {
    return new Promise(resolve => {
      const INSTALL_DIR_REGEX = /"--install-directory=(.*?)"/;
      child.exec("WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline", (err, stdout, stderr) => {
        if (err || !stdout || stderr) {
          return resolve();
        };

        const installPath = stdout.match(INSTALL_DIR_REGEX) || [];
        return resolve(installPath[1]);
      });
    });
  };

  static s_isValidPath(LCPath) {
    if (!LCPath) {
      return false;
    };

    const isValidPath = fs.existsSync(path.join(LCPath, "LeagueClient.exe")) && fs.existsSync(path.join(LCPath, 'Config'));

    return isValidPath;
  };

  constructor(executablePath) {
    super();

    if (executablePath) {
      this.p_LCPath = path.dirname(path.normalize(executablePath));
    };
  };

  p_initLockFileWatcher() {
    if (this.p_lockFileWatcher) {
      return;
    };

    const lockFilePath = path.join(this.p_LCPath, "lockfile");
    this.p_lockFileWatcher = new FileWatcher();

    this.p_lockFileWatcher.on("add" || "change", this.p_onFileCreated.bind(this));
    this.p_lockFileWatcher.on("unlink", this.p_onFileRemoved.bind(this));
    
    this.p_lockFileWatcher.watch(lockFilePath);
  };

  p_clearLockFileWatcher() {
    if (this.p_lockFileWatcher) {
      this.p_lockFileWatcher.close();
    };
  };

  p_initProcessWatcher() {
    return LCConnector.s_LCPathFromProcess().then(LCPath => {
      if (LCPath) {
        this.p_LCPath = LCPath;
        this.p_clearProcessWatcher();
        this.p_initLockFileWatcher();
        return;
      };

      if (!this.p_processWatcher) {
        this.p_processWatcher = setInterval(this.p_initProcessWatcher.bind(this), 1000);
      };
    });
  };

  p_clearProcessWatcher() {
    clearInterval(this.p_processWatcher);
  };

  p_onFileCreated(LCPath) {
    const data = fs.readFileSync(LCPath).toString().split(":")
    return this.emit("connect", {
      protocol: data[4],
      address: '127.0.0.1',
      port: parseInt(data[2]),
      username: 'riot',
      password: data[3]
    });
  };

  p_onFileRemoved() {
    return this.emit("disconect")
  };

  connect() {
    if (LCConnector.s_isValidPath(this.p_LCPath)) {
      return this.p_initLockFileWatcher();
    };

    this.p_initProcessWatcher();
  };

  disconnect() {
    this.p_clearProcessWatcher();
    this.p_clearLockFileWatcher();
    this.p_onFileRemoved();
  };
};

module.exports = LCConnector;