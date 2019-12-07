const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        unique: true
    },
    taskCategory: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SessionModel'
    }],
    timers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StopwatchModel'
    }]
})

module.exports = TaskSchema;