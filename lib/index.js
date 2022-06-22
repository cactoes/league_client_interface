const LCConnector = require("./custom_modules/lcc")
const fetch = require("node-fetch")

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const client = new LCConnector()

class LCInterface {
  constructor({canCallUnhooked = true}) {
    this.dest = new Object()
    this.b_auth = new String()
    this.data = new Object()
    this.states = { hooked: false, virtualCallCount: 0, canCallUnhooked }
  }

  setState(state, data) {
    this.states[state] = data
    return this.states[state]
  }

  getState(state) {
    if (state in this.states) {
      return this.states[state]
    }
    return false
  }

  addDest(name, endpoint) {
    if (!(name in this.dest)) {
      this.dest[name] = endpoint
      return true
    }
    return false
  }

  isCorrectState(state, value) {
    if (state in this.states) {
      return this.states[state] == value
    }
    return false
  } 

  async virtualCall(dest, data, method, returnJSON = true) {
    this.virtualCallCount++
    if (this.states.hooked || this.states.canCallUnhooked) {
      return await this.apicall(dest, data, method, returnJSON)
    } else {
      return false
    }
  }

  hook({ protocol, address, port, username, password }) {
    if (!this.isCorrectState("hooked", true)) {
      this.data = {
        protocol, address, 
        port: parseInt(port),
        username, password
      }
      
      this.b_auth = Buffer.from(`${username}:${password}`).toString('base64')

      this.setState("hooked", true)
      return true
    }
    return false
  }

  unhook() {
    if (this.isCorrectState("hooked", true)) {
      this.data = {}
      this.b_auth = ""

      this.setState("hooked", false)
      return true
    }
    return false
  }

  async apicall(endpoint, data, method, returnJSON) {
    let fetch_body = {
      method,
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${this.b_auth}`,
        'Content-Type': 'application/json'
      }
    }

    if (method !== "get")
      fetch_body["body"] = JSON.stringify(data)

    const response = await fetch(`${this.data.protocol}://${this.data.address}:${this.data.port}${endpoint}`, fetch_body)
    if (returnJSON)
      return response.json()
    else 
      return response
  }
}

class C_User extends LCInterface {
  constructor({canCallUnhooked = true}) {
    super({canCallUnhooked})
    this.dest = {
      me: "/lol-chat/v1/me"
    }
  }
}

class C_Game extends LCInterface {
  constructor({canCallUnhooked = true}) {
    super({canCallUnhooked})
    this.dest = {
      gameflow: "/lol-gameflow/v1/gameflow-phase",
      session: "/lol-gameflow/v1/session",
      champselect: "/lol-champ-select/v1/session",
      action: "/lol-champ-select/v1/session/actions"
    }
    this.gameflow = {
      NONE: "None",
      LOBBY: "Lobby",
      MATCHMAKING: "Matchmaking",
      READYCHECK: "ReadyCheck",
      CHAMPSELECT: "ChampSelect",
      INPROGRESS: "InProgress",
      WAITINGFORSTATS: "WaitingForStats",
      ENDOFGAME: "EndOfGame"
    }
    this.lane = {
      UNSELECTED: "UNSELECTED",
      TOP: "TOP",
      JUNGLE: "JUNGLE",
      MIDDLE: "MIDDLE",
      BOTTOM: "BOTTOM",
      SUPPORT: "UTILITY"
    }
  }
}

class C_Runes extends LCInterface {
  constructor({canCallUnhooked = true}) {
    super({canCallUnhooked})
    this.dest = {
      runes: "/lol-perks/v1/pages",
      spells: "/lol-champ-select/v1/session/my-selection"
    }

    this.spell = {
      Barrier: {
        id: 0,
        key: "SummonerBarrier",
        name: "Barrier"
      },
      Cleanse: {
        id: 1,
        key: "SummonerBoost",
        name: "Cleanse"
      },
      Exhaust: {
        id: 3,
        key: "SummonerExhaust",
        name: "Exhaust"
      },
      Flash: {
        id: 4,
        key: "SummonerFlash",
        name: "Flash"
      },
      Ghost: {
        id: 6,
        key: "SummonerHaste",
        name: "Ghost"
      },
      Heal: {
        id: 7,
        key: "SummonerHeal",
        name: "Heal"
      },
      Smite: {
        id: 11,
        key: "SummonerSmite",
        name: "Smite"
      },
      Teleport: {
        id: 12,
        key: "SummonerTeleport",
        name: "Teleport"
      },
      Clarity: {
        id: 13,
        key: "SummonerMana",
        name: "Clarity"
      },
      Ignite: {
        id: 14,
        key: "SummonerDot",
        name: "Ignite"
      },
      Mark: {
        id: 32,
        key: "SummonerSnowball",
        name: "Mark"
      }
    }
  }
}

class C_Lobby extends LCInterface {
  constructor({canCallUnhooked = true}) {
    super({canCallUnhooked})
    this.dest = {
      lobby: "/lol-lobby/v2/lobby",
      search: "/lol-lobby/v2/lobby/matchmaking/search",
      partytype: "/lol-lobby/v2/lobby/partyType",
      position: "/lol-lobby/v2/lobby/members/localMember/position-preferences",
      matchaccept: "/lol-matchmaking/v1/ready-check/accept",
      matchdecline: "/lol-matchmaking/v1/ready-check/decline",
    }
    this.queueId = {
      normal: {
        blind: 430,
        draft: 400
      },
      ranked: {
        solo_duo: 420,
        flex: 440
      },
      extra: {
        aram: 450
      }
    },
    this.type = {
      open: "open",
      closed: "closed"
    }
  }
}

module.exports = {
  client,
  C_User,
  C_Runes,
  C_Game,
  C_Lobby
}