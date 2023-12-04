const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    exercise: [exerciseSchema]
});

module.exports = mongoose.model('Category', categorySchema);