@environment-safe/runtime-context
=================================
There are situations where browser support and server support never even *tried* getting on the same page. ex: consider that URL paths all use unix separators, while `file:` urls use platform specific paths and node.js URLs uses both `file:` paths (but with a different interaction pattern) and native paths. In addition most of the places you have access to poll are standard locations which are the same from platform to platform.

Essentially the standards bodies invent something new every time the problem appears.

Imagine how much simpler node would have been with all posix paths and virtual locations for platform specific weirdness?

In these situations you need specific detail about what the running scenario is. That's what this module does. In addition it fixes some logic to make server and client OS detection symmetrical and augments the `detect-browser` code (It now detects a wide array of operating systems).

Usage
-----

```javascript
import { 
    isBrowser, 
    isNode, 
    isWebWorker, 
    isElectron, 
    isElectronRenderer,
    isElectronMain,
    isElectronBrowser,
    isJsDom, 
    isDeno,
    isBun,
    isClient, // is running a client
    isServer, // is running on a server runtime
    variables, // global variables
    isLocalFileRoot, // run within a page using a file: url
    isUrlRoot, //run within a page with a served url
    isServerRoot, //run within a 
    os, // Operating system, machine friendly
    operatingSystem, // Operating System, label
    runtime // server runtime name or browser name
} from '@environment-safe/runtime-context';
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

