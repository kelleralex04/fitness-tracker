const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    exercise: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);