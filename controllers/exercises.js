const Exercise = require('../models/exercise');

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
        res.redirect('/exercises');
    } catch(err) {
        console.log(err);
        res.render('exercises/new', {errorMsg: err.message});
    };
};