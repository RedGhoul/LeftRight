require('dotenv').config()
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const client = require('./database/database');
//const UpLoadFileImage = require('./tasks/uploader');


const sssss = async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);

    console.log("const page = await browser.newPage();");
    try {
        await page.goto("https://www.remax.ca/", {
            waitUntil: 'networkidle2'
        });
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        const $ = cheerio.load(data);
        const stufff = $(".ng-star-inserted");
        console.log(stufff)
    } catch (error) {
        console.log(error);
        await browser.close();
        return;
    }

    await browser.close();

}

sssss();
