const Exercise = require('../models/exercise');
const Category = require('../models/category');

module.exports = {
    index,
    new: newExercise,
    create,
    show,
    newCategory
};

async function findUserExercises(req, res) {
    const categories = [];
    const exercises = [];
    for (const c of req.user.category) {
        categories.push(await Category.findById(c));
    };
    categories.sort(function(a,b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
        };
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
        };
        return 0
    });
    for (const e of req.user.exercise) {
        exercises.push(await Exercise.findById(e));
    };
    return { categories: categories, exercises: exercises }
};

async function index(req, res) {
    categories = (await findUserExercises(req, res)).categories;
    exercises = (await findUserExercises(req, res)).exercises;
    res.render('exercises/index', { title: 'All Exercises' , categories, exercises });
};

async function newExercise(req, res) {
    categories = (await findUserExercises(req, res)).categories;
    res.render('exercises/new', { title: 'New Exercise', errorMsg: '', categories});
};

async function create(req, res) {
    try {
        const exercise = await Exercise.create(req.body);
        const category = await Category.findOne({ name: exercise.catName});
        category.exercise.push(exercise);
        await category.save();
        req.user.exercise.push(exercise);
        await req.user.save();
        res.redirect('/exercises');
    } catch(err) {
        console.log(err);
        res.render('exercises/new', { errorMsg: err.message });
    };
};

async function show(req, res) {
    const exercise = await Exercise.findById(req.params.id);
    res.render('exercises/show', { title: exercise.name, exercise, errorMsg: '' });
};

async function newCategory(req, res) {
    try {
        const category = await Category.create(req.body);
        req.user.category.push(category);
        await req.user.save();
        res.redirect('/exercises/new');
    } catch {
        console.log(err);
        res.render('exercises/new', { errorMsg: err.message })
    };
};