const Exercise = require('../models/exercise');
const Category = require('../models/category');
const Workout = require('../models/workout');

module.exports = {
    index,
    show
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
        let categoryCheck = false;
        for (const c of categories) {
            if (c.exercise.includes(e._id)) {
                categoryCheck = true;
                break;
            };
        };
        if (!categoryCheck) {
            req.user.exercise.remove(e);
            await req.user.save();
        }
        exercises.push(await Exercise.findById(e));
    };
    return { categories: categories, exercises: exercises }
};

async function index(req, res) {
    const categories = (await findUserExercises(req, res)).categories;
    const exercises = (await findUserExercises(req, res)).exercises;
    for (let i = 0; i < categories.length; i++) {
        let categoryCheck = false;
        for (e of exercises) {
            if (categories[i].exercise.includes(e._id)) {
                categoryCheck = true;
                break;
            };
        };
        if (!categoryCheck) {
            categories.splice(i, 1);
        };
    };
    res.render('analysis/index', { title: 'Analysis', categories, exercises })
}

async function show(req, res) {
    const exercise = await Exercise.findById(req.params.id);
    const workouts = await Workout.find({ 'set.exerciseName': exercise.name }).sort({ date: 1 });
    const workoutDates = [];
    const workoutMaxWeights = [];
    for (w of workouts) {
        const date = w.date.toLocaleDateString();
        workoutDates.push(date);
        for (s of w.set) {
            if (s.exerciseName === exercise.name) {
                const maxWeight = Math.max(...s.weight);
                if (workoutMaxWeights.length) {
                    if (maxWeight > Math.max(...workoutMaxWeights)) {
                        workoutMaxWeights.push(maxWeight);
                    } else {
                        workoutMaxWeights.push(Math.max(...workoutMaxWeights));
                    };
                } else {
                    workoutMaxWeights.push(maxWeight);
                };
            };
        };
    };
    console.log(workoutDates, workoutMaxWeights)
    const yMax = Math.max(...workoutMaxWeights) + 10;
    res.render('analysis/show', { title: exercise.name, exercise, workouts, workoutDates, workoutMaxWeights, yMax })
}
