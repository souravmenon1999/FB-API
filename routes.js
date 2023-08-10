const passport = require('passport');
const express = require('express');
const axios = require('axios');  // <-- Added axios import here
var router = express.Router();

router.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('pages/profile.ejs', {
    user: req.user
  });
});

router.get('/error', isLoggedIn, function (req, res) {
  res.render('pages/error.ejs');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email'],
  auth_type: 'consent'
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  }));

router.post('/logoutFromFacebook', function(req, res) {
    res.redirect('https://www.facebook.com/logout.php?next=http://localhost:3000/logout&access_token='+req.body['accessToken']);
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function(err) {
        if (err) {
            console.error("Error destroying session:", err);
            res.redirect('/error');
        } else {
            res.clearCookie('connect.sid');
            console.log("Session data after destruction:", req.session);
            res.redirect('/');
        }
    });
});

// <-- Added the fetch-insights route here

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = router;
