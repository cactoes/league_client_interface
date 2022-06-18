interface opts {
  canCallUnhooked?: boolean
}

interface C_User_Dest {
  me: string
  accept: string
}

interface C_Game_Dest {
  gameflow: string
  session: string
}

interface C_Game_Gameflow {
  NONE: string
  LOBBY: string
  MATCHMAKING: string
  READYCHECK: string
  CHAMPSELECT: string
  INPROGRESS: string
  WAITINGFORSTATS: string
  ENDOFGAME: string
}

interface C_Runes_Dest {
  runes: string
}

interface C_Lobby_Dest {
  lobby: string,
  search: string,
  partytype: string,
  position: string,
  matchaccept: string
  matchdecline: string
}

interface C_Lobby_QueueId {
  normal: {
    blind: number,
    draft: number
  },
  ranked: {
    solo_duo: number,
    flex: number
  },
  extra: {
    aram: number
  }
}

interface C_Lobby_Type {
  open: string,
  closed: string
}

declare class lcinterface {
  constructor(options: opts)

  hook(object: credentials): boolean
  unhook(): boolean

  isCorrectState(string: state, any: value): boolean
  setState(string: state, any: data): data
  getState(string: state): any

  async virtualCall(string: dest, object: data, string: method, boolean?: returnJSON = true): object

  addDest(string: name, string: endpoint): boolean
}

export declare class C_User extends lcinterface {
  constructor(options: opts)

  dest: C_User_Dest
}

export declare class C_Game extends lcinterface {
  constructor(options: opts)

  dest: C_Game_Dest
  gameflow: C_Game_Gameflow
}

export declare class C_Runes extends lcinterface {
  constructor(options: opts)

  dest: C_Runes_Dest
}

export declare class C_Lobby extends lcinterface {
  constructor(options: opts)

  dest: C_Lobby_Dest
  queueId: C_Lobby_QueueId
  type: C_Lobby_Type
}