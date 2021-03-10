const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.cnn.com/');
    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
    const $ = cheerio.load(data);
    const stuff = $(".cd__headline-text")
    try {
        for (i = 0; i < stuff.length; i++) {
            if (stuff[i].children[0].data) {
                console.log(stuff[i].children[0].data);
            }
        }
    } catch (error) {
        console.log(error)
        await browser.close();
    }

    //await page.screenshot({ path: `${uuidv4()}example.png` });
    await browser.close();
    console.log("Finished");
})();
