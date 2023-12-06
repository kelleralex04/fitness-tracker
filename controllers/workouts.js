const Exercise = require('../models/exercise');
const Category = require('../models/category');

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
    let showDate = new Date(temp[2], temp[0], temp[1]).toDateString();
    res.render('workouts/show', { title: showDate, workoutId, category });
};

async function newWorkout(req, res) {
    const categories = await Category.find({}).sort({ 'name': 1 });
    const exercises = [];
    for (const e of req.user.exercise) {
        exercises.push(await Exercise.findById(e));
    };
    let curDate = req.params.id;
    let curCategory = req.query.curCategory;
    console.log(curCategory)
    res.render('workouts/new', { title: 'Add Exercise', curDate, exercises, categories, curCategory });
};

function addExercise(req, res) {
    res.redirect(`/workouts/${req.params.id}`)
};