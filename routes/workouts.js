var express = require('express');
var router = express.Router();
const workoutsCtrl = require('../controllers/workouts')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, workoutsCtrl.index);
router.get('/:id/exercises/new', ensureLoggedIn, workoutsCtrl.new);
router.get('/:id/edit', ensureLoggedIn, workoutsCtrl.edit);
router.get('/:id', ensureLoggedIn, workoutsCtrl.show);
router.post('/calendar', ensureLoggedIn, workoutsCtrl.calendar);
router.post('/:id/exercises', ensureLoggedIn, workoutsCtrl.addExercise);
router.post('/:id', ensureLoggedIn, workoutsCtrl.update);
router.delete('/:id', ensureLoggedIn, workoutsCtrl.delete);

module.exports = router;