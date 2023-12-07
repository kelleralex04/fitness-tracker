const Exercise = require('../models/exercise');
const Category = require('../models/category');
const Workout = require('../models/workout')
const e = require('express');

module.exports = {
    index,
    calendar,
    show,
    new: newWorkout,
    addExercise
};

let date = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];
curMonth = date.getMonth();
curYear = date.getFullYear();
let today = [date.getDate(), date.getMonth(), date.getFullYear()];

function index(req, res) {
    let firstDayOfMonth = new Date(curYear, curMonth, 1).getDay();
    let lastDateOfMonth = new Date(curYear, curMonth + 1, 0).getDate();
    let lastDayOfMonth = new Date(curYear, curMonth, lastDateOfMonth).getDay();
    let lastDateOfPrevMonth = new Date(curYear, curMonth, 0).getDate();

    if (curMonth < 0 || curMonth > 11) {
        date = new Date(curYear, curMonth);
        curYear = date.getFullYear();
        curMonth = date.getMonth();
    };

    curMonthText = months[curMonth];
    res.render('workouts/index', { title: 'Workouts', curMonthText, curYear, lastDateOfMonth, firstDayOfMonth, lastDateOfPrevMonth, lastDayOfMonth, today });
};

function calendar(req, res) {
    if (req.body.prev) {
        curMonth -= 1;
    } else if (req.body.next) {
        curMonth += 1;
    };
    res.redirect('/workouts');
};

async function show(req, res) {
    const category = await Category.findOne({}, {}, { sort: { 'name' : 1 }}, function(err, post){});
    let workoutId = req.params.id;
    let temp = workoutId.match(/\d+/g);
    let date = new Date(temp[2], temp[0] - 1, temp[1])
    let showDate = date.toDateString();
    const exercises = [];
    for (const e of req.user.exercise) {
        exercises.push(await Exercise.findById(e));
    };
    let firstExercise
    for (const e of exercises) {
        if (category.exercise.includes(e._id)) {
            firstExercise = e.name
            break
        };
    };
    let todaysWorkouts = await Workout.find({ date: date });
    res.render('workouts/show', { title: showDate, workoutId, category, firstExercise, todaysWorkouts });
};

async function newWorkout(req, res) {
    let curDate = req.params.id;
    const categories = await Category.find({}).sort({ 'name': 1 });
    const exercises = [];
    const exInCurCategory = [];
    let curExercise
    for (const e of req.user.exercise) {
        exercises.push(await Exercise.findById(e));
    };
    const curCategory = await Category.findOne({ 'name': `${req.query.curCategory}`});
    exercises.forEach((e) => {
        if (curCategory.exercise.includes(e._id)) {
            exInCurCategory.push(e);
        };
    });
    exInCurCategory.sort(function(a,b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
        }
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
        }
        return 0
    });
    if (req.query.catChange) {
        curExercise = await Exercise.findOne({ 'name': `${exInCurCategory[0].name}`});
    } else {
        curExercise = await Exercise.findOne({ 'name': `${req.query.curExercise}`});
    } 
    res.render('workouts/new', { title: 'Add Exercise', curDate, categories, curCategory, exInCurCategory, curExercise });
};

async function addExercise(req, res) {
    let workoutId = req.params.id;
    let temp = workoutId.match(/\d+/g);
    let showDate = new Date(temp[2], temp[0] - 1, temp[1]);
    const workout = await Workout.create({ date: showDate, set: []});
    workout.set.push(req.body)
    try {
        await workout.save();
    } catch(err) {
        console.log(err);
    };
    res.redirect(`/workouts/${req.params.id}`)
};