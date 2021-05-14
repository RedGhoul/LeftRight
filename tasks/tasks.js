const client = require('../database/database');
const cheerio = require('cheerio');
const Queue = require('bull');
const { SentimentAnalyzer } = require('node-nlp');

const { setQueues, BullAdapter, router } = require('bull-board');
const puppeteer = require('puppeteer');
const mainqq = new Queue('mainqq', {
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSPORT
    }
});
const UpLoadFileImage = require('../tasks/uploader');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
setQueues([
    new BullAdapter(mainqq)
]);
async function StartProcesses() {
    mainqq.process(async function (job, done) {
        try {
            client.query(`SELECT * FROM newssite;`).then(async (result, err) => {
                if (err) {
                    return;
                }
                for (let index = 0; index < result.rows.length; index++) {
                    try {
                        const element = result.rows[index];
                        console.log("Processing");
                        console.log(element);
                        const sentiment = new SentimentAnalyzer({ language: 'en' });

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
                            await page.goto(element.url, {
                                waitUntil: 'networkidle2'
                            });
                        } catch (error) {
                            console.log("Happend during await page.goto(element.url");
                            console.log(error);
                            await browser.close();
                            continue;
                        }
                        let fileName = `${element.name + uuidv4()}.png`;
                        await page.screenshot({ path: fileName, fullPage: true })
                        await UpLoadFileImage(fileName);
                        let snapShotId = await CreateSnapShot(element.id, fileName);
                        const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                        if (!data) {
                            console.log("Data was none");
                            console.log(data);
                            return;
                        }
                        const $ = cheerio.load(data);
                        if (element.name === 'CNN') {
                            const stuff = $(".cd__headline-text");
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i].children[0].data) {
                                        let headline = stuff[i].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);

                                    }
                                } catch (error) {
                                    console.log("Happend in For Loop");
                                    console.log("Error found in CNN");
                                    console.log(error);
                                }

                            }
                            console.log("Done CNN");
                        } else if (element.name === 'HuffPost') {
                            const stuff = $(".card__headline__text");
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i].children[0].data) {
                                        let headline = stuff[i].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);

                                    }
                                } catch (error) {
                                    console.log("Happend in For Loop");
                                    console.log("Error found in HuffPost");
                                    console.log(error);
                                }

                            }
                            console.log("Done HuffPost");
                        } else if (element.name === 'Fox') {
                            const stuff = $(".title.title-color-default");
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i].children[0].children[0].data) {
                                        let headline = stuff[i].children[0].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);

                                    }
                                } catch (error) {
                                    console.log("Happend in For Loop");
                                    console.log("Error found in Fox");
                                    console.log(error);
                                }

                            }
                            console.log("Done Fox");
                        } else if (element.name === 'FT') {
                            const stuff = $(".js-teaser-heading-link");
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i].children[0].data) {
                                        let headline = stuff[i].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);

                                    }
                                } catch (error) {
                                    console.log("Happend in For Loop");
                                    console.log("Error found in FT");
                                    console.log(error);
                                }

                            }
                        } else if (element.name === 'BBC') {
                            const stuff = $(".media__link");
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i].children[0].data) {
                                        let headline = stuff[i].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);

                                    }
                                } catch (error) {
                                    console.log("Happend in For Loop");
                                    console.log("Error found in BBC");
                                    console.log(error);
                                }

                            }
                        } else if (element.name === 'washingtonpost') {
                            const stuff = $(".font--headline");
                            console.log(stuff);
                            if (!stuff) {
                                console.log("Error occured in washingtonpost for loop");
                                console.log(stuff);
                                continue;
                            }
                            for (i = 0; i < stuff.length; i++) {
                                try {
                                    if (stuff[i] || stuff[i].children || stuff[i].children[0].children[0].children[0].data) {
                                        let headline = stuff[i].children[0].children[0].children[0].data.trim();
                                        let result = await sentiment.getSentiment(headline)
                                        await CreateHeadLines(headline, result, snapShotId);
                                    }

                                } catch (error) {
                                    console.log("Happend in For Loop - stuff[i].children[0].children[0].children[0].data");
                                    console.log("Error found in washingtonpost");
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

        } catch (error) {
            console.log("Big Error Done");
            console.log(error);
            done();
        }
        done();
    });
    const myJob = await mainqq.add(
        { gettingallheadlines: 'gettingallheadlines' },
        {
            attempts: 3,
            backoff: {
                type: 'jitter'
            }, repeat: { cron: '*/70 * * * *' }
        }
    );

}
const CreateSnapShot = async (newssite_id, imageurl,) => {
    let stuff = await client.query(`INSERT INTO snapshot (newssite_id, imageurl) VALUES ($1, $2) RETURNING id`,
        [newssite_id, imageurl]);
    return stuff.rows[0].id;
}


const CreateHeadLines = async (headline, value_text_sentiment, snapshot_id) => {
    await client.query(`INSERT INTO headline (value_text, value_text_sentiment, snapshot_id) VALUES ($1, $2, $3)`,
        [headline, value_text_sentiment, snapshot_id]);
}
module.exports = {
    StartProcesses: StartProcesses,
    Router: router
}

