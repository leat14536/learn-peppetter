const puppteer = require('puppeteer');

(async() => {
    const browser = await puppteer.launch()
    const page = await browser.newPage()
    page.on('console', (...args) => console.log('PAGE LOG: ', ...args))
    await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' })
    await page.click('a.storylink')
    const response = await page.waitForNavigation({ waitUntil: 'networkidle2' })
    console.log(await page.title())
    console.log(page.url())

    // console.log(links.join('\n'))
    browser.close()
})()