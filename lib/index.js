const LCConnector = require("./custom_modules/lcc")
const fetch = require("node-fetch")

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

const client = new LCConnector()

class LCInterface {
  constructor() {
    this.dest = new Object()
    this.b_auth = new String()
    this.data = new Object()
    this.states = { hooked: false, virtualCallCount: 0 }
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

  async virtualCall(dest, data = false, method = false) {
    this.virtualCallCount++
    return await this[data? "upload":"get"](dest, data, method? method:"post")
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

  async get(endpoint) {
    const response = await fetch(`${this.data.protocol}://${this.data.address}:${this.data.port}${endpoint}`, {
      method: 'get',
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${this.b_auth}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.json()
  }

  async upload(endpoint, data, method) {
    const response = await fetch(`${this.data.protocol}://${this.data.address}:${this.data.port}${endpoint}`, {
      method,
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${this.b_auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    return response.json()
  }
}

class C_User extends LCInterface {
  constructor() {
    super()
    this.dest = {
      me: "/lol-chat/v1/me",
      accept: "/lol-matchmaking/v1/ready-check/accept"
    }
  }
}

class C_Runes extends LCInterface {
  constructor() {
    super()
    this.dest = {
      runes: "/lol-perks/v1/pages"
    }
  }
}

class C_Game extends LCInterface {
  constructor() {
    super()
    this.dest = {
      gameflow: "/lol-gameflow/v1/gameflow-phase",
      session: "/lol-gameflow/v1/session"
    }
  }
}

module.exports = {
  client,
  C_User,
  C_Runes,
  C_Game
}