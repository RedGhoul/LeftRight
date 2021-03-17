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

const DeleteNewsSites = (req, res) => {
    if (req.params.id) {
        client.query(`DELETE FROM newssite WHERE id = $1;`, [req.params.id], (err, result) => {
            return res.sendStatus(200);
        });
    }
}

const UpdateNewsSites = (req, res) => {
    if (req.params.id) {
        client.query(`UPDATE newssite SET name = $1, url = $2 WHERE id = $3;`,
            [req.body.Name, req.body.Url, req.params.id], (err, result) => {
                return res.redirect("/NewsSite/All");
            });
    }

}

const GetUpdateNewsSitesForm = (req, res) => {
    if (req.params.id) {
        client.query(`SELECT * FROM newssite where id = $1 limit 1;`, [req.params.id], (err, result) => {
            if (result.rows) {
                return res.render('news_sites/update_news_site.ejs', { data: result.rows[0] });
            }
            return res.redirect("/NewsSite/All");
        });
    }

}

module.exports = {
    GetCreateNewsSite: GetCreateNewsSite,
    PostCreateNewsSite: PostCreateNewsSite,
    GetNewsSites: GetNewsSites,
    UpdateNewsSites: UpdateNewsSites,
    DeleteNewsSites: DeleteNewsSites,
    GetUpdateNewsSitesForm: GetUpdateNewsSitesForm
}
