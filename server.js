if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { Router, StartProcesses } = require('./tasks');
const { GetCreateNewsSite, PostCreateNewsSite,
  GetNewsSites } = require('./router_newssites');

const { GetLoginPage, GetRegister,
  PostRegister, Logout, checkAuthenticated,
  checkNotAuthenticated, GetHomePage } = require('./router_auth');

const initializePassport = require('./passport-config');

initializePassport(passport);
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use('/admin/queues', checkAuthenticated, Router);
app.get('/', GetHomePage);
app.get('/login', checkNotAuthenticated, GetLoginPage);
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));
app.get('/register', checkNotAuthenticated, GetRegister);
app.post('/register', checkNotAuthenticated, PostRegister);
app.delete('/logout', Logout);
app.get("/NewSite/Create", checkAuthenticated, GetCreateNewsSite);
app.post("/NewSite/Create", checkAuthenticated, PostCreateNewsSite);
app.get("/NewSite", checkAuthenticated, GetNewsSites);
StartProcesses();
app.listen(3000, () => {
  console.log("Connected !");
})
