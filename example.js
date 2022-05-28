// --- global imports
import LCConnector from "./modules/lcc/lib/index.js"
import { C_Game, C_User, C_Runes } from "./interfaces.js"

// --- required for getting the creds to connect to league's api
const lcc = new LCConnector()

// --- interfaces for interacting with the game
const c_user = new C_User()

// --- start a soon as we have the credentials
lcc.on("connect", async (game_data) => {
  // --- hook the user class with the credentials we got
  c_user.hook(game_data)
  
  // --- if we hooked successfully do ...
  if (c_user.isCorrectState("hooked", true)) {
    // --- "virtually" call a league endpoint with get, post, put
    // virtualCall(endpoint, data (empty for get), mode[post, put] (empty for get))
    c_user.virtualCall(c_user.dest.accept, {})
  }
})

lcc.connect()