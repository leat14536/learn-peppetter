# browser

browser实例 通过peppetter.launch 或者 peppetter.connect 获得 注意都是异步获取

```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await browser.close();
});
```
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  // Store the endpoint to be able to reconnect to Chromium
  const browserWSEndpoint = browser.wsEndpoint();
  // Disconnect puppeteer from Chromium
  browser.disconnect();

  // Use the endpoint to reestablish a connection
  const browser2 = await puppeteer.connect({browserWSEndpoint});
  // Close Chromium
  await browser2.close();
});
```

browser继承事件订阅系统

event: disconnected

* browser closed || crashed
* browser.disconnect调用时触发

event: targetchanged

* url改变时触发

evnet: targetcreated

* window.open || browser.newPage时触发

event: targetdestroyed

* 当前page关闭时触发

browser returns<Promise>

* 关闭所有当前实例开启的pages, 并销毁browser实例

browser.disconnect()

* 断开当前browser连接的peppetter, 使当前browser实例不可用

browser.newPage() returns<Promise\<Page>>

browser.pages() returns: <Promise<Array\<Page>>>

* 返回所有已打开页面组成的数组

browser.process() returns: <?ChildProcess>

* 如果browser 是通过puppteer.connect 得到的则返回null

browser.targets() returns: <Array\<Target>>

* 返回活动的target数组

browser.version() returns: <Promise\<String>>

* 返回当前浏览器的版本信息

browser.wsEndpoint() returns < String>

返回浏览器websocket 的url 格式: ```ws://${host}:${port}/devtools/browser/<id>```

```You can find the webSocketDebuggerUrl from http://${host}:${port}/json/version. Learn more about the devtools protocol and the browser endpoint.```




