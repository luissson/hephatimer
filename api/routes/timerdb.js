var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
var { SessionModel, TaskModel, StopwatchModel} = require('../models/index');
var {Session, Task}= require("../data/activity");

router.get("/", function(req, res, next) {
    res.send();
});

router.get("/getalltasks", async function(req, res, next){
  await TaskModel.find({}).populate(['sessions', 'timers']).exec((err, docs) => {
    res.send({tasks: docs});
  })
});

router.get("/getallsessions", async function(req, res, next){
  await SessionModel.find({}).populate(['timers', 'tasks']).exec((err, docs) => {
    res.send({sessions: docs});
  });
});

router.get("/getstopwatches", async function(req, res){
  var sessionName = req.query.name;
  await SessionModel.find({sessionName:sessionName}).populate('timers').exec((err, docs) => {
    res.send({session: docs});
  })
})

router.post("/addsessiontimer", async function(req, res) {
  var session = req.body.session;
  var db_session;
  await SessionModel.findOne({ sessionName:session.sessionName}, async function(err, doc){
    db_session = doc;
    // build stopwatch for session
    var stopwatchModel = new StopwatchModel({
      startDate:session.start,
      endDate:session.end,
      duration:session.duration,
      session:db_session._id
    });

    // save stopwatch to db
    stopwatchModel.save(function(err){
      if(err) console.log(err);
    });

    // update session db entry with new stopwatch/timer
    db_session.timers.push(stopwatchModel._id)
    db_session.save();

    // update tasks with references to session & timer
    for(let task of session.tasks){
      TaskModel.findOne(
        {taskName: task.taskName},
        function(err, doc){
          doc.sessions.push(db_session._id);
          doc.timers.push(stopwatchModel._id);
          doc.save();
        })
    }
  });

  res.send({session: null});
})

router.post("/savesession", async function(req, res) {
  var session = req.body.session;
  if(session)
  {
    let taskObjIds = [];
    for(let i = 0; i < session.tasks.length; i++){
      taskObjIds.push(new mongoose.Types.ObjectId);
    }

    let sessionObjId = new mongoose.Types.ObjectId();

    try {
      var seshModel = new SessionModel({
        _id: sessionObjId,
        sessionName:session.sessionName,
        sessionCategory:session.sessionCategory,
        sessionDescription:session.sessionDescription,
        tasks:taskObjIds
      });

      await seshModel.save(async function(err){
        var taskIdx = 0;
        for(var task of session.tasks){
            let taskModel = new TaskModel({
              _id: taskObjIds[taskIdx],
              taskName: task.taskName,
              taskCategory: task.taskCategory,
              taskDescription: task.taskDescription,
            })
            taskIdx++;
            taskModel.save();
        }
      });
    } catch(err) {
      console.log(err);
    }

    console.log("Successfully saved session to database");
    res.send({session: seshModel});
  } else {
  res.send("No session to add");
}
});

module.exports = router;