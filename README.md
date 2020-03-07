# webextensions-lib-dom-updater

[![Build Status](https://travis-ci.org/piroor/webextensions-lib-dom-updater.svg?branch=master)](https://travis-ci.org/piroor/webextensions-lib-dom-updater)

A simple DOM Updater for browser extensions, aiming to help cross-process request to update DOM contents in a "server" extension.

This includes a diff implementation ported from Python.

## Usage

Put `diff.js` and `dom-updater.js` together into your extension. For example:

```sh
$ git clone https://github.com/piroor/webextensions-lib-dom-updater.git
$ cp webextensions-lib-dom-updater/diff.js ../your-extension/src/
$ cp webextensions-lib-dom-updater/dom-updater.js ../your-extension/src/
```

or

```sh
$ cd your-extension/src
$ wget https://github.com/piroor/webextensions-lib-dom-updater/raw/master/diff.js
$ wget https://github.com/piroor/webextensions-lib-dom-updater/raw/master/dom-updater.js
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

## How to run test

```sh
$ npm install
$ npm run test
```

Note that this is not a public npm module. `package.json` is there just to run tests.

## License

* `dom-updater.js` and most resources are licensed under the MIT License.
* `diff.js` is licensed under the Python Software Foundation License.

