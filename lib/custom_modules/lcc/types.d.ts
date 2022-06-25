declare class LCConnector {
  async connect(): void

  disconnect(): void

  setCheckProcessInterval(time: number): void

  on(event: "connect", listner: (data: {
    address: string,
    username: string,
    port: number,
    pid: number
    password: string,
    protocol: string
  }) => void): this

  on(event: "disconnect", listner: () => void): this
}

export = LCConnector