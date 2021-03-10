if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const client = require('./database');
const { Router, StartProcesses } = require('./tasks');
const { GetCreateNewsSite, PostCreateNewsSite } = require('./router');
const initializePassport = require('./passport-config');
initializePassport(passport);

StartProcesses();

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

app.get('/', checkAuthenticated, (req, res) => {
  return res.render('index.ejs', { name: req.user.name });
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  return res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  return res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const res = await client.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3);`, [req.body.name, req.body.email, hashedPassword]);
    return res.redirect('/login');
  } catch {
    return res.redirect('/register');
  }
})

app.delete('/logout', (req, res) => {
  req.logOut();
  return res.redirect('/login');
})

app.get("/CreateNewSite", checkAuthenticated, GetCreateNewsSite);
app.post("/CreateNewSite", checkAuthenticated, PostCreateNewsSite);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

app.listen(3000, () => {
  console.log("Connected !");
})
