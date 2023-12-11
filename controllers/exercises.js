const Exercise = require('../models/exercise');
const Category = require('../models/category');
const exTypes = ['Weight', 'Reps', 'Distance', 'Time', 'Weight and Reps', 'Distance and Time', 'Weight and Distance', 'Weight and Time', 'Reps and Distance', 'Reps and Time'];
const weightUnits = ['lbs', 'kgs'];
const distanceUnits = ['ft', 'mi', 'm', 'km'];

module.exports = {
    index,
    new: newExercise,
    create,
    show,
    newCategory,
    deleteExercise,
    deleteCategory,
    edit,
    update
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
    res.render('exercises/index', { title: 'All Exercises' , categories, exercises });
};

async function newExercise(req, res) {
    categories = (await findUserExercises(req, res)).categories;
    res.render('exercises/new', { title: 'New Exercise', categories, exTypes, weightUnits, distanceUnits, errorMsg: '' });
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
    res.render('exercises/show', { title: exercise.name, exercise, id: req.params.id, errorMsg: '' });
};

async function newCategory(req, res) {
    try {
        const existingCategory = await Category.find({ name: req.body.name })
        if (!existingCategory[0]) {
            const category = await Category.create(req.body);
            console.log(category)
            req.user.category.push(category);
        } else {
            let same = false;
            for (const c of req.user.category) {
                const category = await Category.findById(c);
                if (req.body.name === category.name) {
                    same = true;
                    break
                };
            };
            if (!same) {
                req.user.category.push(existingCategory[0]);
            };
        };
        await req.user.save();
        res.redirect('/exercises/new');
    } catch(err) {
        console.log(err);
        res.render('exercises/new', { errorMsg: err.message })
    };
};

async function deleteExercise(req, res) {
    req.user.exercise.remove(req.params.id);
    await req.user.save();
    res.redirect('/exercises');
}

async function deleteCategory(req, res) {
    req.user.category.remove(req.params.id);
    await req.user.save();
    res.redirect('/exercises');
}

async function edit(req, res) {
    const categories = (await findUserExercises(req, res)).categories;
    const exercise = await Exercise.findById(req.params.id);
    const id = req.params.id
    res.render('exercises/edit', { title: 'Edit Exercise', exercise, categories, exTypes, weightUnits, distanceUnits, id, errorMsg: '' })
}

async function update(req, res) {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (exercise.catName !== req.body.catName) {
            const category = await Category.find({ name: exercise.catName });
            category[0].exercise.remove(req.params.id);
            await category[0].save();
            const newCategory = await Category.find({ name: req.body.catName });
            newCategory[0].exercise.push(exercise);
            await newCategory[0].save();
        };
        await Exercise.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.redirect('/exercises');
    } catch(err) {
        console.log(err);
        res.redirect('/exercises');
    };
};