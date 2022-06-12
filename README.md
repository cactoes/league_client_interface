# League client interface
An easy way to interact with the league client. This module is basically a middle layer between your app and the league client

# Documentation
## Dependencies
- node-fetch@2.6.1

## Importing
`npm install lcinterface`
```javascript
const { client, C_Game, C_User, C_Runes } = require("lcinterface")
```
## Getting client credentials 
```javascript
// listen for event connect
client.on("connect", (data) => {
  // do stuff with our data/client credentials

  // after interacting with the client
  client.disconnect()
})
// start the client connector
client.connect()
```
### All events
- client
  - `connect` When lcinterface connects to the league client
  - `disconnect` When lcinterface disconnects from the league client

## Setting up interface
- constructor 
  - `canCallUnhooked` If set to true, skips checking hook state when doing a [virutal call](#virtualCall)
```javascript
const c_interface = new C_InterfaceName(?canCallUnhooked)
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
  - `gameflow` State of the client (InGame, MatchFound, ...)
  - `session` Current data of the match you're in
### C_Runes
!!Experimental For interacting with your runes
- dest
  - `runes` All runes of the user (in ids, good luck)

## Interface functions
### Hooking
"Hook" onto the interface aka initialise the interface **make sure to only call once per interface**, returns false if already hooked <br />
- params
  - `data` All the credentials
- returns boolean
```javascript
c_interface.hook(credentials)
```

### Unhooking
Unhooks the interface, returns false if you weren't hooked
- returns boolean
```javascript
c_interface.unhook()
```

### State Cheking
Check the state of a interface variable, returns false if state doesn't exists
- params
  - `state` State to check
  - `value` Value to compare current state to
- returns boolean
```javascript
c_interface.isCorrectState(state, value)
```

### Set State
Set value of a state or create a state
- params
  - `state` State to change
  - `data` What to set the state to
- returns data
```javascript
c_interface.setState(state, data)
```

### Get State
Gets value of the requested state, returns false if state doesn't exists
- params
  - `state` State to get
- return state data
```javascript
c_interface.getState(state)
```

### All states
All the states currently built into the module
- states
  - `hooked` Boolean
  - `virtualCallCount` Number

#virtualCall
### Interacting with the client
Interact with the client's api endpoints **is async**
- params
  -  `dest` Is the endpoint in string form
  -  `data` Is the json obj to send to the client, (optional)
  -  `method` Default is post if data is given else it's get, (optional)
- return json obj
```javascript
c_interface.virtualCall(c_interface.dest.endpointName, ?data, ?method)
```

### Adding your own dest/endpoint
Adds a endpoint to the dest list, returns false if dest already exists
- params
  - `name` Name of the dest
  - `endpoint` Actual enpoint string
- return boolean
```javascript
c_interface.addDest(name, endpoint)
```
