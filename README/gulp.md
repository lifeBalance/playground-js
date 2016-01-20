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

Later we'll see what else we can do in the `scripts` section of the `package.json` file.

> Check out the **gulp** branch to see the state of the project at this stage.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: #


<!-- links -->
[1]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started
[2]: https://www.npmjs.org/
[3]: https://docs.npmjs.com/files/package.json#bin
[4]: http://gulpjs.com/
