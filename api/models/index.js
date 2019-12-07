const mongoose = require('mongoose');
const SessionSchema = require('./session');
const TaskSchema = require('./task');
const StopwatchSchema = require('./stopwatch');

var mongoLogin = require("../config/connectionString"); // exports mongodb connectionstring use for local
mongoLogin = mongoLogin.connectionString;
// var mongoLogin = process.env.MongoConnString; // use for heroku deployment

var options = {
    dbName: 'prodtimer_database',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.Promise = global.Promise;
mongoose.connect(mongoLogin, options);

conn = mongoose.connection;

conn.on('open', () => console.log('DB connection open'))
conn.on('error', err => console.log(`DB connection error : ${err.message}`, err))
conn.on('close', () => console.log('DB connection closed'))

const SessionModel = mongoose.model("SessionModel", SessionSchema)
/*
SessionModel.prototype.ConvertFrom = function(sessionObj){
  let sessionObjId = new mongoose.Types.ObjectId();

    let taskObjIds = [];
    for(let i = 0; i < session.tasks.length; i++){
      taskObjIds.push(new mongoose.Types.ObjectId);
    }

  var seshModel = new SessionModel({
        _id: sessionObjId,
        sessionName:sessionObj.name,
        sessionCategory:sessionObj.category,
        sessionDescription:sessionObj.description,
        sessionId:sessionObj.id,
        tasks:taskObjIds,
        timers:[],
      });
  return seshModel;
};

SessionModel.prototype.ConvertTo = function(){
  var session = new Session(this.sessionName, this.sessionCategory, this.sessionDescription);
  var numTasks = this.tasks.length;
  var tasks = [];
  if(numTasks > 0){
    for(let i = 0; i < numTasks; i++){
      let task = session.tasks[i];
      tasks.push(new Task(task.taskName, task.taskCategory, task.taskDescription));
    }
    session.setTasks(tasks);
  }

  return session;
};
*/

const TaskModel = mongoose.model("TaskModel", TaskSchema)

/*
TaskModel.prototype.ConvertFrom = function(taskObj){
};

TaskModel.prototype.ConvertTo = function(){
  var task = new Task(this.taskName, this.taskCategory, this.taskDescription);
  return task;
};
*/

const StopwatchModel = mongoose.model("StopwatchModel", StopwatchSchema)
/*
StopwatchModel.prototype.ConvertFrom = function(stopwatchObj){
};
StopwatchModel.prototype.ConvertTo = function(){
};
*/

const models = { SessionModel, TaskModel, StopwatchModel };
module.exports = models;