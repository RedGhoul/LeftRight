const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const client = require('./database/database');
client.query(`SELECT * FROM newssite;`, (err, result) => {
    result.rows.forEach(element => {
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                timeout: 100000
            });
            const page = await browser.newPage();
            try {
                await page.goto(element.url, {
                    waitUntil: 'networkidle2'
                });
            } catch (error) {
                await browser.close();
                return;
            }
            let snapShotId = await CreateSnapShot(element.id, '');
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            const $ = cheerio.load(data);
            if (element.name === 'CNN') {
                const stuff = $(".cd__headline-text");
                for (i = 0; i < stuff.length; i++) {
                    if (stuff[i].children[0].data) {
                        await CreateHeadLines(stuff[i].children[0].data, snapShotId);
                    }
                }
            } else if (element.name === 'HuffPost') {
                const stuff = $(".card__headline__text");
                for (i = 0; i < stuff.length; i++) {
                    if (stuff[i].children[0].data) {
                        await CreateHeadLines(stuff[i].children[0].data, snapShotId);
                    }
                }
            } else if (element.name === 'Fox') {
                const stuff = $(".title.title-color-default");
                for (i = 0; i < stuff.length; i++) {
                    if (stuff[i].children[0].children[0].data) {
                        await CreateHeadLines(stuff[i].children[0].children[0].data, snapShotId);
                    }
                }
            }

            await page.screenshot({ path: `${element.name}example.png`, fullPage: true });
            await browser.close();
            return;
        })();
    });

});

const CreateSnapShot = async (newssite_id, imageurl) => {
    let stuff = await client.query(`INSERT INTO snapshot (newssite_id, imageurl) VALUES ($1, $2) RETURNING id`,
        [newssite_id, imageurl]);
    return stuff.rows[0].id;
}


const CreateHeadLines = async (headline, snapshot_id) => {
    await client.query(`INSERT INTO headline (headline, snapshot_id) VALUES ($1, $2)`,
        [headline, snapshot_id]);
}

