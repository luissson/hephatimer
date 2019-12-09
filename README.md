# Hephatimer

Named for the greek god Hephaestus (the greek god that did real work), Hephatimer is a task-time tracking application for users who want to break down how they spend their time with a fine granularity.


# Prerequesites
* Node
* MongoDB Server


# Getting Started
* Clone This Repository

* By default the API expects a connection string to the mongoDB instance and looks in api/config/connectionString.js

```javascript
// config/connectionString.js
const connString = "mongodb://localhost:27017"
exports.connectionString = connString
```

This will connect to a fresh/default local mongoDb server. If using Atlas or other provider, use their connection string here.

* in /client/, run npm install & npm start
* in /api/, run npm install & npm start


# Features

A list of planned major features include

* Recorded sessions (a container for tasks/sub-tasks)
* Minimal UI displaying saved and active sessions
* Reports that display a breakdown of tasks

# Author
* Louis Rene Jacome - [luissson](https://github.com/luissson/)