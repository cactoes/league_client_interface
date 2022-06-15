declare class FileWatcher {
  constructor(path: string)

  stop(): void

  start(): void

  on(event: "create", listner: (path: string) => void): this

  on(event: "change", listner: (path: string) => void): this

  on(event: "remove", listner: () => void): this
}

export = FileWatcher