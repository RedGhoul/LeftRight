const client = require('../database/database');


const mainPageURL = "/NewsSite/All";
const GetHeadLine = async (req, res) => {
    let Name = req.body.Name;
    let URL = req.body.Url;
    if (!Name || !URL) {
        return res.json({ error: "error" });
    }

}


const GetCreateNewsSite = (req, res) => {
    return res.render('news_sites/create_news_site.ejs');
};

const PostCreateNewsSite = (req, res) => {

    if (!req.body.Name || !req.body.Url) return res.redirect(mainPageURL);
    client.query('INSERT INTO `newssite` (name, url) VALUES (?, ?);',
        [req.body.Name, req.body.Url], (err, result) => {
            return res.redirect(mainPageURL);
        });
}

const GetNewsSites = (req, res) => {
    client.query('SELECT * FROM newssite;', [], (err, result) => {
        return res.render('news_sites/view_all_news_sites.ejs', { data: result });
    });
}

const DeleteNewsSites = (req, res) => {
    if (!req.params.id) return res.redirect(mainPageURL);
    client.query('DELETE FROM newssite WHERE id = ?;', [req.params.id], (err, result) => {
        return res.sendStatus(200);
    });

}

const UpdateNewsSites = (req, res) => {
    if (!req.params.id) return res.redirect(mainPageURL);
    client.query('UPDATE newssite SET name = ?, url = ? WHERE id = ?;',
        [req.body.Name, req.body.Url, req.params.id], (err, result) => {
            return res.redirect(mainPageURL);
        });
}

const GetUpdateNewsSitesForm = (req, res) => {
    if (!req.params.id) return res.redirect(mainPageURL);
    client.query('SELECT * FROM newssite where id = ? limit 1;', [req.params.id], (err, result) => {
        if (result) {
            return res.render('news_sites/update_news_site.ejs', { data: result[0] });
        }
        return res.redirect(mainPageURL);
    });

}

module.exports = {
    GetCreateNewsSite: GetCreateNewsSite,
    PostCreateNewsSite: PostCreateNewsSite,
    GetNewsSites: GetNewsSites,
    UpdateNewsSites: UpdateNewsSites,
    DeleteNewsSites: DeleteNewsSites,
    GetUpdateNewsSitesForm: GetUpdateNewsSitesForm,
    GetHeadLine: GetHeadLine
}
