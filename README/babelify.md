# Using JavaScript's new features
In June 2015 the **sixth edition** of the JavaScript standard was finally published under the official denomination of [ECMAScript 2015][1]. As of January 2016, the support for **ES2015** (aka ES6) varies among browsers. Not even the latest version of [Node.js][2] has full support for the new standard.

The solution to this problem is translate the latest **ES6** code to the old and well supported **ES5** version, a process known as **transpilation**. There are several tools able to do that being the two most popular ones:

* [Traceur][3]
* [Babel][4]

We're just gonna focus on Babel here.

## Babel
Babel has support for the latest version of JavaScript through syntax transformers. These allow you to use all the features of the new syntax, right now without waiting for full support in browsers or Node.js.

The current project version is number **6**, and is maintained in [github][5]. The amount of packages in this repo may be overwhelming, so let's try to highlight the most important ones:

* `babel-core` is the core of babel, but we will rarely need to install this package since it is a dependency of other packages such as `babel-cli`, and it will be automatically installed when they are installed.
* `babel-cli` is a command line interface to Babel and it includes the following commands:

  * `babel-doctor` detects common problems with your Babel installation.
  * `babel` transpiles files or stdin via Babel.
  * `babel-node` a version of the Node.js executable node that transpiles everything via Babel.
  * `babel-external-helper`s prints all of Babel’s helper functions to the console.

* `babel-register` lets you switch on Babel transpilation from within Node.js. After you do, all modules you require are automatically transpiled.

### Installing Babel
While you can install Babel CLI globally on your machine, it's much better to install it **locally** project by project. We can install Babel CLI **locally** by running:
```
$ npm i babel-cli -D
```

> Since it's generally a bad idea to run Babel globally you may want to **uninstall the global copy** by running:
  ```
  $ npm uninstall --global babel-cli.
  ```

### Plugins
Out of the box Babel doesn't do anything. In order to actually do anything to your code you need to enable **plugins**, which are functions that are applied to the input during compilation. We can separate plugins in 2 main categories:

* **Syntax plugins**, which allow Babel to parse specific syntaxes such as ES6 generators, or React JSX.
* **Transform plugins** apply transformations to your code. These plugins will enable the corresponding syntax plugin so you don't have to specify both.

Check the [Babel site][6] for more info about them.

### Presets
Presets are **sets of plugins** that support various compilation scenarios. Some commonly used presets are:

* [es2015][7] compiles ES6 (as described by the ECMAScript spec) to ES5
* [react][8] compiles JSX to JavaScript and removes Flow type annotations
* [es2015-node5][9] Contains just those plugins that are needed to upgrade Node.js 5 to full ES6. Therefore, a lot less is transpiled than with the es2015 preset.

Check the [Babel site][10] for more info about them.

Presets are installed via [npm][11]. Their package names are their names plus the prefix `babel-preset-`. For example, to install the preset `es2015` we would run:

```
$ npm i babel-preset-es2015 -D
```

### Command Line Usage
Now that we have installed Babel itself and a preset, we could start using it from the command line:

```
$ babel --presets es2015 script.js --out-file script-compiled.js
```

The line above will transpile `script.js` and write the output to `script-compiled.js`, using the `es2015` preset. There are a lot of **options** available to use with Babel, check the [whole list here][12].

> We can even set up different **environments** using the `env` option. The `env` key will be taken from the value of the `process.env.BABEL_ENV` **environment variable**, when this is not available then it uses the value set in `process.env.NODE_ENV`, and if that is not available either then it defaults to "development".

#### Options in a .babelrc file
Instead of passing all the options as command line arguments, some people find more convenient to set them up in a `.babelrc` file place at the root of our project. This file allows any of the options we can pass in the command line.

#### Options in package.json file
Alternatively we can specify our `.babelrc` config from within `package.json` under a `babel` key, like this:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": "es2015"
  }
}
```

### Using Babel with Browserify: Babelify
To start using Babel in our current setup we are gonna need to install:

* A Browserify's **transform** named [Babelify][13].
* The [babel-preset-es2015][7].

> **Transforms** are sort of Browserify's plugins that are run before the `bundle()` method. This allows us to preprocess our code before sending it to Browserify. Check [here][14] for the list of transforms that Browserify has available.

So let's run:
```
$ npm i babelify babel-preset-es2015 -D
```

Now we'll require it at the top of our `gulpfile.js`:
```js
...
var babelify = require('babelify');
...
```

We have several ways to start using the `babelify` transform. We're just gonna add the following code to our `'scripts'` task:
```js
...
bundler.transform(babelify, {
  presets: ["es2015"],
  only: /src\/js/, // Only files in the src/js folder.
  sourceMaps: true
});
...
```

> We could have also used the `configure` method:
> `.transform(babelify.configure({ presets: ["es2015"] }))`

* The `presets` option takes an array of strings with the names of the presets we want to use.
* With the `only` property we can specify a **regex** to match the directories we want to process.
* The `sourceMaps` option must be set to `true`, otherwise we don't get maps.

To try this out, let's rewrite our scripts using ES6 syntax. First `foo.js`:
```js
let message = "I'm not in the global namespace anymore!"; // ES6 block scope local variable.

export { message }; // ES6 module syntax.
```

And then `main.js`:
```js
import { message } from './foo'; // ES6 module syntax.

console.log("I'm in main.js");
console.log(message);
```

And that's it, if we run `npm start`, our browser's console should show the output of the `console.log` statements, and the source maps should point to the right file.


> Check out the [babelify branch][17] to see the state of the project at this stage.

---
[1]: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
[2]: https://nodejs.org/en/
[3]: https://github.com/google/traceur-compiler
[4]: https://babeljs.io
[5]: https://github.com/babel/babel
[6]: https://babeljs.io/docs/plugins/
[7]: http://babeljs.io/docs/plugins/preset-es2015/
[8]: http://babeljs.io/docs/plugins/preset-react/
[9]: https://github.com/alekseykulikov/babel-preset-es2015-node5
[10]: https://babeljs.io/docs/plugins/#presets
[11]: https://www.npmjs.org/
[12]: https://babeljs.io/docs/usage/options/
[13]: https://github.com/babel/babelify
[14]: https://github.com/substack/node-browserify/wiki/list-of-transforms
[15]: https://facebook.github.io/react/
[16]: https://babeljs.io/docs/plugins/preset-react/
[17]: https://github.com/lifeBalance/playground-js/tree/watchify
