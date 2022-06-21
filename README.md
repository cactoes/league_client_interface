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
  - `champselect` (get) Gets current champion select data
  - `action` (patch) Needs action id (+"/${actionid}") { championId } ! no return
    - (post) Needs action id (+"/${actionid}/complete") { championId } ! no return
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
  - `runes` (get/put !no return) All runes of the user (in ids, good luck)
  - `spells` (patch !no return) Get user active summoner spells {spell1Id, spell2Id}
- spell
  - `Spellname` (Barrier, Cleanse, Exhaust, Flash, Ghost, Heal, Smite, Teleport, Clarity, Ignite, Mark)
    - `id` Spell id
    - `key` Other spell name form (ex. summonerFlash)
    - `name` Spellname
### C_Lobby
For interacting with the lobby
- dest
  - `lobby` (get/post) Gets all lobby data or create lobby if queue id is given { queueId } (not sure if u can set/post more)
  - `search` (post !no return/delete !no return) Starts or stops the searching of a match
  - `partytype` (put!no return) Set party to open or closed (string)
  - `position` (put!no return) Sets your lanes {firstPreference, secondPreference}
  - `matchaccept` (post !no return) Accepts match 
  - `matchdecline` (post !no return) Declines match 
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

### For all endpoints
(https://lcu.vivide.re/)[https://lcu.vivide.re/]
## Interface functions
### Hooking
"Hook" onto the interface aka initialise the interface **make sure to only call once per interface**, returns false if already hooked <br />
- params
  - `data` All the credentials
- returns boolean
```typescript
c_interface.hook(credentials: object): boolean
```

### Unhooking
Unhooks the interface, returns false if you weren't hooked
- returns boolean
```typescript
c_interface.unhook(): boolean
```

### State Cheking
Check the state of a interface variable, returns false if state doesn't exists
- params
  - `state` State to check
  - `value` Value to compare current state to
- returns boolean
```typescript
c_interface.isCorrectState(state: string, value: any): boolean
```

### Set State
Set value of a state or create a state
- params
  - `state` State to change
  - `data` What to set the state to
- returns data \<T\>
```typescript
c_interface.setState<T>(state: string, data: T): T
```

### Get State
Gets value of the requested state, returns false if state doesn't exists
- params
  - `state` State to get
- return state data \<T\>
```typescript
c_interface.getState<T>(state: string): T
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
- return json obj \<T\>
```typescript
c_interface.virtualCall<T>(dest: string, data: object | string, method: string, returnJSON?: boolean): Promise<T>
```

### Adding your own dest/endpoint
Adds a endpoint to the dest list, returns false if dest already exists
- params
  - `name` Name of the dest
  - `endpoint` Actual enpoint string
- return boolean
```typescript
c_interface.addDest(name: string, endpoint: string): boolean
```
## License
[MIT License](LICENSE)