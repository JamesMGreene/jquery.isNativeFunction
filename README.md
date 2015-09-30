[![Build Status](https://travis-ci.org/JamesMGreene/jquery.isNativeFunction.png?branch=master)](https://travis-ci.org/JamesMGreene/jquery.isNativeFunction)

# jquery.isNativeFunction

A jQuery plugin that adds a static `isNativeFunction` method to determine if an object is actually a browser's native host object function.
This plugin was inspired by [jQuery core bug #4536](http://bugs.jquery.com/ticket/4536).

## Getting Started
Check the [jQuery Plugins Registry](http://plugins.jquery.com/isNativeFunction/) for the latest published version of this plugin!

You can also download the [production version][min] or the [development version][max] from GitHub.

[min]: https://raw.github.com/JamesMGreene/jquery.isNativeFunction/master/dist/jquery.isNativeFunction.min.js
[max]: https://raw.github.com/JamesMGreene/jquery.isNativeFunction/master/dist/jquery.isNativeFunction.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.isNativeFunction.min.js"></script>
<script>
    jQuery.isNativeFunction(window.alert);  // true
</script>
```

## Examples
```js
// Confirm that the `window.alert` function is a native host object function
jQuery.isNativeFunction(window.alert);  // true

// Confirm that the `jQuery` function is NOT a native host object function
jQuery.isNativeFunction(jQuery);  // false
```


## Compatibility
**Works 100% with jQuery versions:**  
 - 1.0.x
 - 1.1.x
 - 1.2.x
 - 1.3.x
 - 1.4.x
 - 1.5.x
 - 1.6.x
 - 1.7.x
 - 1.8.x
 - 1.9.x
 - 1.10.x
 - 2.0.x


## Documentation
_(Coming soon)_

## Release History
 - 1.0.1: Published to the jQuery Plugins Registry on 2013-07-16.
     - Updated plugin description in the manifest.
     - Added Travis test config for Node.js 0.10.x.
 - 1.0.0: Published to the jQuery Plugins Registry on 2013-07-16.
     - Initial release.
