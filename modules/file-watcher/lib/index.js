const { EventEmitter } = require("events")
const fs = require('fs');

class FileWatcher extends EventEmitter {
  constructor() {
    super();
    this.p_currentSize = this.p_previousSize = 0;
  };

  close() {
    if (this.p_fileWatcher) {
      clearInterval(this.p_fileWatcher);
    };
  };

  watch(filePath) {
    this.p_previousSize = this.p_currentSize;
    this.p_currentSize = fs.existsSync(filePath)? fs.readFileSync(filePath).toString().length:0;
    
    this.p_currentSize > 0 && this.p_previousSize == 0 && this.emit("add", filePath);

    this.p_currentSize !== this.p_previousSize && this.p_currentSize > 0 && this.emit("change", filePath);
    
    this.p_currentSize == 0 && this.emit("unlink");

    this.p_fileWatcher = this.p_fileWatcher || setInterval(this.watch.bind(this, filePath), 1000);
  };

};

module.exports = FileWatcher;