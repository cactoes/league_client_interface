// global imports
const { client, C_Game, C_User, C_Runes } = require("lcinterface") // import for the interfaces

// interfaces for interacting with the game
const c_user = new C_User({canCallUnhooked: false})

// start a soon as we have the credentials
client.on("connect", async (game_data) => {
  // hook the user class with the credentials we got
  c_user.hook(game_data)
  
  // if we hooked successfully do ...
  if (c_user.isCorrectState("hooked", true)) {
    // "virtually" call a league endpoint with get, post, put, delete
    const user_data = await c_user.virtualCall(c_user.dest.me, undefined, "get")

    // log the user data we got from the client
    console.log(user_data)

    // change our ingame status
    user_data.statusMessage = "hello from lcinterface"

    // update our status
    const result = await interfaces.user.virtualCall(interfaces.user.dest.me, user_data, "put")

    // log the result
    console.log(result)
  }

  // disconnect from the client after we are done
  client.disconnect()
})

// connect to the client after setting everything up
client.connect()