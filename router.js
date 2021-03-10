const client = require('./database');
const GetCreateNewsSite = (req, res) => {
    return res.render('create.ejs');
};

const PostCreateNewsSite = (req, res) => {
    client.query(`INSERT INTO newssite (name, url)
    VALUES ($1, $2);`, [req.body.Name, req.body.Url], (err, result) => {
        return res.redirect("/");
    });
}

module.exports = {
    GetCreateNewsSite: GetCreateNewsSite,
    PostCreateNewsSite: PostCreateNewsSite
}
