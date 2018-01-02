const Puppeteer = require('puppeteer')

Puppeteer.launch().then(async browser => {
    const page = await browser.newPage()
    await page.goto('http://es6.ruanyifeng.com/', { waitUntil: 'networkidle2' })
    const paths = await page.$$eval('ol li', lis => lis.map(li => li.firstElementChild.href))
        // console.log(paths)
    for (let i = 1; i < paths.length; i++) {
        console.log(i)
        await page.goto(paths[i], { waitUntil: 'networkidle2', timeout: 0 })
        await page.pdf({ path: `./pdf/test1_${i}.pdf` })
    }
    await browser.close()
})