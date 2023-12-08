var express = require('express');
var router = express.Router();
const exercisesCtrl = require('../controllers/exercises')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, exercisesCtrl.index);
router.get('/new', ensureLoggedIn, exercisesCtrl.new);
router.get('/:id', ensureLoggedIn, exercisesCtrl.show);
router.post('/', ensureLoggedIn, exercisesCtrl.create);
router.post('/categories', ensureLoggedIn, exercisesCtrl.newCategory);
router.delete('/:id', ensureLoggedIn, exercisesCtrl.deleteExercise);
router.delete('/:id/category', ensureLoggedIn, exercisesCtrl.deleteCategory);

module.exports = router;