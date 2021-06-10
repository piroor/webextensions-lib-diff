# webextensions-lib-dom-updater

![Build Status](https://github.com/piroor/webextensions-lib-dom-updater/actions/workflows/main.yml/badge.svg?branch=trunk)

A simple DOM Updater for browser extensions, aiming to help cross-process request to update DOM contents in a "server" extension. **Designed mainly for the real DOM world on web browsers, not for Node.js world.**

This includes a diff implementation ported from Python.

## Usage

Put `src/diff.js` and `src/dom-updater.js` together into your extension. For example:

```sh
$ cd your-extension
$ npm install webextensions-lib-dom-updater
$ cp node_modules/webextensions-lib-dom-updater/src/diff.js src/
$ cp node_modules/webextensions-lib-dom-updater/src/dom-updater.js src/
```

or

```sh
$ git clone https://github.com/piroor/webextensions-lib-dom-updater.git
$ cp webextensions-lib-dom-updater/src/diff.js ../your-extension/src/
$ cp webextensions-lib-dom-updater/src/dom-updater.js ../your-extension/src/
```

or

```sh
$ cd your-extension/src
$ wget https://github.com/piroor/webextensions-lib-dom-updater/raw/master/src/diff.js
$ wget https://github.com/piroor/webextensions-lib-dom-updater/raw/master/src/dom-updater.js
```

Then you can load the updater like:

```javascript
import { DOMUpdater } from './dom-updater.js';

DOMUpdater.update(document.getElementById('target'), changes);
```

## Usecase on browser extensions

On the client extension side:

```javascript
const tab = await browser.tabs.get(tabId);
browser.runtime.sendMessage(
  'ID of the server extension',
  `
    <span id="tab"
          class="${tab.active ? 'active' : ''}">
      <span id="throbber"
            class="${tab.status}">
        <span id="throbber-image"
              class="${tab.status}"></span>
      </span>
      <img id="favicon"
           class="${tab.status}"
           src="${tab.favIconUrl}">
      <span id="label">${tab.title}</span>
    </span>
  `.trim()
);
```

On the server extension side:

```javascript
browser.runtime.onMessageExternal(message => {
  const before = document.getElementById('tab-renderer');

  const range = document.createRange();
  range.setStart(document.body, 0);
  const after = range.createContextualFragment(message);
  range.detach();

  DOMUpdater.update(before, after);
});
```

## Comparison with similar libraries

Here is a result of [the performance benchmark](https://github.com/piroor/treestyletab/blob/86a697e3afb0045a0d53b5cbb7cd06f6cfa050cb/webextensions/tests/test-dom-updater.js).

|Implementation|Total turnaround time to update 5000 times|Average turnaround time per one updating|
|---|---|---|
|DOMUpdater|15030msec|about 3.01msec|
|[morphdom](https://github.com/patrick-steele-idem/morphdom), with string parameter|18899msec|about 3.78msec|
|[morphdom](https://github.com/patrick-steele-idem/morphdom), with DocumentFragment parameter|18496msec|about 3.70msec|

Environment:

* Runtime: Firefox Nightly 75.0a1 (2020.3.9)
* OS: Windows 10
* CPU: Intel Core i5-8250U 1.80GHz
* RAM: 16.0GB


## How to run test

```sh
$ npm install
$ npm run test
```

## License

* `dom-updater.js` and most resources are licensed under the MIT License.
* `diff.js` is licensed under the Python Software Foundation License.

