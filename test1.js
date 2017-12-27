const puppteer = require('puppeteer');

(async() => {
    const browser = await puppteer.launch()
    const page = await browser.newPage()
    page.on('console', (...args) => console.log('PAGE LOG: ', ...args))
    await page.goto('http://xakj.xa.gov.cn/admin/class1.asp?catid=10')
    await page.pdf({path: `abs.pdf`})

    // console.log(links.join('\n'))
    browser.close()
})()