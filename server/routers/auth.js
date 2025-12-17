const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const db = require('../db');

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile']
},
  function verify(issuer, profile, cb) {
    console.log('inside verify function');
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

const router = express.Router();

router.get('/', (req, res) => { // add 'next' here if needed
  res.send('send login');
});

//with /login/
router.get('/federated/google', passport.authenticate('google'));
// router.get('/federated/google', (req, res) => {
//   res.send('routing is working');
// });

router.get('/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// router.get('/redirect/google', (req, res) => {
//   res.send('google redirect');
// });

module.exports = router;