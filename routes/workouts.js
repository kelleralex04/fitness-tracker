var express = require('express');
var router = express.Router();
const workoutsCtrl = require('../controllers/workouts')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, workoutsCtrl.index);
router.get('/:id', ensureLoggedIn, workoutsCtrl.show);
router.post('/calendar', ensureLoggedIn, workoutsCtrl.calendar);

module.exports = router;