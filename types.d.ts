import LCConnector from "./lib/custom_modules/lcc/types"

interface opts {
  canCallUnhooked?: boolean
}

interface user_dest {
  me: string
  accept: string
  [key: string]: string
}

interface game_dest {
  gameflow: string
  session: string
  champselect: string
  action: string
  [key: string]: string
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
  spells: string
  [key: string]: string
}

interface runes_spell {
  [key: string]: { id: number, key: string, name: string }
  Barrier: {
    id: number,
    key: string,
    name: string
  },
  Cleanse: {
    id: number,
    key: string,
    name: string
  },
  Exhaust: {
    id: number,
    key: string,
    name: string
  },
  Flash: {
    id: number,
    key: string,
    name: string
  },
  Ghost: {
    id: number,
    key: string,
    name: string
  },
  Heal: {
    id: number,
    key: string,
    name: string
  },
  Smite: {
    id: number,
    key: string,
    name: string
  },
  Teleport: {
    id: number,
    key: string,
    name: string
  },
  Clarity: {
    id: number,
    key: string,
    name: string
  },
  Ignite: {
    id: number,
    key: string,
    name: string
  },
  Mark: {
    id: number,
    key: string,
    name: string
  }
}

interface lobby_dest {
  lobby: string,
  search: string,
  partytype: string,
  position: string,
  matchaccept: string
  matchdecline: string
  [key: string]: string
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

interface interface_states {
  hooked: boolean,
  virtualCallCount: number,
  canCallUnhooked: boolean
  [key: string]: unknown
}

declare class lcinterface {
  constructor(options: opts)

  hook(credentials: object): boolean
  unhook(): boolean

  isCorrectState(state: string, value: any): boolean
  setState<T>(state: string, data: T): T
  getState<T>(state: string): T

  async virtualCall<T>(dest: string, data: object | string, method: string, returnJSON?: boolean): Promise<T>

  addDest(name: string, endpoint: string): boolean

  states: interface_states
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
  spell: runes_spell
}

export declare class C_Lobby extends lcinterface {
  constructor(options: opts)

  dest: lobby_dest
  queueId: lobby_queueId
  type: lobby_type
}

export declare const client = new LCConnector()