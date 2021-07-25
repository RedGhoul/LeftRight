const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const client = require('../database/database');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    user = client.query('SELECT * FROM `users` WHERE email = ?;',
      [email], (err, res) => {
        if (err || !res) {
          return done(null, false, { message: 'No user with that email' })
        }

        user = {
          id: res[0].id,
          email: res[0].email,
          name: res[0].name,
          password: res[0].password
        };

        bcrypt.compare(password, user.password, function (err, res) {
          if (err) {
            return done(null, false, { message: 'Password incorrect' })
          } else {
            return done(null, user)
          }
        })

      });

  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    client.query('SELECT * FROM `users` WHERE id = ?;', [id], (err, res) => {
      return done(null, {
        id: res[0].id,
        email: res[0].email,
        name: res[0].name,
      })
    });

  })
}

module.exports = initialize
