import fetch from "node-fetch"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

class Interface {
  constructor() {
    this.dest = new Object()
    this.b_auth = new String()
    this.data = new Object()
    this.states = { hooked: false }
  }

  setState(state, data) {
    this.states[state] = data
  }

  getState(state) {
    return this.states[state]
  }

  addDest(name, endpoint) {
    this.dest[name] = endpoint
  }

  isCorrectState(state, value) {
    return this.states[state] == value
  } 

  async virtualCall(dest, data = false, method = false) {
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

export class C_User extends Interface {
  constructor() {
    super()
    this.dest = {
      me: "/lol-chat/v1/me",
      accept: "/lol-matchmaking/v1/ready-check/accept"
    }
  }
}

export class C_Runes extends Interface {
  constructor() {
    super()
    this.dest = {
      runes: "/lol-perks/v1/pages"
    }
  }
}

export class C_Game extends Interface {
  constructor() {
    super()
    this.dest = {
      gameflow: "/lol-gameflow/v1/gameflow-phase",
      session: "/lol-gameflow/v1/session"
    }
  }
}