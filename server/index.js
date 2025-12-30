
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');

const authRouter = require('./routers/auth.js');
const petRouter = require('./routers/pet.js');
const interactRouter = require('./routers/interaction.js');
const weatherRouter = require('./routers/weather.js');

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
// petRouter
app.use('/pet', petRouter);
app.use('/interact', interactRouter);
app.use('/weather', weatherRouter);

app.listen(port, () => {
  console.info(`App available on http://localhost:${port} or http://127.0.0.1:${port}`);
});
