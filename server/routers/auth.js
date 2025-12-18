const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const db = require('../db');
const trainingRouter = require('./training');

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile']
},
  function verify(issuer, profile, cb) {
    db.Credential.find({provider: issuer, subject: profile.id})
      .then((credentials) => {
        if(!credentials.length){
          db.User.create({name: profile.displayName})
            .then((newUser) => {
              db.Credential.create({userId: newUser._id, provider: issuer, subject: profile.id})
                .then(() => {
                  const user = {
                    id: newUser._id,
                    name: profile.displayName
                  };
                  return cb(null, user);
                })
                .catch((err) => {
                  console.error(err);
                  return cb(err);
                });
            })
            .catch((err) => {
              console.error(err);
              return cb(err);
            });
        } else {
          db.User.findById(credentials[0].userId)
            .then((user) => {
              if(!user){
                return cb(null, false);
              }
              return cb(null, user);
            })
            .catch((err) => {
              console.error(err);
              return cb(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        return cb(err);
      });
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, {id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

const router = express.Router();

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  // req.logout(function(err) {
  //   if (err) { return next(err); }
  //   res.redirect('/');
  // });
  req.session.user = null;
  req.session.save(function(err) {
    if (err) { return next(err); }

    req.session.regenerate(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
});

router.use('/training', trainingRouter);

module.exports = router;
