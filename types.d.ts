declare class lcinterface {
  constructor(canCallUnhooked?: boolean);

  hook(object: credentials): boolean;
  unhook(): boolean;

  isCorrectState(string: state, any: value): boolean;
  setState(string: state, any: data): data;
  getState(string: state): any;

  virtualCall(string: dest, object?: data, string?: method): object;

  addDest(string: name, string: endpoint): boolean;
}

export = lcinterface;