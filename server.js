if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const schedule = require('node-schedule');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const { GetCreateNewsSite, PostCreateNewsSite,
  GetNewsSites, DeleteNewsSites, UpdateNewsSites, GetUpdateNewsSitesForm } = require('./routes/router_newssites');

const { GetLoginPage, GetRegister,
  PostRegister, Logout, GetHomePage } = require('./routes/router_auth');

const { checkAuthenticated,
  checkNotAuthenticated, addLoginFlag } = require('./middleware/middleware');

const initializePassport = require('./auth/passport-config');

initializePassport(passport);
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
console.log({
  connectionLimit: process.env.MYSQL_CONNECTIONS,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME
})
app.use(methodOverride('_method'));
app.use(addLoginFlag);
app.get('/', GetHomePage);
app.get('/Login', checkNotAuthenticated, GetLoginPage);
app.post('/Login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
app.get('/register', checkNotAuthenticated, GetRegister);
app.post('/register', checkNotAuthenticated, PostRegister);
app.delete('/logout', Logout);
app.get("/NewsSite/All", checkAuthenticated, GetNewsSites);
app.get("/NewsSite/Create", checkAuthenticated, GetCreateNewsSite);
app.post("/NewsSite/Create", checkAuthenticated, PostCreateNewsSite);
app.delete('/NewsSite/Delete/:id', checkAuthenticated, DeleteNewsSites);
app.get('/NewsSite/Update/:id', checkAuthenticated, GetUpdateNewsSitesForm);
app.post('/NewsSite/Update/:id', checkAuthenticated, UpdateNewsSites);

const { gather } = require('./tasks/finder');
const mainJob = schedule.scheduleJob('* * * * *', async function () {
  console.log('The answer to life, the universe, and everything!');
  await gather();
  console.log('ENDDD The answer to life, the universe, and everything!');
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log("Connected ! " + process.env.PORT + ' 0.0.0.0');
})
