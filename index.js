import LCConnector from "./modules/lcc/lib/index.js"
import { C_Game, C_User } from "./interfaces.js"

// import C_User from "./interface.user.js"
// import C_Game from "./interface.game.js"

const lcc = new LCConnector()

const c_user = new C_User()
const c_game = new C_Game()

lcc.on("connect", async (game_data) => {
  c_user.hook(game_data)
  c_game.hook(game_data)
  
  if (c_user.isCorrectState("hooked", true)) {
    c_user.virtualCall(c_user.dest.accept, {})
  }

  if (c_game.isCorrectState("hooked", true)) {
    c_game.virtualCall(c_game.dest.gameflow)
  }

  
})

lcc.connect()