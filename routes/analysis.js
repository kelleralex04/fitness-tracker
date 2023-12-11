var express = require('express');
var router = express.Router();
const analysisCtrl = require('../controllers/analysis');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', ensureLoggedIn, analysisCtrl.index);

module.exports = router;