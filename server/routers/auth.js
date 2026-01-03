const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const { Credential, User } = require('../db');

/**
 * @module authRouter
 * @description This router follows the [Google authentication tutorial]{@link https://www.passportjs.org/tutorials/google/}
 * from Passport, with substitutions to account for using promises with Mongoose
 * rather than callbacks with SQLite. See the tutorial for further information.
 */

/**
 * @name GoogleStrategy Verify
 * @description The verify callback passed to GoogleStrategy handles the database logic of finding
 * or creating new Credential and User documents based on the issuer and profile provided by Google.
 */
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile']
},
  function verify(issuer, profile, cb) {
    Credential.find({provider: issuer, subject: profile.id})
      .then((credentials) => {
        if(!credentials.length){
          User.create({name: profile.displayName})
            .then((newUser) => {
              Credential.create({userId: newUser._id, provider: issuer, subject: profile.id})
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
          User.findById(credentials[0].userId)
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

/**
 * The endpoint that directs a user to the Google signin.
 * @name GET /login/federated/google
 */
router.get('/login/federated/google', passport.authenticate('google'));

/**
 * The endpoint that users are redirected to after signing in with Google.
 * NOTE: this endpoint MUST be registered as an Authorized Redirect URI in the
 * Google Cloud Platform (see [the tutorial]{@link https://www.passportjs.org/tutorials/google/register/}
 * for more information). This also means that the server must have a domain that satisfies
 * Google's requirements or you can't register the Redirect URI and authentication won't work.
 * Localhost and AWS Elastic IPs (need the one that ends in amazonaws.com) work, bare IP addresses do not.
 * @name GET /oauth2/redirect/google
 */
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/'
}));

/**
 * Allows the client application to request user data to know if it's logged in or not.
 * @name GET /user
 */
router.get('/user', (req, res) => {
  const { passport } = req.session;
  res.send(passport ? passport.user.name : null);
});

/**
 * The endpoint that handles logging out and clearing the session.
 * @name POST /logout
 */
router.post('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.save(function(err) {
    if (err) { return next(err); }

    req.session.regenerate(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
});

module.exports = router;
