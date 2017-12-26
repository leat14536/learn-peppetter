# class Page

继承了事件订阅系统

page 提供了与chrome标签交互的方法, 一个browser实例可以有多个page

```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'screenshot.png'});
  await browser.close();
});
```

page支持各种浏览器原生事件注册方法 比如 on once

event: console `<ConsoleMassage>`

* js的各种console事件 包括error 和 warning

```
page.on('console', msg => {
  for (let i = 0; i < msg.args.length; ++i)
    console.log(`${i}: ${msg.args[i]}`);
});
page.evaluate(() => console.log('hello', 5, {foo: 'bar'}));
```

event: dialog `<Dialog>`

* 浏览器的各种交互事件 比如 `alert, prompt, confirm or beforeunload`

event: error `<Error>`

* 当页面碰撞(crash)时触发

event: frameattached `<Frame>`

* 页面链接(attached)时触发

event: framedetached `<Frame>`

* 页面分离时出发

event: framenavigated `<Frame>`

* 页面跳转新url时触发

event: load

* js load事件触发时触发


event: metrics `<Object>`

* title `<string>` The title passed to console.timeStamp.
* metrics `<Object>` Object containing metrics as key/value pairs. The values of metrics are of `<number>` type.

js调用 `console.timeStamp` 时触发

event: pageerror `<String>` 异常消息

* 在页面内发生未捕获的异常时发出

event: request `<Request>`

* request为只读属性, 在页面请求时触发, 可以拦截并改变请求 参照 `page.setRequestInterception`

event: requestfailed `<Request>`

* 请求失败

event: 'requestfinished' `<Request>`

event: response `<Request>`

请求返回时触发

page.$(selector)

* selector `<string>` 选择器 相当于document.querySelector
* returns `<Promise<?ElementHnadle>>` 如果没有选中元素则返回null

page.$$(selector)

* 同上 相当于document.querySelectorAll
* returns `<Promise<Array<ElementHandle>>>`如果没有选中元素则返回[]

Shortcut for `page.mainFrame().$$(selector).`

page.$$eval(selector, pageFunction[, ...args])

* returns `<Promise<Serializable>>` 返回pageFunction 的返回值
* selector `<string>`
* pageFunction `<function>`
* ...args `<...Serializable|ElementHandle>` pageFunction的参数

```const divsCounts = await page.$$eval('div', divs => divs.length);```

此方法会调用document

如果pageFunction 返回一个promise 那么page.$$eval 会等待promise 调用resolve 并返回resolve的值

page.$eval(selector, pageFunction[, ...args])

* selector `<string>`
* pageFunction `<function>`
* ...args `<...Serializable|ElementHandle>` pageFunction的参数
* returns `<Promise<Serializable>>` 返回pageFunction 的返回值

这个方法执行 document.querySelector pageFunction 的参数是执行结果

pageFunction 返回一个promise同上

```
const searchValue = await page.$eval('#search', el => el.value);
const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
const html = await page.$eval('.main-container', e => e.outerHTML);
```

page.addScriptTag(options)

* options `<object>`
  * url `<string>` script 的绝对路径
  * path `<string>` js文件 相对于当前项目的相对路径
  * content `<string>` 感觉相当于eval注入文件
* returns: `<Promise<ElementHandle>>` 当script触发onload事件时调用resolve

#### page.addStyleTag(options)

* options `<Object>`
  * url `<string>` link 的绝对路径
  * path `<string>` css文件 相对于当前项目的相对路径
  * content `<string>` 将字符串注入页面
* returns: `<Promise<ElementHandle>>` 同上

`Adds a <link rel="stylesheet"> tag into the page with the desired url or a <style type="text/css"> tag with the content`

#### page.authenticate(credentials)

* credentials `<?Object>`
  * username `<string>`
  * password `<string>`
* returns `<Promise>`

http证书相关, 禁用证书时传入null

#### page.bringToFront()

* returns: `<Promise>`

激活标签

#### page.click(selector[,options])

* selector `<string>` 选择器 相当于querySelector click第一个选中的元素
  * button `<string>` left, right, or middle 默认left
  * clickCount `<number>` 默认1
  * delay `<number>` mousedown 和 mouseup 的时间 默认0
* returns: `<Promise>` 成功点击时调用resolve 如果没有选中元素则调用reject

选中一个元素, 如果有必要会滚动到该元素的位置, 并点击该元素中心, 如果没有选中元素则抛出错误

#### page.close()

* returns: `<Promise>`

#### page.content()

returns: `<Promise<String>>`

获取html主体, 包括doctype

#### page.cookies(...urls)

* ...urls `<...string>`
* returns: `<Promise<Array<Object>>>`
  * name `<string>`
  * value `<string>`
  * domain `<string>`
  * path `<string>`
  * exprires `<number>` Unix time in seconds.
  * httpOnly `<boolean>`
  * secure `<boolean>`
  * sameSite `<string>`"Strict" or "Lax".

如果没有传入url则返回当前url的cookie, 指明则返回知名路径的cookie

page.emulate(options)

* options `<Object>`
  * viewport `<Object>`
    * width `<number>` 页面的 width(px)
    * height `<number>` 页面的 height(px)
    * deviceScaleFactor `<number>` 指定设备比例 默认1
    * isMobile `<number>` 是否考虑 `meta viewport`标签, 默认false
    * hasTouch `<number>` 如果视图支持touch事件, 默认false
    * isLandscape `<number>` 是否横向模式 默认false
  * userAgent `<string>`
* returns: `<Promise>`

快速调用方法
* page.setUserAgent(userAgent)
* page.setViewport(viewport)

chrome 提供了一部分设备配置信息, 可以通过`require('puppeteer/DeviceDescriptors')`获取 example
```
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto('https://www.google.com');
  // other actions...
  await browser.close();
});
```
源代码中提供了所有可用设备的列表：DeviceDescriptors.js。

#### page.emulateMedia(mediaType)

* mediaType `<?shring>` 切换css的mediaType 可选值 'screen', 'print' and null null禁用媒体仿真
* returns: `<Promise>`

#### page.evaluate(pageFunction, ...args)

* pageFunction `<function|string>` 要在页面上下文中调用的函数
* ...args `<...Serializable|ElementHandle>` 传入pageFunction 的参数
* returns: `<Promise<Serializable>>` pageFunction 的返回值

pageFunction可以返回一个promse, pageFunction 可以是一个string

```
const bodyHandle = await page.$('body');
const html = await page.evaluate(body => body.innerHTML, bodyHandle);
await bodyHandle.dispose();
```

#### page.evaluateHandle(pageFunction, ...args)

* pageFunction `<function|string>` 描述同上
* ...args `<...Serializable|JSHnadle>` 同上
* returns: `<Promise<JSHandle>` 同上

与上边不同的是可以传入一个JSHandle作为pageFunction 的参数

```
const aHandle = await page.evaluateHandle(() => document.body);
const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
console.log(await resultHandle.jsonValue());
await resultHandle.dispose();
```

#### page.evaluateOnNewDocument(pageFunction, ...args)

* pageFunction `<function|string>` 同上
* ...args `<...Serializable>` 同上
* returns: `<Promise>`

添加一个在下列情况下会调用的函数
* 页面跳转
* 子页面调用或跳转, 在这种情况下, 函数会在新的页面上下文调用

这个函数会在页面所有script标签执行前执行, 对改变当前js执行环境有用

设置浏览器语言的例子
```
// preload.js

// overwrite the `languages` property to use a custom getter
Object.defineProperty(navigator, "languages", {
  get: function() {
    return ["en-US", "en", "bn"];
  };
});

// In your puppeteer script, assuming the preload.js file is in same folder of our script
const preloadFile = fs.readFileSync('./preload.js', 'utf8');
await page.evaluateOnNewDocument(preloadFile);
```
#### page.exposeFunction(name, puppeteerFunction)

* name `<String>` 在window对象上挂载的字段
* puppeteerFunction `<function>` 将在Puppeter 上下文中调用的方法
* returns: `<Promise>`

这个方法挂载在当前page的window对象上, 当调用时会在nodejs 中执行并return一个Promise 然后resolve puppeteerFunction 的返回值

在页面中添加md5的样例
```
const puppeteer = require('puppeteer');
const crypto = require('crypto');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text));
  await page.exposeFunction('md5', text =>
    crypto.createHash('md5').update(text).digest('hex')
  );
  await page.evaluate(async () => {
    // use window.md5 to compute hashes
    const myString = 'PUPPETEER';
    const myHash = await window.md5(myString);
    console.log(`md5 of ${myString} is ${myHash}`);
  });
  await browser.close();
});
```
添加一个window.readfile方法在页面中
```
const puppeteer = require('puppeteer');
const fs = require('fs');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text));
  await page.exposeFunction('readfile', async filePath => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, text) => {
        if (err)
          reject(err);
        else
          resolve(text);
      });
    });
  });
  await page.evaluate(async () => {
    // use window.readfile to read contents of a file
    const content = await window.readfile('/etc/hosts');
    console.log(content);
  });
  await browser.close();
});
```


















