# Class Keyboard

管理虚拟键盘的api, 高等级api是keyboard.type, 输入的每个字符都会在page中触发keydown, keypress/input, and keyup 事件

为了更好的控制你也可以使用 keyboard.down, keyboard.up, and keyboard.sendCharacter 控制事件触发

通过shift选择和删除text文本的例子
```
await page.keyboard.type('Hello World!');
await page.keyboard.press('ArrowLeft');

await page.keyboard.down('Shift');
for (let i = 0; i < ' World'.length; i++)
  await page.keyboard.press('ArrowLeft');
await page.keyboard.up('Shift');

await page.keyboard.press('Backspace');
// Result text will end up saying 'Hello!'
```

输入大写A
```
await page.keyboard.down('Shift');
await page.keyboard.press('KeyA');
await page.keyboard.up('Shift');
```

> 注意在Macos上类似全选的功能 `⌘ A` 都会无效化

#### keyboard.down(key[,options])

* key `<string>` 按键名 可以是ArrowLeft 键值可以参考USKeyboardLayout.js
* options `<Object>`
  * text `<string>` 如果设置会触发一个input事件
* returns: `<Promise>`

触发一个keydown事件

如果 key 是一个但以字符 且没被shift以外的按键修饰, 会触发一个keypress/input事件, 可以通过设置text指定输入内容

如果key是一个修饰按键 比如 Shift，Meta，Control，或Alt 需要调用keyboard.up 抬起按键

在key按下一次之后, 如果想再次按下同样按键, 需要调用keyboard.up

> NOTE Modifier keys DO influence keyboard.down. Holding down Shift will type the text in upper case.

> 修改按键会影响此事件, 按住shift所有字母都是大写

#### keyboard.press(key[, options])

* key `<string>` 按键名 可以是ArrowLeft 键值可以参考USKeyboardLayout.js
* options `<Object>`
  * text `<string>` 如果设置会触发一个input事件
  * delay <[number]> keydown 和 keyup 的间隔, 默认0 单位ms
* returns: `<Promise>`

If key is a single character and no modifier keys besides Shift are being held down, a keypress/input event will also generated. The text option can be specified to force an input event to be generated.

NOTE Modifier keys DO effect elementHandle.press. Holding down Shift will type the text in upper case.

keyboard.down和keyboard.up的快捷方式

#### keyboard.sendCharacter(char)

* char <[string]> 发送到页面的字符
* returns: <[Promise]>

触发一个keypress 和input事件, 不会触发keydown和keyup事件
```
page.keyboard.sendCharacter('嗨');
```
> 改键 不会 影响输出键值, 按住shift 不会 输出大写字母

#### keyboard.type(text, options)

* text <[string]> 输入的内容
* options <[Object]>
  * delay <[number]> 输入字符之间的间隔 默认0
* returns: <[Promise]>

对每个输入的字符 都触发keydown, keypress/input, and keyup 事件

需要按特殊按键时(比如Control 或者 ArrowDown), 内部会使用 keyboard.press
```
page.keyboard.type('Hello'); // Types instantly
page.keyboard.type('World', {delay: 100}); // Types slower, like a user
```
> 改键不会影响输入的值, 按住shift也不会输入大写

#### keyboard.up(key)

* key <[string]> 松开一个按键
* returns: <[Promise]>

触发keyup事件

# class: Mouse

#### mouse.click(x, y, [options])

* x <[number]>
* y <[number]>
* options <[Object]>
  * button <[String]> left, right, or middle 默认left
  * clickCount <[number]> 默认1
  * delay <[number]> mousedown and mouseup 的时间间隔, 默认0s
* returns: <[Promise]>

Shortcut for mouse.move, mouse.down and mouse.up.

#### mouse.down([options])

* options <[Object]>
  * button <[string]> left, right, or middle 默认left
  * clickCount <[number]> 默认1
* returns: <[Promise]>

触发一个mousedowm事件

#### mouse.move(x, y, [options])

* x <[number]>
* y <[number]>
* options <[Object]>
  * steps <[number]> 默认1 发送一个move事件
* returns: <[Promise]>

#### mouse.up([options])

* options <[Object]>
  * button <[string]> left, right, or middle 默认left
  * clickCount <[number]> 默认1
* returns: <[Promise]>

# class: Touchscreen

#### touchscreen.tap(x, y)

* x <[number]>
* y <[number]>
* returns: <[Promise]>

触发一个touchstart和touchend事件

# class: Tracing

可以使用tracing.start and tracing.stop 创建一个文件, 可以使用chrome的DevTools 或者timeline viewer.打开
```
await page.tracing.start({path: 'trace.json'});
await page.goto('https://www.google.com');
await page.tracing.stop();
```

#### tracing.start(options)

* options <[Object]>
  * path <[string]> 文件路径, 必填
  * screensshots <[boolean]> 捕获屏幕
  * categories <[Array]<[string]>>指定要使用的自定义类别，而不是默认值。
* returns: <[Promise]>

每个browser只能激活一个tracing

#### tracing.stop()

* returns: <[Promise]>

# class: Dialog

页面的对话事件
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
    await browser.close();
  });
  page.evaluate(() => alert('1'));
});
```

#### dialog.accept([promptText])

* promptText <[string]> 在提示符下输入文本, 入国对话框没有任何提示则不会有影响
* returns: <[Promise]>

#### dialog.defaultValue()

* returns: <[string]> 如果对话框有提示则返回对话框的提示, 否则返回空字符串

#### dialog.dismiss()

* returns: <[Promise]> 对话框关闭时resolve

#### dialog.message()

* returns: <[string]> 对话框中显示的消息

#### dialog.type()

* returns: <[string]> 对话框的类型 可以是alert, beforeunload, confirm or prompt.

# class: ConsoleMessage

ConsoleMessage对象由page的console事件分派

#### consoleMessage.args()

* reutrns: <[Array]<[JSHandle]>>

#### consoleMessage.text()

* returns: <[string]>

#### consoleMessage.type()

* returns <[string]> 取值范围 'log', 'debug', 'info', 'error', 'warning', 'dir', 'dirxml', 'table', 'trace', 'clear', 'startGroup', 'startGroupCollapsed', 'endGroup', 'assert', 'profile', 'profileEnd', 'count', 'timeEnd'.


# class: Frame

任何时间点都可以获取当前page的节点树通过 page.mainFrame() and frame.childFrames()  方法

Frame对象的生命周期由三个事件获取, 在page页面上

* '[frameattached]' fired when the frame gets attached to the page. A Frame can be attached to the page only once.
* '[framenavigated]' - fired when the frame commits navigation to a different URL.
* '[framedetached]' - fired when the frame gets detached from the page. A Frame can be detached from the page only once.

获取节点树的样例:
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.google.com/chrome/browser/canary.html');
  dumpFrameTree(page.mainFrame(), '');
  await browser.close();

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (let child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');
  }
});
```

#### frame.$(selector)

* selector <[string]> 从page选择元素的选择器
* returns: <[Promise]<?[ElementHandle]>> resolve ElementHandle

使用querySelector选择元素, 如果没有元素 则resolve null

#### frame.$$(selector)

* selector <[string]> 从page选择元素的选择器
* returns: <[Promise]<?[ElementHandle]>> resolve ElementHandles

使用querySelectorAll选择元素, 如果没有元素 则resolve []

#### frame.$$eval(selector, pageFunction[,...args])

* selector <[string]>
* pageFunction <[function]> 在页面上下文中调用的函数
* ...args <...[Serializable]|[ElementHandle]> 传入pageFunction的参数
* returns: <[Promise]<[Serializable]>> resolve pageFunction 的返回值

此方法会调用document.querySelectorAll然后将返回值传入pageFunction

如果pageFunction 返回一个promise 那么page.$$eval 会等待promise 调用resolve 并返回resolve的值
```
const divsCounts = await frame.$$eval('div', divs => divs.length);
```

#### frame.$eval(selector, pageFunction[, ...args])

* selector <[string]> A selector to query frame for
* pageFunction <[function]> Function to be evaluated in browser context
* ...args <...[Serializable]|[ElementHandle]> Arguments to pass to pageFunction
* returns: <[Promise]<[Serializable]>> Promise which resolves to the return value of pageFunction

在页面中使用document.querySelector选中元素并传入pageFunction. 没选中则报错

If pageFunction returns a Promise, then frame.$eval would wait for the promise to resolve and return its value.

Examples:
```
const searchValue = await frame.$eval('#search', el => el.value);
const preloadHref = await frame.$eval('link[rel=preload]', el => el.href);
const html = await frame.$eval('.main-container', e => e.outerHTML);
```

#### frame.addScriptTag(options)

* options `<object>`
  * url `<string>` script 的绝对路径
  * path `<string>` js文件 相对于当前项目的相对路径
  * content `<string>` 感觉相当于eval注入文件
* returns: `<Promise<ElementHandle>>` 当script触发onload事件时调用resolve

#### frame.addStyleTag(options)

* options `<Object>`
  * url `<string>` link 的绝对路径
  * path `<string>` css文件 相对于当前项目的相对路径
  * content `<string>` 将字符串注入页面
* returns: `<Promise<ElementHandle>>` 同上

#### frame.childFrames()

* returns: <[Array]<[frame]>>

#### frame.content()

* returns: <[Promise]<[String]>>

获取页面主体包括doctype

#### frame.evaluate(pageFunction, ...args)

* pageFunction <[function|string]> 在页面上下文中执行的函数
* ...args <...[Serializable]|[ElementHandle]> 传入pageFunction的参数
* returns: <[Promise]<[Serializable]>> rsolve pageFunction的参数

pageFunction return 一个Promise时会等Promise改变状态

如果pageFunction没有返回值 则resolve undefined
```
const result = await frame.evaluate(() => {
  return Promise.resolve(8 * 7);
});
console.log(result); // prints "56"
```
```
console.log(await frame.evaluate('1 + 2')); // prints "3"
```
```
const bodyHandle = await frame.$('body');
const html = await frame.evaluate(body => body.innerHTML, bodyHandle);
await bodyHandle.dispose();
```

#### frame.executionContext()

* returns: <[Promise]<[ExecutionsContext]>> 设置当前frame的关联上下文

#### frame.isDetached()

* returns: <[boolean]> 如果frame已经被分离, return true, 否则return false

#### frame.name()

* returns: <[string]>

返回 frame的name属性

如果name属性为空, 则返回id属性

> 只有在frame创建时计算一次name属性, 后续无法更改

#### frame.parentFrame()

* returns: <?[Frame]> 如果有父frame则返回, 如果已经与page分离则返回null

#### frame.select(selector, ...values)

* selector `<string>` selector元素选择器
* ...values `<...string>` 如果selector 有multiple属性, 则将values 全部设置, 否则只设置第一个值
* reutrns: `<Promise<Array<string>>>` 返回一成功选择的选项组成的数组

如果成功改变选项则触发selector的change 和input 事件, 如果没选中元素咋报错

```
frame.select('select#colors', 'blue'); // single selection
frame.select('select#colors', 'red', 'green', 'blue'); // multiple selections
```

#### frame.setContent(html)

* html <[string]> 页面设置html标记
* returns: <Promise>

#### frame.title()

* returns: <[Promise]<[string]>> 返回页面的title

#### frame.url()

* returns: <[string]>

#### frame.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]])

* selectorOrFunctionOrTimeout `<string|number|function>` 等待的选择器, string 或者 延时
* options `<Object>` 等待的参数
* ...args `<...Serializable>` pageFunction 的参数
* returns: `<Promise>`

该方法的行为根据参数不同有所不同
* 如果selectorOrFunctionOrTimeout是一个string，那么第一个参数被视为一个选择器等待，该方法是一个page.waitForSelector
* 如果selectorOrFunctionOrTimeout是一个function, 那么视为等待函数返回, 相当于调用 page.waitForFunction().
* 如果selectorOrFunctionOrTimeout是一个number, 那么返回一个在number毫秒后调用resolve的Promise

#### frame.waitForFunction(pageFunction[, options[, ...args]])

* pageFunction `<function|string>` 在页面上下文中调用的function
* options `<Object>`
  * polling `<string|number>` 如果值是number 那么表示该函数的执行间隔, 如果是string则有以下选项, 默认 raf
    * raf 不断执行pageFunction的requestAnimationFrame回调, 这是观察dom变化的重要方法
    * mutation dom变化时执行function
  * timeout `<number>` 执行的等待时间, 默认30000 (30s)
* returns: `<Promise>` 当pageFunction返回一个真值时resolve

```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
  page.setViewport({width: 50, height: 50});
  await watchDog;
  await browser.close();
});
```

#### frame.waitForSelector(selector[,options])

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
#### frame.xpath(expression)

* expression `<string>` 表达式
* returns: `<Promise<?ElementHandle>>` 返回表达式指向页面元素的ElementHandle

该方法会调用表达式,如果页面中没有这样的元素, 则resolve null

# class: ExevutionContext

这个class代表js的执行上下文

* 每个frame都有自己的上下文
* 各种各样的worker

#### executionContext.evaluate(pageFunction, ...args)

* pageFunction <[function]|[string]> 在js上下文运行的函数
* ...args <...[Serializable]|[ElementHandle]> pageFunction的参数
* returns: <[Promise]<[Serializable]>> resolve pageFunction 的返回值

pageFunction 支持返回Promise
```
const executionContext = page.mainFrame().executionContext();
const result = await executionContext.evaluate(() => Promise.resolve(8 * 7));
console.log(result); // prints "56"
```
参数也可以是string
```
console.log(await executionContext.evaluate('1 + 2')); // prints "3"
```

JSHandle 实例也可以传入pageFunction
```
const oneHandle = await executionContext.evaluateHandle(() => 1);
const twoHandle = await executionContext.evaluateHandle(() => 2);
const result = await executionContext.evaluate((a, b) => a + b, oneHandle, twoHandle);
await oneHandle.dispose();
await twoHandle.dispose();
console.log(result); // prints '3'.
```

#### executionContext.evaluateHandle(pageFunction, ...args)

* pageFunction <[function]|[string]> 在executionContext中执行的函数
* ...args <...[Serializable]|[JSHandle]>
* returns: <[Promise]<[JSHandle]>>

pageFunction支持返回一个Promise
```
const context = page.mainFrame().executionContext();
const aHandle = await context.evaluateHandle(() => Promise.resolve(self));
aHandle; // Handle for the global object.
```

参数支持string
```
const aHandle = await context.evaluateHandle('1 + 2'); // Handle for the '3' object.
```

可以传入JSHandle
```
const aHandle = await context.evaluateHandle(() => document.body);
const resultHandle = await context.evaluateHandle(body => body.innerHTML, aHandle);
console.log(await resultHandle.jsonValue()); // prints body's innerHTML
await aHandle.dispose();
await resultHandle.dispose();
```

#### executionContext.queryObjects(prototypeHandle)

* prototypeHandle <[JSHandle]> A handle to the object prototype.
* returns: <[JSHandle]> A handle to an array of objects with this prototype

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

寻找所有具有prototype的实例

# class: JSHandle

JSHandle代表页面内的js对象, 可以通过page.evaluateHandle创建
```
const windowHandle = await page.evaluateHandle(() => window);
// ...
```

JSHandle阻止浏览器回收, 除非调用dispose, JSHandle会在page跳转和页面销毁时自动dispose

JSHandle 可以作为  page.$eval(), page.evaluate() and page.evaluateHandle的参数

#### jsHandle.asElement()

* returns: <?[ElementHandle]>

返回null 或者 如果是ElementHandle的实例则返回对象自身

#### jsHandle.dispose()

* returns: <[Promise]> JSHandle成功销毁时resolve

#### jsHandle.executionContext()

* reutrns: [ExecutionContext]

返回jsHandle所属的上下文

#### jsHandle.getProperties()

* returns: <[Promise]<[Map]<[string], [JSHandle]>>>

返回一个map实例,由属性名作为key JSHandle作为值

```
const handle = await page.evaluateHandle(() => ({window, document}));
const properties = await handle.getProperties();
const windowHandle = properties.get('window');
const documentHandle = properties.get('document');
await handle.dispose();
```

#### jsHandle.getProperty(propertyName)

* propertyName <[string]>
* returns: <[Promise]<[JSHandle]>>

返回对象的属性

#### jsHandle.jsonValue()

returns: <[Promise]<[Object]>>

返回用JSON表示的对象, 即使对象有toJson方法, 也不会调用

> 如果对象不能string化则返回空对象, 如果对象内部有环则报错

# class: ElementHandle

> ElementHandle 继承自 JSHandle

ElementHandle表现为一个页面内的DOM元素, 可以通过 page.$ 创建
```
const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://google.com');
  const inputElement = await page.$('input[type=submit]');
  await inputElement.click();
  // ...
});
```

ElementHandle会阻止dom元素被回收, 至少在在dispose之前, 此实例会在页面跳转后自动dispose

#### elementHandle.$(selector)

* selector <[string]>
* returns: <[Peomise]<[Array]<[ElementHandle]>>>

执行element.querySelectorAll并返回没选中则返回[]

#### element.asElement()

* returns: <[elementhandle]>

#### elementHandle.boundingBox()

* returns: <[Promise]<?Object>>
  * x <[number]>
  * y <[number]>
  * width <[number]>
  * height <[number]>

返回元素相对于页面的位置 ,如果元素不可见则返回null

#### elementHandle.click([options])

* options: <[Object]>
  * button <[string]> left, right, or middle 默认 left
  * clickCount <[number]> 默认1
  * delay <[number]> mousedown and mouseup 的时间间隔, 默认0s
* returns: <[Promise]> 当页面成功点击时resolve, 如果dom不在页面中会报错

滚动到相应位置, 并调用 page.mouse 点击元素中心  如果dom不在页面中会报错(reject)

#### elementHandle.dispose()

* returns: <[Promise]> 成功销毁时resovle

这个方法会断开element的连接

#### elementHandle.executionContext()

* returns: ExecutionContext

#### elementHandle.focus()

* retrns: <[Promise]> 在element上触发focus

#### elementHandle.getProperties()

* returns: <[Promise]<[Map]<[string], [JSHandle]>>>

这个方法返回一个map实例, key是属性名, JSHandle为值
```
const listHandle = await page.evaluateHandle(() => document.body.children);
const properties = await listHandle.getProperties();
const children = [];
for (const property of properties.values()) {
  const element = property.asElement();
  if (element)
    children.push(element);
}
children; // holds elementHandles to all children of document.body
```

#### elementHandle.getProperty(propertyName)

* propertyName <[string]> property to get
* returns: <[Promise]<[JSHandle]>>

#### elementhandle.hover()

* returns: <[Promise]> 在element上触发一个hover事件, 成功后resolve

#### elementHandle.jsonValue()

* returns: <[Promise]<[Object]>>

返回一个json代表的object, 使用JSON.stringify从page张获取, 然后通过JSON.parse返回到Puppeteer

> 如果Object不能序列化会报错

#### elementHandle.press(key[, options])

* key <[string]> 按住一个按键 比如ArrowLeft
* options <[Object]>
  * text <[string]> 如果定则输入value
  * delay <[number]> keydown and keyup的间隔
* returns: <[Promise]>

如果key是单个字符而且除了Shift被按下之外没有修改键，还将生成一个keypress/ input事件。text可以指定该选项来强制生成输入事件。

滚动到相应位置然后focus element 然后使用 keyboard.down and keyboard.up 输入

> 改键会影响 elementHandle.press, 按住shift会大写

#### elementHandle.screenshot([options])

* options: <[Object]> 与page.screenshot 相同
* returns <[Promise]<[Buffer]>> 返回捕获屏幕的buffer

此方法会滚动到相应位置然后调用 page.screenshot 截屏, 如果element从页面分离会报错

#### elementHandle.tap()

* returns: <[Promise]> 点击成功时resolve, 当element与页面分离报错

页面滚动到相应位置调用 touchscreen.tap 点击

#### elementHandle.type(text[,options])

* text <[string]> 输入到焦点元素的文本
* options <[object]>
  * delay <[number]> 输入的间隔默认0
* returns: <[Promise]>

focus元素 然后通过keydown, keypress/input, and keyup事件写入每个字符

使用特殊按键使用elementHandle.press.
```
elementHandle.type('Hello'); // Types instantly
elementHandle.type('World', {delay: 100}); // Types slower, like a user
```

一个输入并提交表单的样例:
```
const elementHandle = await page.$('input');
await elementHandle.type('some text');
await elementHandle.press('Enter');
```

#### elementHandle.uploadFile(...filePaths)

* ...filePaths <...[string]> 设置输入这些路径的文件的值。如果一些 filePaths是相对路径，那么它们相对于当前工作目录被解析
* returns: <[Promise]>

这个方法期望elementHandle指向一个输入元素。


#### elementHandle.xpath(expression)

* expression <[string]> Expression to evaluate.
* returns: <[Promise]<?[ElementHandle]>> Promise which resolves to ElementHandle pointing to the frame element.

The method evluates the XPath expression relative to the elementHandle. If there's no such element, the method will resolve to null.

# class: Request

页面发送请求时都会在pupetter中触发事件

* 'request' emitted when the request is issued by the page.
* 'response' emitted when/if the response is received for the request.
* 'requestfinished' emitted when the response body is downloaded and the request is complete.

如果请求失败则 'requestfailed' 代替 'requestfinished' 事件

如果请求获得“重定向”响应，则请求将以“requestfinished”事件成功完成，并向重定向的url发出新请求。

#### request.abort([errCode])

* errCode <[string]> 可选择的错误代码, 默认failed
  * aborted - 操作被中止（由于用户操作）
  * accessdenied - 访问除网络以外的资源的权限被拒绝
  * addressunreachable - IP地址不可用。这通常意味着没有路由到指定的主机或网络。
  * connectionaborted - 由于未收到发送数据的ACK，连接超时。
  * connectionclosed - 连接已关闭（对应于TCP FIN）。
  * connectionfailed - 连接尝试失败。
  * connectionrefused - 连接尝试被拒绝。
  * connectionreset - 连接重置（对应于TCP RST）。
  * internetdisconnected - 互联网连接已经丢失。
  * namenotresolved - 主机名称无法解析。
  * timedout - 操作超时。
  * failed - 发生通用故障。
* returns <[Promise]>

中止请求。为了使用这个，请求拦截应该被启用page.setRequestInterception。如果请求拦截未启用，则立即抛出异常。

#### request.continue([overrides])

* overrides <[Object]> 可重写参数
  * url <[string]>
  * method <[string]> 重写请求方法 get post
  * postData <[string]>
  * headers <[Object]>
* returns: <[Promise]>

通过可选请求覆盖继续请求。为了使用这个，请求拦截应该被启用page.setRequestInterception。如果请求拦截未启用，则立即抛出异常。

#### request.failure()

* returns: <?[Object]> 描述请求失败的对象，如果有的话
  * errorText <[string]> e.g. `'net::ERR_FAILED'`

该方法返回，null除非这个请求失败，如requestfailed事件报告

记录所有失败请求

```
page.on('requestfailed', request => {
  console.log(request.url + ' ' + request.failure().errorText);
});
```

#### request.headers()

* returns: <[Object]> 具有与请求关联的HTTP标头的对象。所有标题名称都是小写的

#### request.method()

* returns: <[string]> 请求的方法（GET，POST等）

#### request.postData()

* returns: <[string]> 请求的body

#### request.resourceType()

* returns: <[string]>

请求资源的类型 document, stylesheet, image, media, font, script, texttrack, xhr, fetch, eventsource, websocket, manifest, other.

# request.respond(response)

* response <[Object]> 满足此请求的响应
  * status <[number]> 状态码 默认200
  * headers <[Object]> 可选响应头
  * contentType <[string]> 设置Content-Type响应头
  * body <[Buffer]|[string]> 可选响应主体
* returns: <[Promise]>

以给定的回应完成请求。为了使用这个，请求拦截应该被启用page.setRequestInterception。如果请求拦截未启用，则引发异常。

以404个响应完成所有请求的示例：
```
await page.setRequestInterception(true);
page.on('request', request => {
  request.respond({
    status: 404,
    contentType: 'text/plain',
    body: 'Not Found!'
  });
});
```
> 不支持对dataURL的mock, request.respond 对一个dataUrl相当于noop

#### request.response()

* returns: <?Response> 匹配的Response对象, 无响应返回null

#### request.url()

* returns: <[string]> request的url

# class: Response

代表页面接受的响应

#### response.buffer()

* returns: <[Promise]<[Buffer]>> 解析body的buffer

#### response.headers()

* returns: <[Object]> 具有与响应关联的HTTP标头的对象。所有标题名称都是小写的。

#### response.json()

* returns: <[Promise]<[Object]>>用json表示的响应主体

不能json化则报错

#### response.ok()

* returns: <[boolean]>

包含一个布尔值，说明响应是否成功（状态在200-299范围内）。

#### response.request()

* returns: <[Request]> 一个匹配的Request对象

#### response.status()

* returns: <[number]>

Contains the status code of the response (e.g., 200 for a success).

#### response.text()

* returns: <[Promise]<[string]>> body的文本表示

#### response.url()

* returns: <[string]>

Contains the URL of the response.

# class: Target

#### target.page()

* returns: <[Promise]<?[Page]>>

If the target is not of type "page", returns null.

#### target.type()

* returns: <[string]>

Identifies what kind of target this is. Can be "page", "service_worker", or "other".

#### target.url()

* returns: <[string]>






