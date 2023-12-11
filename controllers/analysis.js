const Exercise = require('../models/exercise');
const Category = require('../models/category');

module.exports = {
    index
};

function index(req, res) {
    res.render('analysis/index', { title: 'Analysis' })
}
