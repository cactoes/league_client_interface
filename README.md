# League client interface
An easy way to interact with the league client. This module is basically a middle layer between your app and the league client

# Documentation
## Dependencies
- node-fetch@2.6.1

## Importing
`npm install lcinterface`
```javascript
const { client, C_Game, C_User, C_Runes, C_Lobby } = require("lcinterface")
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
- constructor (In obj form {opt: value})
  - `canCallUnhooked` If set to true, skips checking hook state when doing a [virutal call](#interacting-with-the-client), default is true(optional)
```javascript
const c_interface = new C_InterfaceName({?canCallUnhooked})
```

## Interface's
### C_User
For interacting with the user
- dest
  - `me` (get/post) Gets users data
### C_Game
For interacting with the game
- dest
  - `gameflow` (get) State of the client
  - `session` (get) Current data of the match you're in
- gameflow (all gameflow states)
  - `NONE`
  - `LOBBY`
  - `MATCHMAKING`
  - `READYCHECK`
  - `CHAMPSELECT`
  - `INPROGRESS`
  - `WAITINGFORSTATS`
  - `ENDOFGAME`
- lane (all lanes)
  - `UNSELECTED`
  - `TOP`
  - `JUNGLE`
  - `MIDDLE`
  - `BOTTOM`
  - `SUPPORT`
### C_Runes
For interacting with your runes (no methods/docs yet)
- dest
  - `runes` All runes of the user (in ids, good luck)
### C_User
For interacting with the lobby
- dest
  - `lobby` (get/post) Gets all lobby data or create lobby if queue id is given
  - `search` (post/delete) Starts or stops the searching of a match
  - `partytype` (put) Set party to open or closed
  - `position` (put) Sets your lanes {firstPreference,secondPreference}
  - `matchaccept` (post) Accepts match
  - `matchdecline` (post) Declines match
- queueId
  - normal
    - `blind` Id for blind pick
    - `draft` Id for draft pick
  - ranked
    - `solo_duo` Id for solo/duo
    - `flex` Id for flex
  - extra
    - `aram` Id for aram
- type (lobby/party)
  - `open` Param for setting lobby to open
  - `closed` Param for setting lobby to closed
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
  - `canCallUnhooked` Boolean

### Interacting with the client
Interact with the client's api endpoints **is async**
- params
  - `dest` Is the endpoint in string form
  - `data` Is the json obj to send to the client
  - `method` Is the method used for fetch call (get, post, put, delete, patch)
  - `returnJSON` (OPTIONAL) Should return json obj? (sometimes lcu wont return anything), DEFAULT = true
- return json obj
```javascript
c_interface.virtualCall(c_interface.dest.endpointName, data, method, ?returnJSON)
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
## License
[MIT License](LICENSE)