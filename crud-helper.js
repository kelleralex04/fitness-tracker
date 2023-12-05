require('dotenv').config();
// Connect to the database
require('./config/database');

// Require the app's Mongoose models
const Exercise = require('./models/exercise');
const Category = require('./models/category');

// Example CRUD

// Top-level await (using await outside of an async function)
// has been available since Node v14.8
let category = await Category.find({});
let exercise = await Exercise.find({});
console.log(category, exercise);