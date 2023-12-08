var express = require('express');
var router = express.Router();
const passport = require('passport');
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/home', ensureLoggedIn, function(req, res) {
  res.render('home', { title: 'Home Page'});
});

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/home', { title: 'Home Page'});
  } else {
    res.redirect('/login');
  };
});

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
    prompt: "select_account"
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/home',
    failureRedirect: '/'
  }
));

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});



module.exports = router;
