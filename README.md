# League client interface
An easy way to interact with the league client. This "library" is basically a middle layer between you app and the league client

# Documentation
## Dependencies
- node-fetch@3.2.4

## Imports
- `import LCConnector from "./modules/lcc/lib/index.js"`
- `import { C_Game, C_User, C_Runes } from "./interfaces.js"`
## Getting client credentials 
```javascript
// create an instance of the class (LCConnector)
const lcc = new LCConnector()
// listen for event connect
lcc.on("connect", (data) => {
  // do stuff with our data/client credentials
})
```
## Setting up interface
```javascript
const c_interface = new C_InterfaceName()
```

## Interface's
### C_User
For interacting with the user
- dest
  - `me` Gets users data
  - `accept` Accepts or declines match
### C_Game
For interacting with the game
- dest
  - `gameflow` State of the client (InGame, MathFound, ...)
  - `session` Current data of the match you're in
### C_Runes
!!Experimental For interacting with your runes
- dest
  - `runes` All runes of the user (in ids, i think, good luck)

## Interface functions
### Hooking
"hooking" Onto the function aka initialse the interface <br />
- params
  - `data` All the credentials
- returns boolean
```javascript
c_interface.hook(credentials)
```
### State Cheking
Check the state of a local interface viariable <br />
- params
  - `state` State to check
  - `value` Value compare current state to
- returns boolean
```javascript
c_interface.isCorrectState(state, value)
```

### Interacting with the client
Interact with the client's api endpoints **is async**
- params
  -  `dest` Is the endpoint in string form
  -  `data` Is the json obj to send to the client
  -  `method` Default is post if data is given else its get
- return json obj
```javascript
c_interface.virtualCall(c_interface.dest.endpointName, (optional) data, (optional) method)
```

### Adding a missing dest
Adds a dest to the dest list (kinda crack)
- params
  - `name` Name of the dest
  - `endpoint` Actual enpoint string
- return nothing??
```javascript
c_interface.addDest(name, endpoint)
```
