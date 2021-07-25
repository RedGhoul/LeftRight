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
        const res = await client.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?);', [req.body.name, req.body.email, hashedPassword]);
        return res.redirect("/NewsSite/All");
    } catch {
        return res.redirect('/register');
    }
}

const Logout = (req, res) => {
    req.logOut();
    return res.redirect('/login');
}



module.exports = {
    GetLoginPage: GetLoginPage,
    GetRegister: GetRegister,
    PostRegister: PostRegister,
    Logout: Logout,
    GetHomePage: GetHomePage
}
