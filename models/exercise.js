const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: String,
    weight: Number,
    reps: Number,
    distance: Number,
    time: Number,
    exType: {
        type: String,
        enum: ['Weight', 'Reps', 'Distance', 'Time', 'Weight and Reps', 'Distance and Time', 'Weight and Distance', 'Weight and Time', 'Reps and Distance', 'Reps and Time']
    },
    weightUnit: {
        type: String,
        enum: ['lbs', 'kgs']
    },
    distanceUnit: {
        type: String,
        enum: ['ft', 'mi', 'm', 'km']
    },
    description: String
});

const categorySchema = new Schema({
    name: String,
    exercise: [exerciseSchema]
});

module.exports = mongoose.model('Exercise', exerciseSchema);