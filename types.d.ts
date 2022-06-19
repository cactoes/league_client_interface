import LCConnector from "./lib/custom_modules/lcc/types"

interface opts {
  canCallUnhooked?: boolean
}

interface user_dest {
  me: string
  accept: string
}

interface game_dest {
  gameflow: string
  session: string
}

interface game_gameflow {
  NONE: string
  LOBBY: string
  MATCHMAKING: string
  READYCHECK: string
  CHAMPSELECT: string
  INPROGRESS: string
  WAITINGFORSTATS: string
  ENDOFGAME: string
}

interface game_lanes {
  UNSELECTED: string,
  TOP: string,
  JUNGLE: string,
  MIDDLE: string,
  BOTTOM: string,
  SUPPORT: string
}

interface runes_dest {
  runes: string
}

interface lobby_dest {
  lobby: string,
  search: string,
  partytype: string,
  position: string,
  matchaccept: string
  matchdecline: string
}

interface lobby_queueId {
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

interface lobby_type {
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

  dest: user_dest
}

export declare class C_Game extends lcinterface {
  constructor(options: opts)

  dest: game_dest
  gameflow: game_gameflow
  lane: game_lanes
}

export declare class C_Runes extends lcinterface {
  constructor(options: opts)

  dest: runes_dest
}

export declare class C_Lobby extends lcinterface {
  constructor(options: opts)

  dest: lobby_dest
  queueId: lobby_queueId
  type: lobby_type
}

export declare const client = new LCConnector()