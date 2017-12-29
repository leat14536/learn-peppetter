const puppeteer = require('puppeteer');
const fs = require('fs')

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  // const frame = page.mainFrame()
  const content = await page.content()
  fs.writeFileSync('./test3.html', content)
  await browser.close();
});