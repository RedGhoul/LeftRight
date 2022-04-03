const puppeteer = require('puppeteer-extra')
const cheerio = require('cheerio');
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

// That's it, the rest is puppeteer usage as normal 😊
puppeteer.launch({
    args: ['--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'],
    headless: true
  }).then(async browser => {
  const page = await browser.newPage()

  await page.goto('https://www.realtor.ca/on/toronto/real-estate', { waitUntil: 'networkidle0', timeout:5000 })
  await page.waitForTimeout(1000)
  
//   const button = await page.$('a#topbar-search');
//   await form.evaluate( form => form.click() );
  await page.screenshot({ path: 'testresult.png', fullPage: true })
  const data = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(data);
  $(".blockLink.listingDetailsLink").each(function () {
      console.log($(this).attr('href'))
  })
  await browser.close();
  console.log(`All done, check the screenshots. ✨`)
})