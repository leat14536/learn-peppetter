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

#### page.focus(selector)

* selector `<string>` 只会选中第一个
* returns: `<Promise>` 选中元素成功时调用resolve 未选中元素则调用reject

#### page.frames()

* returns: `<Array<Frame>` 返回所有page组成的数组

#### page.goBack(options)

* options `<Object>` 跳转携带的参数
  * waitUntil `<string|Array<string>>` 默认load, 当传入数组时会在所有事件完成后认为导航成功, 参数可选:
    * load load事件触发时
    * domcontentloaded DOMContentLoaded事件触发时
    * networkidle0 网络连接不超过0时 至少500ms
    * networkidle2 网络连接不超过2时 至少500ms
* returns: `<Promise<?Response>>` 页面返回时resolve, 如果有多个重定向则返回最后一个重定向位置, 如果失败则返回null

#### page.goForward(options)
* options `<Object>` 跳转的参数
  * timeout `<number>` 最多的跳转时间单位毫秒, 默认30s, 通过0禁止超时
  * waitUntil `<string|Array<string>>` 同上
    * load load事件触发时
    * domcontentloaded DOMContentLoaded事件触发时
    * networkidle0 网络连接不超过0时 至少500ms
    * networkidle2 网络连接不超过2时 至少500ms
* returns: `<Promise<?Response>>` 页面响应时resolve, 多个重定向则定位最后的位置, 失败则resolve null

从history中跳转下一页

#### page.goto(url, options)

* url `<string>` 包含协议的url -> https://
* options `<Object>` 跳转的参数
  * timeout `<number>` 最多的跳转时间单位毫秒, 默认30s, 通过0禁止超时
  * waitUntil `<string|Array<string>>` 同上
    * load load事件触发时
    * domcontentloaded DOMContentLoaded事件触发时
    * networkidle0 网络连接不超过0时 至少500ms
    * networkidle2 网络连接不超过2时 至少500ms
* returns: `<Promise<?Response>>` 请求主体响应时resolve, 重定向则跳转最终位置

page.goto 在下列情况下会出错:

* 无证书
* url 出错
* timeout超时
* 页面load失败

> 如果跳转到 `about:blank` 则resolve null

> 不支持跳转pdf页面

#### page.hover(selector)

* selector `<string>` 会选择第一个选中元素hover
* returns `<Promise>`

page 会滚动到元素相应的位置 并使用page.mouse 移动到该元素上, 如果没选中元素则reject

#### page.board

* returns: <Keyboard>

#### page.mainFrame()

* returns: `<Frame>` 返回页面主体结构

page 保证导航过程中保持一个页面主体结构

#### page.metrics()

* return `<Promise<Object>>` 页面的度量对象
  * Timestamp `<number>` 标准时间戳
  * Documents `<number>` 页面的document数量
  * Frames `<number>` 页面的帧数.
  * JSEventListeners `<number>` 页面的事件总数.
  * Nodes `<number>` dom节点数量.
  * LayoutCount `<number>` 全部或不分页面布局总数.
  * RecalcStyleCount `<number>` 样式重新计算总数.
  * LayoutDuration `<number>` 页面布局时间.
  * RecalcStyleDuration `<number>` 页面重绘时间.
  * ScriptDuration `<number>` js执行时间.
  * TaskDuration `<number>` 浏览器执行所有任务的总时间.
  * JSHeapUsedSize `<number>` js使用的堆大小.
  * JSHeapTotalSize `<number>` js堆大小.

#### page.mouse

* returns: `<Mouse>`

#### page.pdf(options)

* options `<Object>`
  * path `<string>` 存储路径必须是相对路径, 相对于运行时的路径, 如果没有设置路径则不会保存
  * scale `<number>` 缩放 默认1
  * displayHeaderFooter `<boolean>` 显示header 和footer 默认false
  * headerTemplate `<string>` header信息 由以下部分组成 注意格式
    * date 格式化日期对象
    * title 文档title
    * url 文档地址
    * pageNumber 当前页面数量
    * totalPages 页面总数
* footerTemplate `<string>` 同上
* printBackground `<boolean>` 绘制背景图形, 默认false
* landscage `<boolean>` 纸张方向默认false
* formate `<string>` 纸张格式如果设置则优先于width height, 默认Letter
* width `<string>` 页面width 接受单位
* height `<string>` 页面height 接受单位
* margin `<Object>` 页面margin 默认none
  * top `<string>`
  * bottom `<string>`
  * left `<string>`
  * right `<string>`
* returns: `<Promise<Buffer>>` pdf的buffer

> 生成pdf仅支持chrome无头模式

生成页面使用css 的print media , 如果使用css的screen css则
```
// Generates a PDF with 'screen' media type.
await page.emulateMedia('screen');
await page.pdf({path: 'page.pdf'})
```

width height margin 接受带单位的值, 如果不带单位默认px

All possible units are:

* px - pixel
* in - inch
* cm - centimeter
* mm - millimeter

The format options are:

* Letter: 8.5in x 11in
* Legal: 8.5in x 14in
* Tabloid: 11in x 17in
* Ledger: 17in x 11in
* A0: 33.1in x 46.8in
* A1: 23.4in x 33.1in
* A2: 16.5in x 23.4in
* A3: 11.7in x 16.5in
* A4: 8.27in x 11.7in
* A5: 5.83in x 8.27in
* A6: 4.13in x 5.83in

#### page.queryObjects(prototypeHandle)

* prototypeHandle `<JSHandle>` 对象原型的引用
* returns: `<Promise<JSHandle>>` 返回所有当前原形所生成实例组成的数组

```
// Create a Map object
await page.evaluate(() => window.map = new Map());
// Get a handle to the Map object prototype
const mapPrototype = await page.evaluateHandle(() => Map.prototype);
// Query all map instances into an array
const mapInstances = await page.queryObjects(mapPrototype);
// Count amount of map objects in heap
const count = await page.evaluate(maps => maps.length, mapInstances);
await mapInstances.dispose();
await mapPrototype.dispose();
```

#### page.reload(options)

* options `<Object>` 重新加载携带参数
  * timeout `<number>` 最多的跳转时间单位毫秒, 默认30s, 通过0禁止超时
  * waitUntil `<string|Array<string>>` 同上
    * load load事件触发时
    * domcontentloaded DOMContentLoaded事件触发时
    * networkidle0 网络连接不超过0时 至少500ms
    * networkidle2 网络连接不超过2时 至少500ms
* returns: `<Promise<?Response>>` 请求主体响应时resolve, 重定向则跳转最终位置

#### page.screenshot([options])

* options `<Object>`
  * path `<string>` 相对路径, 如果不设置path则不保存
  * type `<string>` 图片类型, jpeg / png 默认png
  * quality `<number>` 图片质量 1 - 100, 不适用于png
  * fullpage `<boolean>` true时获取整个page截图, 默认false
  * clip `<Object>` 截取部分屏幕 参数如下
    * x `<number>`
    * y `<number>`
    * width `<number>`
    * height `<number>`
  * omitBackground `<boolean>` 将白色背景变为透明 默认false
* returns: `<Promise<Buffer>>` resolve 截取部分二进制流

#### page.select(selector, ...values)

* selector `<string>` selector元素选择器
* ...values `<...string>` 如果selector 有multiple属性, 则将values 全部设置, 否则只设置第一个值
* reutrns: `<Promise<Array<string>>>` 返回一成功选择的选项组成的数组

如果成功改变选项则触发selector的change 和input 事件, 如果没选中元素咋报错

#### page.setContent(html)

* html `<string>` 给html设置的标记
* reurns `<Promise>`

#### page.setCookie(...cookies)

* ...cookies `<...Object>`
  * name `<string>` required (必填)
  * value `<string>` required
  * url `<string>`
  * domain `<string>`
  * path `<string>`
  * expires `<number>` Unix time in seconds.
  * httpOnly `<boolean>`
  * secure `<boolean>`
  * sameSite `<string>` "Strict" or "Lax".
* returns: `<Promise>`

#### page.setExtraHTTPHeaders(headers)

* headers `<Object>` 在所有页面请求中附加的headers, values必须是string
* returns: `<Promise>`

这个api不保证header的顺序

#### page.setJavaScriptEnabled(enabled)

* enabled 是否在页面中启用js
* returns: `<Promise>`

这个值不会影响已经运行的脚本, 将会在下页生效

#### page.setOfflineMode(enabled)

* enabled 设为true时 页面进入离线状态
* reutrns: `<Promise>`

#### page.setRequestInterception(value)

* value `<boolean>` 是否启用请求拦截
* returns: `<Promise>`

可以使用如下方法拦截请求 request.abort, request.continue and request.respond

拦截image请求的例子:
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url.endsWith('.png') || interceptedRequest.url.endsWith('.jpg'))
      interceptedRequest.abort();
    else
      interceptedRequest.continue();
  });
  await page.goto('https://example.com');
  await browser.close();
});
```
> 启用拦截请求将禁用页面缓存

#### page.seUserAgent(userAgent)

* userAgent `<string>`
* returns: `<Promise>` userAgent设置好后调用resolve

#### page.setViewport(viewport)

* viewport `<Object>`
  * width `<number>` 页面的 width(px)
  * height `<number>` 页面的 height(px)
  * deviceScaleFactor `<number>` 指定设备比例 默认1
  * isMobile `<number>` 是否考虑 `meta viewport`标签, 默认false
  * hasTouch `<number>` 如果视图支持touch事件, 默认false
  * isLandscape `<number>` 是否横向模式 默认false
* returns: `<Promise>`

> 在某些情况下调用会刷新页面, 比如设置了 isMobile或者 hasTouch

在多重页面的情况下, 每个page都有独立的viewport size

#### page.tap(selector)

* selector `<string>`
* returns: `<Promise>`

通过选择器找到元素, 有必要的话屏幕会滚动到该元素的位置, 然后调用page.touchscreen 点击元素中心, 如果没找到元素则报错

#### page.title()

* returns: `<Promise<string>>` 返回页面title

Shortcut for page.mainFrame().title().

#### page.touchscreen

returns: `<Touchscreen>`

#### page.tracing

returns: `<Tracing>`

#### page.type(selector, text[, options])

* selector `<string>` 键入元素的选择器, 只会选中第一个元素
* text `<string>` 键盘输入的值
* options `<Object>`
  * delay `<number>` 按键之间的间隔时间默认0
* returns: `<Promise>`

启用keydown, keypress/input, and keyup事件输入每个字符

特殊按键Control or ArrowDown, 需使用 keyboard.press.
```
page.type('#mytextarea', 'Hello'); // Types instantly
page.type('#mytextarea', 'World', {delay: 100}); // Types slower, like a user
```

#### page.url()

* returns: `<string>`

This is a shortcut for page.mainFrame().url()

#### page.viewport()

* returns: `<Object>`
  * width `<number>` page width in pixels.
  * height `<number>` page height in pixels.
  * deviceScaleFactor `<number>` Specify device scale factor (can be though of as dpr). Defaults to 1.
  * isMobile `<boolean>` Whether the meta viewport tag is taken into account. Defaults to false.
  * hasTouch `<boolean>` Specifies if viewport supports touch events. Defaults to false
  * isLandscape `<boolean>` Specifies if viewport is in landscape mode. Defaults to false.

#### page.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]])

* selectorOrFunctionOrTimeout `<string|number|function>` 等待的选择器, string 或者 延时
* options `<Object>` 等待的参数
* ...args `<...Serializable>` pageFunction 的参数
* returns: `<Promise>`

该方法的行为根据参数不同有所不同
* 如果selectorOrFunctionOrTimeout是一个string，那么第一个参数被视为一个选择器等待，该方法是一个page.waitForSelector
* 如果selectorOrFunctionOrTimeout是一个function, 那么视为等待函数返回, 相当于调用 page.waitForFunction().
* 如果selectorOrFunctionOrTimeout是一个number, 那么返回一个在number毫秒后调用resolve的Promise

Shortcut for page.mainFrame().waitFor(selectorOrFunctionOrTimeout[, options[, ...args]]).

#### page.waitForFunction(pageFunction[, options[, ...args]])

* pageFunction `<function|string>` 在页面上下文中调用的function
* options `<Object>`
  * polling `<string|number>` 如果值是number 那么表示该函数的执行间隔, 如果是string则有以下选项, 默认 raf
    * raf 不断执行pageFunction的requestAnimationFrame回调, 这是观察dom变化的重要方法
    * mutation dom变化时执行function
  * timeout `<number>` 执行的等待时间, 默认30000 (30s)
* returns: `<Promise>` 当pageFunction返回一个真值时resolve

waitForFunction 可以用于观察视口(viewport)变化
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  const watchDog = page.waitForFunction('window.innerWidth < 100');
  page.setViewport({width: 50, height: 50});
  await watchDog;
  await browser.close();
});
```

#### page.waitForNavigation(options)

* options `<Object>` 跳转携带参数
  * timeout `<number>` 最多的跳转时间单位毫秒, 默认30s, 通过0禁止超时
  * waitUntil `<string|Array<string>>` 同上
    * load load事件触发时
    * domcontentloaded DOMContentLoaded事件触发时
    * networkidle0 网络连接不超过0时 至少500ms
    * networkidle2 网络连接不超过2时 至少500ms
* returns `<Promise<Response>>` 同上

#### page.waitForSelector(selector[,options])

* selector `<string>`
* options `<Object>`
  * visiable `<boolean>` 等待dom元素在页面中可见, 比如没有display: none和visibility: hidden属性 默认false
  * hidden `<boolean>` 等待dom元素在页面中 不 可见, 有上方属性, 默认false
  * timeout `<number>` 最多等待时间, 默认30000 (30s)
* returns: `<Promise>` 当选择器所选元素加入dom时resolve

等待元素加入dom, 如果元素存在于dom则立即返回, 到达时间则抛出错误
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  let currentURL;
  page
    .waitForSelector('img')
    .then(() => console.log('First URL with image: ' + currentURL));
  for (currentURL of ['https://example.com', 'https://google.com', 'https://bbc.com'])
    await page.goto(currentURL);
  await browser.close();
});
```

#### page.xpath(expression)

* expression `<string>` 表达式
* returns: `<Promise<?ElementHandle>>` 返回表达式指向页面元素的ElementHandle

该方法会调用表达式,如果页面中没有这样的元素, 则resolve null













