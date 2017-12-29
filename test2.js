const puppeteer = require('puppeteer');
const fs = require('fs')

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  dumpFrameTree(page.mainFrame(), '');
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    fs.writeFileSync('./test2.json', JSON.stringify(frame))
    // for (let child of frame.childFrames())
      // dumpFrameTree(child, indent + '  ');
  }
});