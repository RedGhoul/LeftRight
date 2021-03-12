const client = require('../database/database');
const bcrypt = require('bcryptjs')

const GetHomePage = (req, res) => {
    return res.render('home.ejs');
}

const GetLoginPage = (req, res) => {
    return res.render('login.ejs');
}

const GetRegister = (req, res) => {
    return res.render('register.ejs');
}

const PostRegister = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const res = await client.query(`INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3);`, [req.body.name, req.body.email, hashedPassword]);
        return res.redirect('/login');
    } catch {
        return res.redirect('/register');
    }
}

const Logout = (req, res) => {
    req.logOut();
    return res.redirect('/login');
}

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login')
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    GetLoginPage: GetLoginPage,
    GetRegister: GetRegister,
    PostRegister: PostRegister,
    Logout: Logout,
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated,
    GetHomePage: GetHomePage
}
