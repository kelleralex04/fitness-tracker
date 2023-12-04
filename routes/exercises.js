var express = require('express');
var router = express.Router();
const exerciseCtrl = require('../controllers/exercises')

/* GET users listing. */
router.get('/', exerciseCtrl.index);
router.get('/new', exerciseCtrl.new);
router.post('/', exerciseCtrl.create);

module.exports = router;