# Browserify
[Browserify][1] is an [npm][2] package that allows us to use the [CommonJS][3] module system (the one built-in in Node.js) inside our JavaScript code for the browser. That means that we can use the `require` function to include **modules** that exist in separate files and then bundle all into a single file ready to be used in our browser.

That may sound a bit like concatenating our JavaScript code into a single file, but there's quite more to it. Without using a module system, any identifiers (variables, function names, etc) that we use at the **top-level** our any of our scripts, end up in the **global namespace**. Let's make a test; inside the `dist` folder create a `public/js` structure and add the `foo.js` script in it:

```js
var message = "I'm polluting the global namespace";
```

Include the script in your `index.html` file:
```html
  <script type="text/javascript" src="public/js/foo.js"></script>
```

Start the server, open the JavaScript console in the **developer tools**, type `message` and hit return, the result is that we have available its value in the global namespace. If we used that same name for a function or another variable in our code, there would be **name clashing**. A module system avoids that.

## Browserify's CLI
For a basic use we can install Browserify **globally** and have it available as a command anywhere on our system:

```
$ npm i browserify -g
```

Once installed, what can we do with it?

### We can require local files
For example, next to `foo.js` create the following `main.js` file:

```js
var foo = require('./foo.js');

console.log(foo.msg);
```

And modify `foo.js` so it becomes a module that export a variable:
```js
var message = "I'm not in the global namespace anymore";

exports.msg = message;
```

Now we can use the `browserify` command to build a bundle from the `main.js` file:

```
$ browserify dist/public/js/main.js > dist/public/js/bundle.js
```

To use this bundle file, we just have to add a script tag to our HTML markup:

```html
<script src="public/js/bundle.js"></script>
```

Now start the server (`npm start`) and open your JavaScript console; the `message` variable is not available in the global namespace anymore.

### We can require npm packages
We are not limited to require local files, we can also require stuff that we have installed using **npm**, for example:

```
$ npm install jquery underscore --save-dev
```

> From now on we'll be using shortcuts when installing stuff: `npm i jquery underscore -D`

Now we can require both of them in our script:

```js
var $ = require('jquery');
var _ = require('underscore');
```

Again run the `browserify` command:

```
$ browserify main.js > bundle.js
```

And browserify will have both libraries added to the **bundle**. The ability of requiring both **local files** and **packages** installed with `npm` is quite nice.

## Including Browserify in our Gulp build
Using the `browserify` command is all well and good, but much better if we introduce it into our build tool of choice, in this case [Gulp][3]. To do that there used to be a couple of gulp plugins that acted as wrappers for Browserify, but they have been deprecated in favor of more generic choices.

The reason to be for these mentioned deprecated plugins was that even though Gulp works with **streams**, these are not the same streams used in the [Node.js stream module][4]. In other words, we are dealing with two kinds of streams:

* Browserify operates with Node.js regular text/buffer streams.
* Gulp works with streams that are in **object mode**, known as [vinyl file objects][5].

So if we want to pipe browserify regular streams into Gulp, we need a way of converting them to vinyl file objects. There are several packages that achieve this goal, to name a couple:

* [vinyl-source-stream][6]
* [vinyl-transform][7] (Currently not working)

We are gonna be using the first one, **vinyl-source-stream** which basically takes a text stream as input, and emits a single vinyl file instance ready to be consumed by the Gulp pipeline.

### Installing everything
Let's install some packages:

* [browserify][1]
* [vinyl-source-stream][6]
* [gulp-util][7], a package with some utility functions for gulp plugins. Here we're gonna use it basically to log any errors to the console.

```
$ npm i gulp browserify vinyl-source-stream -D
```

Once the installation finishes we can require the packages in our `gulpfile.js`:
```js
...
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');
```

## Our scripts task
To start using the thing let's put together a basic task for handling our scripts in our `gulpfile.js`:

```js
...

// Static server
gulp.task('serve', function() {
  ...
  // Watching for changes
  gulp.watch("src/js/*.js", ['scripts']);
});

// The `scripts` task
gulp.task('scripts', function () {
  return browserify('src/js/main.js')
    .bundle()
    .on('error', function (e) {
      gutil.log(e);
    })
    .pipe(source('bundle.js'))    // Creates in-memory vinyl file object.
    .pipe(gulp.dest('dist/public/js')) // Written to dist/public/js/bundle.js
    .pipe(browserSync.stream()); // Reload browser when bundle.js is written
});

// The default task
gulp.task('default', ['serve', 'scripts']);
```

What have we done:
1. Added a line to our `serve` task to watch for changes in our JavaScript source files. When changes are detected the `scripts` task is run.
2. In the `scripts` task we've done several things:

  * In the first line we return a call to the `browserify` function passing the entry point of our application.
  * Then we call the `bundle()` method.
  * In case of errors, they will be logged to the console by `gutil.log`
  * Then the `source` method (`vinyl-source-stream` package) creates an in memory vinyl object that we can plug into gulp again.
  * Write the `bundle.js` file.
  * Finally, refresh the browser when the bundle has been written.

> Check out the [browserify branch][11] to see the state of the project at this stage.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: gulp.md
[next]: #


<!-- links -->
[1]: http://browserify.org/
[2]: https://github.com/npm/npm
[3]: http://www.commonjs.org/
[4]: https://nodejs.org/api/stream.html
[5]: https://github.com/gulpjs/vinyl
[6]: https://www.npmjs.com/package/vinyl-source-stream
[7]: https://www.npmjs.com/package/gulp-util
[8]: https://github.com/lifeBalance/playground-js/tree/browserify
