const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionName: {
        type: String,
        required: true
    },
    sessionCategory: {
        type: String
    },
    sessionDescription: {
        type: String
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskModel'
    }],
    timers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StopwatchModel'
    }]
})

module.exports = SessionSchema;