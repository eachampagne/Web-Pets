
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');

const authRouter = require('./routers/auth.js');
const db = require('./db');

const app = express();
const port = 8080;

const path = require('path');

app.use(express.json());
app.use(express.static(path.resolve('client', 'dist')));

app.use(session({
  secret: 'pastry pets',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: 'mongodb://127.0.0.1:27017/webpets'})
}));

app.use(passport.authenticate('session'));

app.use('/', authRouter);

app.listen(port, () => {
  console.info(`App available on http://localhost:${port} or http://127.0.0.1:${port}`);
});
