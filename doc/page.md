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