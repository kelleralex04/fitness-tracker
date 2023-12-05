const Exercise = require('../models/exercise');
const Category = require('../models/category');

module.exports = {
    index,
    new: newExercise,
    create,
    show
};

async function index(req, res) {
    const categories = await Category.find({});
    const exercises = [];
    for (const e of req.user.exercise) {
        exercises.push(await Exercise.findById(e));
    };
    res.render('exercises/index', { title: 'All Exercises' , categories, exercises });
};

async function newExercise(req, res) {
    const categories = await Category.find({});
    categories.sort(function(a,b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
        }
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
        }
        return 0
    });
    res.render('exercises/new', { title: 'Add Exercise', errorMsg: '', categories});
};

async function create(req, res) {
    try {
        const exercise = await Exercise.create(req.body);
        const category = await Category.findOne({ name: exercise.catName});
        if (category) {
            category.exercise.push(exercise);
            await category.save();
        } else {
            await Category.create({ name: exercise.catName, exercise: exercise});
        };
        req.user.exercise.push(exercise);
        await req.user.save();
        res.redirect('/exercises');
    } catch(err) {
        console.log(err);
        res.render('exercises/new', {errorMsg: err.message});
    };
};

async function show(req, res) {
    const exercise = await Exercise.findById(req.params.id);
    res.render('exercises/show', { title: exercise.name, exercise, errorMsg: '' })
}