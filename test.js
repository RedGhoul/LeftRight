require('dotenv').config()
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const client = require('./database/database');
//const UpLoadFileImage = require('./tasks/uploader');


client.query(`SELECT * FROM newssite;`).then(async (result, err) => {
    if (err) {
        return;
    }
    for (let index = 0; index < result.rows.length; index++) {
        try {
            const element = result.rows[index];
            console.log("Processing");
            console.log(element);
            //const sentiment = new SentimentAnalyzer({ language: 'en' });

            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                headless: true
            });
            const page = await browser.newPage();

            await page.setDefaultNavigationTimeout(0);

            console.log("const page = await browser.newPage();");
            try {
                await page.goto(element.url, {
                    waitUntil: 'networkidle2'
                });
            } catch (error) {
                console.log(error);
                await browser.close();
                return;
            }
            //let fileName = `${element.name + uuidv4()}.png`;
            //await page.screenshot({ path: fileName, fullPage: true })
            //await UpLoadFileImage(fileName);
            let snapShotId = await CreateSnapShot(element.id, "fileName");
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            const $ = cheerio.load(data);
            if (element.name === 'CNN') {
                const stuff = $(".cd__headline-text");
                for (i = 0; i < stuff.length; i++) {
                    try {
                        if (stuff[i].children[0].data) {
                            // let headline = stuff[i].children[0].data;
                            // let result = await sentiment.getSentiment(headline)
                            // await CreateHeadLines(headline, result, snapShotId);

                        }
                    } catch (error) {
                        console.log("Error found in CNN");
                        console.log(error);
                    }

                }
            } else if (element.name === 'HuffPost') {
                const stuff = $(".card__headline__text");
                for (i = 0; i < stuff.length; i++) {
                    try {
                        if (stuff[i].children[0].data) {
                            // let headline = stuff[i].children[0].data;
                            // let result = await sentiment.getSentiment(headline)
                            // await CreateHeadLines(headline, result, snapShotId);

                        }
                    } catch (error) {
                        console.log("Error found in HuffPost");
                        console.log(error);
                    }

                }
            } else if (element.name === 'Fox') {
                const stuff = $(".title.title-color-default");
                for (i = 0; i < stuff.length; i++) {
                    try {
                        if (stuff[i].children[0].children[0].data) {
                            // let headline = stuff[i].children[0].children[0].data;
                            // let result = await sentiment.getSentiment(headline)
                            // await CreateHeadLines(headline, result, snapShotId);

                        }
                    } catch (error) {
                        console.log("Error found in Fox");
                        console.log(error);
                    }

                }
            } else if (element.name === 'FT') {
                // const stuff = $(".js-teaser-heading-link");
                // for (i = 0; i < stuff.length; i++) {
                //     try {
                //         if (stuff[i].children[0].data) {
                //             let headline = stuff[i].children[0].data;
                //             let result = await sentiment.getSentiment(headline)
                //             await CreateHeadLines(headline, result, snapShotId);

                //         }
                //     } catch (error) {
                //         console.log("Error found in Fox");
                //         console.log(error);
                //     }

                // }
            }
            else if (element.name === 'BBC') {
                const stuff = $(".media__link");
                for (i = 0; i < stuff.length; i++) {
                    try {
                        if (stuff[i].children[0].data) {
                            let headline = stuff[i].children[0].data.trim();
                            let result = await sentiment.getSentiment(headline)
                            await CreateHeadLines(headline, result, snapShotId);

                        }
                    } catch (error) {
                        console.log("Error found in Fox");
                        console.log(error);
                    }

                }
            }

            await browser.close();
            console.log("await browser.close();");
            console.log("Completed " + element.name);
        } catch (error) {
            console.log("Error Occured");
            console.log(error)
        }
    }
    console.log("Done Job Exiting");
    done();
});

const CreateSnapShot = async (newssite_id, imageurl) => {
    let stuff = await client.query(`INSERT INTO snapshot (newssite_id, imageurl) VALUES ($1, $2) RETURNING id`,
        [newssite_id, imageurl]);
    return stuff.rows[0].id;
}


const CreateHeadLines = async (headline, snapshot_id) => {
    await client.query(`INSERT INTO headline (value_text, snapshot_id) VALUES ($1, $2)`,
        [headline, snapshot_id]);
}

