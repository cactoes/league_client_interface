// --- global imports
import LCConnector from "./modules/lcc/lib/index.js" // the import for getting the credentials
import { C_Game, C_User, C_Runes } from "./interfaces.js" // import for the interfaces

// --- required for getting the credentials to connect to league's api
const lcc = new LCConnector()

// --- interfaces for interacting with the game
const c_user = new C_User()

// --- start a soon as we have the credentials
lcc.on("connect", async (game_data) => {
  // --- hook the user class with the credentials we got
  c_user.hook(game_data)
  
  // --- if we hooked successfully do ...
  if (c_user.isCorrectState("hooked", true)) {
    // --- "virtually" call a league endpoint with get, post, put, delete
    const user_data = await c_user.virtualCall(c_user.dest.me)

    // --- log the user data we got from the client
    console.log(user_data)
  }

  // --- optionally disconnect from the client after we are done
  lcc.disconnect()
})

// --- connect to the client after setting everything up
lcc.connect()