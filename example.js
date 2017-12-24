const puppetter = require('puppeteer');

(async() => {
    const browser = await puppetter.launch()
    const page = await browser.newPage()
    await page.goto('https://example.com')
    await page.screenshot({ path: 'example.png' })

    await browser.close()
})()