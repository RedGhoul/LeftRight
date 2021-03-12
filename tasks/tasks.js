const client = require('../database/database');
const cheerio = require('cheerio');
const Queue = require('bull');
const { setQueues, BullAdapter, router } = require('bull-board');
const puppeteer = require('puppeteer');
const mainqq = new Queue('mainqq', {
    redis: {
        port: 6379, host: '127.0.0.1', password: ''
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
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(element.url);
                    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                    if (element.name === 'CNN') {
                        const $ = cheerio.load(data);
                        const stuff = $(".cd__headline-text")
                        for (i = 0; i < stuff.length; i++) {
                            if (stuff[i].children[0].data) {
                                console.log(stuff[i].children[0].data);
                            }
                        }
                        await page.screenshot({ path: `${uuidv4() + element.name}example.png` });
                        await browser.close();
                    } else if (element.name === 'HuffPost') { }



                    await browser.close();
                    console.log("Finished");
                })();
            });

        });
        done();
    });
    const myJob = await mainqq.add(
        { foo: 'bar' },
        {
            repeat: {
                every: 10000,
            }
        }
    );

}

module.exports = {
    StartProcesses: StartProcesses,
    Router: router
}

