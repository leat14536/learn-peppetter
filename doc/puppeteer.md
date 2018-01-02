# class: Puppeteer

Puppeteer通过launch方法生成一个Chromium 实例, 这是最简单的示例代码
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  // other actions...
  await browser.close();
});
```
#### puppeteer.connect(options)

* options <[Object]>
  * browserWSEndpoint <[string]> 一个浏览器websocket末尾节点, 用来连接
  * ignoreHTTPErrors <[boolean]> 是否在导航期间忽略https错误 默认false
* returns: <[Promise]<[Browser]>>

此方法讲Puppeteer添加到现有chromium实例中

#### puppeteer.defaultArgs()

* returns: <[Array]<[string]>> 与chromium一起启动的标志

#### puppeteer.executablePath()

* returns: <[string]> 寻找Chromium的路径

#### puppeteer.launch([options])

* options <[Object]> 启动浏览器时的可配置选项
  * ignoreHTTPSErrord <[boolean]> 是否在导航期间忽略https错误 默认false
  * headless <[boolean]> 是否使用无头模式启动浏览器 默认true, devtools 为true时例外
  * executablePath <[string]> Chromium / chrome 可执行文件的路径, 如果是相对路径, 则相对于命令行目录
  * slowMo <[number]> 减慢Puppeteer的操作速度, 这样就可以看到发生了什么事情
  * args <[Array]<[String]>> 给browser实例添加的额外参数
  * ignoreDefaultArgs <[Boolean]> 不要使用 puppeteer.defaultArgs(), 很危险的选项, 慎用, 默认false,
  * handleSIGINT <[boolean]> 使用Ctrl-C关闭浏览器进程 默认true
  * handleSIGTERM <[boolean]> 关闭SIGTERM上的浏览器进程。默认为true。
  * handleSIGHUP <[boolean]> 在SIGHUP上关闭浏览器进程。默认为true。
  * timeout <[number]> 等待浏览器启动的毫秒数, 默认30000, 设置0时关闭延时
  * dumpio <[boolean]> 是否输送浏览器的 stdout和stderr默认false
  * userDataDir <[string]> 用户目录的路径
  * env <[Object]> 浏览器可访问到的外界变量 默认process.env
  * devtools <[boolean]> 是否为每个标签自动打开DevTools面板, 如果这个选项是true，该headless选项将被设置false。
* returns: <[Promise]<[Browser]>> resolve浏览器实例

此方法在launch时resolve一个浏览器实例, 当父进程关闭时browser将关闭

> NOTE Puppeteer can also be used to control the Chrome browser, but it works best with the version of Chromium it is bundled with. There is no guarantee it will work with any other version. Use executablePath option with extreme caution. If Google Chrome (rather than Chromium) is preferred, a Chrome Canary or Dev Channel build is suggested.

> In puppeteer.launch([options]) above, any mention of Chromium also applies to Chrome.

> See this article for a description of the differences between Chromium and Chrome. This article describes some differences for Linux users.
