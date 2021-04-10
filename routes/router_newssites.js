const client = require('../database/database');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const UpLoadFileImage = require('../tasks/uploader');
require('dotenv').config();

const GetHeadLine = async (req, res) => {
    let Name = req.body.Name;
    let URL = req.body.Url;
    if (!Name || !URL) {
        return res.json({ error: "error" });
    }

    const browser = await puppeteer.launch({
        args: ['--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process'],
        headless: true
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(90000);

    try {
        await page.goto(URL, {
            waitUntil: 'networkidle2'
        });
    } catch (error) {
        await browser.close();
        return res.json({ error: error });
    }

    let fileName = `${Name + uuidv4()}.png`;
    await page.screenshot({ path: fileName, fullPage: true })
    await UpLoadFileImage(fileName);
    const data = await page.evaluate(() => document.querySelector('*').outerHTML);

    if (!data) {
        console.log("Data was none");
        console.log(data);
        await browser.close();
        return res.json({ error: "Data was none" });
    }

    const $ = cheerio.load(data);

    let listOfHeadLines = []
    try {
        if (Name === 'CNN') {
            const stuff = $(".cd__headline-text");
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i].children[0].data) {
                        let headline = stuff[i].children[0].data.trim();
                        listOfHeadLines.push(headline);

                    }
                } catch (error) {
                    console.log("Happend in For Loop");
                    console.log("Error found in CNN");
                    console.log(error);
                }

            }
        } else if (Name === 'HuffPost') {
            const stuff = $(".card__headline__text");
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i].children[0].data) {
                        let headline = stuff[i].children[0].data.trim();

                    }
                } catch (error) {
                    console.log("Happend in For Loop");
                    console.log("Error found in HuffPost");
                    console.log(error);
                }

            }
        } else if (Name === 'Fox') {
            const stuff = $(".title.title-color-default");
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i].children[0].children[0].data) {
                        let headline = stuff[i].children[0].children[0].data.trim();

                    }
                } catch (error) {
                    console.log("Happend in For Loop");
                    console.log("Error found in Fox");
                    console.log(error);
                }

            }
        } else if (Name === 'FT') {
            const stuff = $(".js-teaser-heading-link");
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i].children[0].data) {
                        let headline = stuff[i].children[0].data.trim();

                    }
                } catch (error) {
                    console.log("Happend in For Loop");
                    console.log("Error found in FT");
                    console.log(error);
                }

            }
        } else if (Name === 'BBC') {
            const stuff = $(".media__link");
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i].children[0].data) {
                        let headline = stuff[i].children[0].data.trim();

                    }
                } catch (error) {
                    console.log("Happend in For Loop");
                    console.log("Error found in BBC");
                    console.log(error);
                }

            }
        } else if (Name === 'washingtonpost') {
            const stuff = $(".font--headline");
            console.log(stuff);
            if (!stuff) {
                console.log("Error occured in washingtonpost for loop");
                console.log(stuff);
                return res.json({ error: "error" });
            }
            for (i = 0; i < stuff.length; i++) {
                try {
                    if (stuff[i] || stuff[i].children || stuff[i].children[0].children[0].children[0].data) {
                        let headline = stuff[i].children[0].children[0].children[0].data.trim();
                    }

                } catch (error) {
                    console.log("Happend in For Loop - stuff[i].children[0].children[0].children[0].data");
                    console.log("Error found in washingtonpost");
                    console.log(error);
                }


            }
        }
    } catch (error) {
        console.log(error);
    }


    await browser.close();
    return res.json({
        photoIdName: fileName,
        HeadLines: listOfHeadLines
    });
}


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
    GetUpdateNewsSitesForm: GetUpdateNewsSitesForm,
    GetHeadLine: GetHeadLine
}
