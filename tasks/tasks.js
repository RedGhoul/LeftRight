const client = require('../database/database');
const cheerio = require('cheerio');
const Queue = require('bull');
const { setQueues, BullAdapter, router } = require('bull-board');
const puppeteer = require('puppeteer');
const mainqq = new Queue('mainqq', {
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSPORT
    }
});
const { v4: uuidv4 } = require('uuid');
setQueues([
    new BullAdapter(mainqq)
]);
async function StartProcesses() {
    mainqq.process(function (job, done) {
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
                    let fileName = `${element.name + new Date().toLocaleDateString("en-US").split('/').join('-')}.png`;
                    await page.screenshot({ path: fileName, fullPage: true })
                        .then((result) => {
                            console.log(result)
                            UpLoadFileImage(fileName);
                        });
                    await browser.close();
                    done();
                    return;
                })();
            });

        });
    });
    const myJob = await mainqq.add(
        { foo: 'bar' },
        {
            repeat: {
                every: process.env.JOB_DELAY,
            }
        }
    );

}

module.exports = {
    StartProcesses: StartProcesses,
    Router: router
}

