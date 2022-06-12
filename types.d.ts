declare class lcinterface {
  hook(object: credentials): boolean;
  unhook(): boolean;

  isCorrectState(string: state, any: value): boolean;
  setState(string: state, any: data): data;
  getState(string: state): any;

  virtualCall(string: dest, object?: data, string?: method): object;
}

export = lcinterface;