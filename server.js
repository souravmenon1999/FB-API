const express = require('express');
const https = require('https');
const selfsigned = require('selfsigned');
const app = express();
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const routes = require('./routes.js');
const config = require('./config');

// Generate self-signed certificate
const pems = selfsigned.generate();
const options = {
  key: pems.private,
  cert: pems.cert
};

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;  // Store the access token in the profile object
  return done(null, profile);
}));

app.use('/', routes);

const port = 3000;
https.createServer(options, app).listen(port, () => {
  console.log('App listening on port ' + port);
});
