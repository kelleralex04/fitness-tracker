const Exercise = require('../models/exercise');
const Category = require('../models/category');
const Workout = require('../models/workout')
const e = require('express');

module.exports = {
    index,
    calendar,
    show,
    new: newWorkout,
    addExercise,
    edit,
    update,
    delete: deleteSet,
    deleteWorkout
};

let date = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ];
curMonth = date.getMonth();
curYear = date.getFullYear();
let today = [date.getDate(), date.getMonth(), date.getFullYear()];

async function index(req, res) {
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

    const workoutDays = [];
    const workoutsThisMonth = await Workout.find({ date: { $gte: `${curYear}-${curMonth + 1}-1`, $lte: `${curYear}-${curMonth + 1}-${lastDateOfMonth}` }})
    for (w of workoutsThisMonth) {
        workoutDays.push(w.date.getDate());
    };
    res.render('workouts/index', { title: 'Workouts', curMonthText, curYear, lastDateOfMonth, firstDayOfMonth, lastDateOfPrevMonth, lastDayOfMonth, today, workoutDays });
};

function calendar(req, res) {
    if (req.body.prev) {
        curMonth -= 1;
    } else if (req.body.next) {
        curMonth += 1;
    };
    res.redirect('/workouts');
};

async function findUserExercises(req, res) {
    const categories = [];
    const exercises = [];
    for (const c of req.user.category) {
        const curCategory = await Category.findById(c);
        for (const e of req.user.exercise) {
            if (curCategory.exercise.includes(e)) {
                categories.push(curCategory);
                break
            };
        };
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
    for (const e of categories[0].exercise) {
        exercises.push(await Exercise.findById(e))
    };
    exercises.sort(function(a,b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
        };
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
        };
        return 0
    });
    return { categories: categories, exercises: exercises }
};

async function show(req, res) {
    const categories = (await findUserExercises(req, res)).categories;
    const exercises = (await findUserExercises(req, res)).exercises;
    let workoutId = req.params.id;
    let temp = workoutId.match(/\d+/g);
    let date = new Date(temp[2], temp[0] - 1, temp[1])
    let showDate = date.toDateString();
    let firstCategory = categories[0].name;
    let firstExercise = exercises[0].name;
    let todaysWorkouts = await Workout.find({ date: date, user: req.user._id });
    res.render('workouts/show', { title: showDate, workoutId, firstCategory, firstExercise, todaysWorkouts });
};

async function newWorkout(req, res) {
    let curDate = req.params.id;
    const categories = (await findUserExercises(req, res)).categories;
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
    };
    const setsNum = req.query.setsNum;
    res.render('workouts/new', { title: 'Add Exercise', curDate, categories, curCategory, exInCurCategory, curExercise, setsNum });
};

async function addExercise(req, res) {
    let workoutId = req.params.id;
    let temp = workoutId.match(/\d+/g);
    let showDate = new Date(temp[2], temp[0] - 1, temp[1]);
    const workoutExists = await Workout.find({ date: showDate, user: req.user})
    if (!workoutExists[0]) {
        const workout = await Workout.create({ date: showDate, set: [], user: req.user});
        workout.set.push(req.body)
        try {
            await workout.save();
        } catch(err) {
            console.log(err);
        };
    } else {
        let exists = false;
        for (const s of workoutExists[0].set) {
            if (s.exerciseName === req.body.exerciseName) {
                s.setsNum += parseInt(req.body.setsNum);
                s.weight.push(req.body.weight);
                s.reps.push(req.body.reps);
                s.distance.push(req.body.distance);
                s.timeH.push(req.body.timeH);
                s.timeM.push(req.body.timeM);
                s.timeS.push(req.body.timeS);
                exists = true;
                break
            };
        };
        if (!exists) {
            workoutExists[0].set.push(req.body)
        }
        try {
            await workoutExists[0].save();
        } catch(err) {
            console.log(err);
        };
    };
    res.redirect(`/workouts/${req.params.id}`);
};

async function edit(req, res) {
    try {
        const workoutId = req.params.id;
        const workout = await Workout.find({ "set._id": workoutId })
        const curSet = workout[0].set.filter(s => {
            if (workoutId === String(s._id)) {
                return true
            };
        });
        const set = curSet[0];
        let setsNum = parseInt(req.query.setsNum);
        const curDate = req.query.curDate;
        res.render('workouts/edit', { title: 'Edit Workout', set, curDate, workoutId, setsNum });
    } catch(err) {
        console.log(err);
        res.redirect('/home');
    };
};

async function update(req, res) {
    try {
        const workoutId = req.params.id;
        let workout = await Workout.find({ "set._id": workoutId });
        workout = workout[0]
        for (let i = 0; i < workout.set.length; i++) {
            if (String(workout.set[i]._id) === req.params.id) {
                workout.set[i].setsNum = req.body.setsNum
                workout.set[i].weight = req.body.weight
                workout.set[i].reps = req.body.reps
                workout.set[i].distance = req.body.distance
                workout.set[i].timeH = req.body.timeH
                workout.set[i].timeM = req.body.timeM
                workout.set[i].timeS = req.body.timeS
                await workout.save();
                break
            };
        };
        res.redirect(`/workouts/${req.body.curDate}`)
    } catch(err) {
        console.log(err);
        res.redirect('/home');
    };
};

async function deleteSet(req, res) {
    try {
        const workoutId = req.params.id;
        let workout = await Workout.find({ "set._id": workoutId });
        let idx
        let setsNum = parseInt(req.query.setsNum);
        const deleteIdx = req.body.deleteIdx;
        workout = workout[0];
        for (let i = 0; i < workout.set.length; i++) {
            if (String(workout.set[i]._id) === req.params.id) {
                workout.set[i].setsNum -= 1;
                if (workout.set[i].weight[0]) {
                    workout.set[i].weight.splice(deleteIdx, 1);
                };
                if (workout.set[i].distance[0]) {
                    workout.set[i].distance.splice(deleteIdx, 1);
                };
                if (workout.set[i].reps[0]) {
                    workout.set[i].reps.splice(deleteIdx, 1);
                };
                if (workout.set[i].timeH[0]) {
                    workout.set[i].timeH.splice(deleteIdx, 1);
                    workout.set[i].timeM.splice(deleteIdx, 1);
                    workout.set[i].timeS.splice(deleteIdx, 1);
                };
                await workout.save();
                idx = i;
                setsNum -= 1;
                break
            };
        };
        res.redirect(`/workouts/${workoutId}/edit?curDate=${req.query.curDate}&setsNum=${setsNum}`)
    } catch(err) {
        console.log(err);
        res.redirect('/home');
    };
};

async function deleteWorkout(req, res) {
    try {
        const workoutId = req.params.id;
        let workout = await Workout.find({ "set._id": workoutId });
        workout = workout[0];
        for (let i = 0; i < workout.set.length; i++) {
            if (String(workout.set[i]._id) === req.params.id) {
                workout.set.splice(i, 1);
                await workout.save();
                break
            };
        };
        if (!workout.set.length) {
            Workout.deleteOne({ _id: workout._id }).then();
        };
        res.redirect(`/workouts/${req.query.curDate}`)
    } catch(err) {
        console.log(err);
        res.redirect('/workouts');
    };
};