const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    name: String,
    googleId: {
        type: String,
        required: true
    },
    email: String,
    avatar: String,
    exercise: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    }],
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);