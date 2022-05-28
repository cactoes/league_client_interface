# League client interface
A league client connector in interface style (dunno if interfaces is the correct word) <br />
the "scripts" in the modules folder were made by me (lcc was cloned and modified), so no documentation on that

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
// listen for on connect
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
