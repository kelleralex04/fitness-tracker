require('dotenv').config();
// Connect to the database
require('./config/database');

// Require the app's Mongoose models
const Exercise = require('./models/exercise');
const Category = require('./models/category');
const Workout = require('./models/workout');
const User = require('./models/user');

// Example CRUD

// Top-level await (using await outside of an async function)
// has been available since Node v14.8
let category = await Category.find({});
let exercise = await Exercise.find({});
let workout = await Workout.find({});
let user = await User.find({});
console.log(category, exercise, workout, user);