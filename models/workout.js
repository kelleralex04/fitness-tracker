const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setSchema = new Schema({
    exerciseName: String,
    weight: Number,
    reps: Number,
    distance: Number,
    time: Number
}, {
    timestamps: true
});

const workoutSchema = new Schema({
    date: Date,
    set: [setSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);