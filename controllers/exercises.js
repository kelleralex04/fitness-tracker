const Exercise = require('../models/exercise');
const Category = require('../models/category');

module.exports = {
    index,
    new: newMovie,
    create
};

async function index(req, res) {
    const exercises = await Exercise.find({});
    res.render('exercises/index', { title: 'All Exercises' , exercises });
};

function newMovie(req, res) {
    res.render('exercises/new', { title: 'Add Exercise', errorMsg: ''});
};

async function create(req, res) {
    try {
        const exercise = await Exercise.create(req.body);
        const category = await Category.findOne({ name: exercise.catName});
        if (category) {
            console.log(category.exercise, exercise)
            category.exercise.push(exercise);
            await category.save();
        } else {
            await Category.create({ name: exercise.catName, exercise: exercise});
        };
        res.redirect('/exercises');
    } catch(err) {
        console.log(err);
        res.render('exercises/new', {errorMsg: err.message});
    };
};