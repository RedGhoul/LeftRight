const client = require('../database/database');

const GetCreateNewsSite = (req, res) => {
    return res.render('news_sites/create_news_site.ejs');
};

const PostCreateNewsSite = (req, res) => {
    client.query(`INSERT INTO newssite (name, url)
    VALUES ($1, $2);`, [req.body.Name, req.body.Url], (err, result) => {
        return res.redirect("/");
    });
}

const GetNewsSites = (req, res) => {
    client.query(`SELECT * FROM newssite;`, [], (err, result) => {
        return res.render('news_sites/view_all_news_sites.ejs', { data: result.rows });
    });
}

module.exports = {
    GetCreateNewsSite: GetCreateNewsSite,
    PostCreateNewsSite: PostCreateNewsSite,
    GetNewsSites: GetNewsSites
}
