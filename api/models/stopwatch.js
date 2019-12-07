const mongoose = require('mongoose');

const StopwatchSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SessionModel'
    }

})

module.exports = StopwatchSchema;