var express = require('express');
var router = express.Router();
const exerciseCtrl = require('../controllers/exercises')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, exerciseCtrl.index);
router.get('/new', ensureLoggedIn, exerciseCtrl.new);
router.get('/:id', ensureLoggedIn, exerciseCtrl.show);
router.post('/', ensureLoggedIn, exerciseCtrl.create);

module.exports = router;