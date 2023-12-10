const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    exerciseName: String,
    setsNum: Number,
    weightUnit: [String],
    distanceUnit: [String],
    weight: [Number],
    reps: [Number],
    distance: [Number],
    timeH: [String],
    timeM: [String],
    timeS: [String]
}, {
    timestamps: true
});

const workoutSchema = new Schema({
    date: Date,
    set: [setSchema],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);