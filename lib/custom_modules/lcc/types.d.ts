declare class LCConnector {
  static s_LCPathFromProcess(): Promise<string | void>;
  
  static s_isValidPath(LCPath: string): boolean;
  
  constructor(path?: string);

  connect(): void;

  disconnect(): void;

  on(event: "connect", listner: (data: {
    address: string,
    username: string,
    port: number,
    password: string,
    protocol: string
  }) => void): this;

  on(event: "disconnect", listner: () => void): this;
};

export = LCConnector;