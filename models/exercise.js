const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: String,
    catName: String,
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
}, {
    timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);