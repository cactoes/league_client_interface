declare class FileWatcher {
  clear(): void;

  watch(path: string): void;

  on(event: "add", listner: (path: string) => void): this;

  on(event: "change", listner: (path: string) => void): this;

  on(event: "unlink", listner: () => void): this;
};

export = FileWatcher;