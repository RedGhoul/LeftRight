
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const UpLoadFileImage = require('../tasks/uploader');
const UserAgent = require('user-agents');
require('dotenv').config();
const client = require('../database/database');

const gather = async function () {
    client.promise().query('SELECT * FROM newssite;')
        .then(async ([rows, fields]) => {
            for (var i = 0; i < rows.length; i++) {
                UserAgentObj = new UserAgent();

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
                values = UserAgentObj.toString();
                page.setUserAgent(
                    values
                );

                await page.setDefaultNavigationTimeout(90000);

                try {
                    await page.goto(rows[i].url, {
                        waitUntil: 'networkidle2'
                    });
                } catch (error) {
                    await browser.close();
                    continue;
                }

                let fileName = `${rows[i].name + uuidv4()}.png`;
                await page.screenshot({ path: fileName, fullPage: true })
                await UpLoadFileImage(fileName);
                const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                let SnapId = Number(rows[i].id);
                console.log(rows[i])
                let NAME = rows[i].name;
                client.promise().query(
                    'INSERT INTO `snapshot` (imageurl, newssite_id) VALUES (?, ?);',
                    [fileName, SnapId]).then(async ([rows2, fields2]) => {
                        console.log(rows2);
                        if (!data) {
                            console.log("Data was none");
                            await browser.close();
                            return;
                        }

                        const $ = cheerio.load(data);

                        let listOfHeadLines = []

                        console.log("NAME " + NAME)
                        try {
                            if (NAME === 'CNN') {
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
                                console.log("Done CNN");
                            } else if (NAME === 'HuffPost') {
                                const stuff = $(".card__headline__text");
                                for (i = 0; i < stuff.length; i++) {
                                    try {
                                        if (stuff[i].children[0].data) {
                                            let headline = stuff[i].children[0].data.trim();
                                            listOfHeadLines.push(headline);
                                        }
                                    } catch (error) {
                                        console.log("Happend in For Loop");
                                        console.log("Error found in HuffPost");
                                        console.log(error);
                                    }

                                }
                                console.log("Following will be sent for Huffpost");
                                console.log(listOfHeadLines);
                                console.log("Done HuffPost");
                            } else if (NAME === 'FOX') {
                                const stuff = $(".title.title-color-default");
                                for (i = 0; i < stuff.length; i++) {
                                    try {
                                        if (stuff[i].children[0].children[0].data) {
                                            let headline = stuff[i].children[0].children[0].data.trim();
                                            listOfHeadLines.push(headline);
                                        }
                                    } catch (error) {
                                        console.log("Happend in For Loop");
                                        console.log("Error found in Fox");
                                        console.log(error);
                                    }

                                }
                                console.log("Done Fox");
                            } else if (NAME === 'FT') {
                                const stuff = $(".js-teaser-heading-link");
                                for (i = 0; i < stuff.length; i++) {
                                    try {
                                        if (stuff[i].children[0].data) {
                                            let headline = stuff[i].children[0].data.trim();
                                            listOfHeadLines.push(headline);
                                        }
                                    } catch (error) {
                                        console.log("Happend in For Loop");
                                        console.log("Error found in FT");
                                        console.log(error);
                                    }

                                }
                                console.log("Done FT");
                            } else if (NAME === 'BBC') {
                                const stuff = $(".media__link");
                                for (i = 0; i < stuff.length; i++) {
                                    try {
                                        if (stuff[i].children[0].data) {
                                            let headline = stuff[i].children[0].data.trim();
                                            listOfHeadLines.push(headline);
                                        }
                                    } catch (error) {
                                        console.log("Happend in For Loop");
                                        console.log("Error found in BBC");
                                        console.log(error);
                                    }

                                }
                                console.log("Done BBC");
                            }
                        } catch (error) {
                            console.log(error);
                            console.log("Got out of the error");
                        }

                        console.log("Got to await browser.close();");
                        await browser.close();
                        console.log("Sending the following back");
                        if (listOfHeadLines.length > 0) {
                            var finalValue = [];

                            for (var i = 0; i < listOfHeadLines.length; i++) {
                                finalValue.push([listOfHeadLines[i], rows2.insertId])
                            }

                            client.promise().query('INSERT INTO `headline` (value_text, snapshot_id) VALUES ?',
                                [finalValue]).then(([rows2, fields2]) => {
                                    console.log("CREATED ROWS");
                                    return;

                                }).catch((error) => {
                                    console.log(error)
                                });
                        }
                        return;
                    }).catch((error) => {
                        console.log(error);
                    });


            }
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = {
    gather: gather
}
