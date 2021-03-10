const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const client = require('./database');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    user = client.query(`SELECT * FROM users WHERE email = $1;`, [email], (err, res) => {
      if (!res.rows[0]) {
        return done(null, false, { message: 'No user with that email' })
      }
      user = {
        id: res.rows[0].id,
        email: res.rows[0].email,
        name: res.rows[0].name,
        password: res.rows[0].password
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
    client.query(`SELECT * FROM users WHERE id = $1;`, [id], (err, res) => {
      return done(null, {
        id: res.rows[0].id,
        email: res.rows[0].email,
        name: res.rows[0].name,
      })
    });

  })
}

module.exports = initialize
