# Recommended way of installing gulp
In the [official gulp documentation][1] we are told to install [gulp][4] both:

* **Locally:**

  ```
  $ npm install --save-dev gulp
  ```

* And **globally**:

  ```
  $ npm install --global gulp
  ```

But why do we have to install both ways? It should be enough installing it locally, and as a matter of fact it is.

## Installing just locally
Let's create a project named `test` to see if we can install gulp just **locally** and make it work. We are going to start with the creation of a `package.json` file:

```
$ mkdir test
$ cd test
$ npm init -y
```

> The `-y` flag is to avoid all the questions and generate the file with all the defaults.

And let's install gulp **locally** with:

```
$ npm install --save-dev gulp
```

Inside our `test` project we are gonna create a simple `gulpfile.js` with a simple task that is gonna output the string *Hello world!* to the console, just for the sake of testing:

```js
var gulp = require('gulp');

gulp.task('default', function () {
  console.log('Hello, world!');
});
```

Now, if we try to run **gulp** when it's been just locally installed:

```
$ gulp
bash: gulp: command not found
```

The shell will throw a `command not found` error, why? because simply put, it doesn't know where to look for the gulp executable, it is not in our `$PATH`. But if we pass the shell the exact location of the gulp executable:

```
$ ./node_modules/.bin/gulp
[23:48:30] Using gulpfile ~/test/gulpfile.js
[23:48:30] Starting 'default'...
Hello, world!
```

Truth is that the only reason we are told to install **gulp** globally, it's because the global gulp is added to our `$PATH`. Once called, the **global gulp** looks for a locally installed gulp to pass control to. But it's the local gulp, the one that it's gonna do the actual job.

So if we don't want to install gulp **globally**, right now, our options are:

* Updating our `$PATH` on every project, so our shell knows where to look for the gulp executable.
* Or we can also type the full path to the **gulp** executable every time we want to use it.

None of these solutions look very practical. Anything else?

## npm saves the day
Fear not, [npm][2] got us covered here. We just have to include in our `package.json` file, the path to the gulp executable in the list of scripts, like this:
```json
{
  "scripts": {
    "gulp": "node_modules/gulp/bin/gulp.js"
  }
}
```

Then it's enough to run `$ npm run gulp` and that would be the end of it, no need to install gulp globally. And if you check the [npm docs][3], they explain that on install, **npm** creates **symlinks** for our executables. They are put in the `node_modules/.bin`, if you look there there should be a symlink called `gulp`, so you can use this symlink in your script field instead:
```json
{
  "scripts": {
    "gulp": "gulp"
  }
}
```

So again, and to finish, now we can install gulp just **locally** and run it with:
```
$ npm run gulp
```

In a minute we'll see what else we can do in the `scripts` section of the `package.json` file.

## A small structure for our project
Let's create a couple of folders:

* The `src` folder where we'll put all our source files before being processed.
* The `dist` folder to hold the result of processing these files.

And also a `gulpfile.js` requiring `gulp` itself:
```js
'use strict';

var gulp = require('gulp');
```

Note that at the top we've added a `'use strict'` directive. If you're using [JSHint][8] and this directive is giving you a hard time, add the following to your `package.json` file:
```json
"jshintConfig": {
  "node": true
},
```

## A development server
We're also gonna be using [browsersync][5] as a development server. To install it locally and have it added to our development dependencies just run:
```
$ npm install browser-sync --save-dev
```

Then we'll require it and add a small server in our `gulpfile.js`:
```js
...
var browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('default', ['serve']);
```

Notice we have also added a **default** gulp task at the bottom that will be run every time we call gulp. This default task launches the server.

Finally, we'll modify the `"script"` key in our `package.json` file:
```json
"scripts": {
  "start": "gulp"
}
```

This way, running `npm start` will call gulp, which default task is set to launch the server. It will automatically open a new tab in our browser pointing to [http://localhost:3000/][6].

> Add a simple `index.html` file to your `dist/` folder to check it's working.

### Browsersync options
There are available a number of [options][7] that we can add as properties of the object that we are passing as first argument to the `init()` method. For example:

* `open`, if you don't want browserSync automatically open your browser set this option to `false`.
* `port`, use a specific port (instead of the one auto-detected by Browsersync)

> Check out the [gulp branch][9] to see the state of the project at this stage.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: browserify.md


<!-- links -->
[1]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started
[2]: https://www.npmjs.org/
[3]: https://docs.npmjs.com/files/package.json#bin
[4]: http://gulpjs.com/
[5]: https://www.browsersync.io/
[6]: http://localhost:3000/
[7]: https://www.browsersync.io/docs/options
[8]: http://jshint.com/
[9]: https://github.com/lifeBalance/playground-js/tree/gulp
