(function($, undefined) {

  QUnit.module('jQuery#isNativeFunction');

  QUnit.test('Objects that are not functions', function(assert) {
    QUnit.expect(7);

    assert.strictEqual($.isNativeFunction(undefined), false);
    assert.strictEqual($.isNativeFunction(null), false);
    assert.strictEqual($.isNativeFunction(true), false);
    assert.strictEqual($.isNativeFunction(1), false);
    assert.strictEqual($.isNativeFunction("function"), false);
    assert.strictEqual($.isNativeFunction({}), false);
    assert.strictEqual($.isNativeFunction(window), false);
  });


  QUnit.test('Trick objects with custom `toString`', function(assert) {
    QUnit.expect(4);

    // Own `toString`
    var trick1 = {
      toString: function() {
        return 'function trick() { [native code] }';
      }
    };
    // Inherited `toString`
    var trick2 = (function() {
      var Trick = function() {};
      Trick.prototype = trick1;
      return new Trick();
    })();
    // Prototype `toString`
    var trick3 = (function() {
      var Trick = function() {};
      Trick.prototype.toString = function() {
        return 'function trick() { [native code] }';
      };
      return new Trick();
    })();
    // Cyclic `toString`
    var trick4 = (function() {
      var toStringFn = function() {
        return 'function trick() { [native code] }';
      };
      toStringFn.toString = toStringFn;
      return {
        toString: toStringFn
      };
    })();

    assert.strictEqual($.isNativeFunction(trick1), false);
    assert.strictEqual($.isNativeFunction(trick2), false);
    assert.strictEqual($.isNativeFunction(trick3), false);
    assert.strictEqual($.isNativeFunction(trick4), false);
  });


  QUnit.test('Trick objects with custom `valueOf`', function(assert) {
    QUnit.expect(4);

    // Own `valueOf`
    var trick1 = {
      valueOf: function() {
        return 'function trick() { [native code] }';
      }
    };
    // Inherited `valueOf`
    var trick2 = (function() {
      var Trick = function() {};
      Trick.prototype = trick1;
      return new Trick();
    })();
    // Prototype `valueOf`
    var trick3 = (function() {
      var Trick = function() {};
      Trick.prototype.valueOf = function() {
        return 'function trick() { [native code] }';
      };
      return new Trick();
    })();
    // Cyclic `valueOf`
    var trick4 = (function() {
      var valueOfFn = function() {
        return 'function trick() { [native code] }';
      };
      valueOfFn.valueOf = valueOfFn;
      return {
        valueOf: valueOfFn
      };
    })();

    assert.strictEqual($.isNativeFunction(trick1), false);
    assert.strictEqual($.isNativeFunction(trick2), false);
    assert.strictEqual($.isNativeFunction(trick3), false);
    assert.strictEqual($.isNativeFunction(trick4), false);
  });


  QUnit.test('Trick functions with custom `toString`', function(assert) {
    QUnit.expect(4);

    // Own `toString`
    var trick1 = function() {};
    trick1.toString = function() {
      return 'function trick() { [native code] }';
    };
    // Inherited `toString`
    var trick2 = (function() {
      var Trick = function() {
        return function() {};
      };
      Trick.prototype = trick1;
      return new Trick();
    })();
    // Prototype `toString`
    var trick3 = (function() {
      var Trick = function() {};
      Trick.prototype.toString = function() {
        return 'function trick() { [native code] }';
      };
      return Trick;
    })();
    // Cyclic `toString`
    var trick4 = (function() {
      var toStringFn = function() {
        return 'function trick() { [native code] }';
      };
      toStringFn.toString = toStringFn;
      return toStringFn;
    })();

    assert.strictEqual($.isNativeFunction(trick1), false);
    assert.strictEqual($.isNativeFunction(trick2), false);
    assert.strictEqual($.isNativeFunction(trick3), false);
    assert.strictEqual($.isNativeFunction(trick4), false);
  });


  QUnit.test('Trick functions with custom `valueOf`', function(assert) {
    QUnit.expect(4);

    // Own `valueOf`
    var trick1 = {
      valueOf: function() {
        return 'function trick() { [native code] }';
      }
    };
    // Inherited `valueOf`
    var trick2 = (function() {
      var Trick = function() {};
      Trick.prototype = trick1;
      return new Trick();
    })();
    // Prototype `valueOf`
    var trick3 = (function() {
      var Trick = function() {};
      Trick.prototype.valueOf = function() {
        return 'function trick() { [native code] }';
      };
      return new Trick();
    })();
    // Cyclic `valueOf`
    var trick4 = (function() {
      var valueOfFn = function() {
        return 'function trick() { [native code] }';
      };
      valueOfFn.valueOf = valueOfFn;
      return {
        valueOf: valueOfFn
      };
    })();

    assert.strictEqual($.isNativeFunction(trick1), false);
    assert.strictEqual($.isNativeFunction(trick2), false);
    assert.strictEqual($.isNativeFunction(trick3), false);
    assert.strictEqual($.isNativeFunction(trick4), false);
  });


  QUnit.test('Non-native functions', function(assert) {
    QUnit.expect(4);

    (function() {
      /*jshint -W054 */
      assert.strictEqual($.isNativeFunction(new Function()), false);
    })();
    assert.strictEqual($.isNativeFunction(function() {}), false);
    assert.strictEqual($.isNativeFunction($), false);
    assert.strictEqual($.isNativeFunction($.isNativeFunction), false);
  });


  QUnit.test('Native functions', function(assert) {
    QUnit.expect(2);

    assert.strictEqual($.isNativeFunction(window.setTimeout), true);
    assert.strictEqual($.isNativeFunction(window.alert), true);
  });


  QUnit.test('Questionable native functions', function(assert) {
    QUnit.expect(5);

    // In oldIE, native host object methods like `window.alert` do NOT have a `.call` property
    if (typeof window.alert.call !== 'undefined' && window.alert.call !== null) {
      assert.strictEqual($.isNativeFunction(window.alert.call), true, '`.call`');
    }
    else {
      assert.ok(true, 'Skipped! This browser\'s native host object methods do not have a `.call` property.');
    }

    // In oldIE, native host object methods like `window.alert` do NOT have a `.apply` property
    if (typeof window.alert.apply !== 'undefined' && window.alert.apply !== null) {
      assert.strictEqual($.isNativeFunction(window.alert.apply), true, '`.apply`');
    }
    else {
      assert.ok(true, 'Skipped! This browser\'s native host object methods do not have a `.apply` property.');
    }

    // Some older browsers just don't have the `.bind` sugar method at all
    if (typeof Function.prototype.bind === 'undefined') {
      assert.ok(true, 'Skipped! This browser\'s Function prototypes do not have a `.bind` property.');
    }
    // In oldIE, native host object methods like `window.alert` do NOT have a `.bind` property
    else if (typeof window.alert.bind === 'undefined' || window.alert.bind === null) {
      assert.ok(true, 'Skipped! This browser\'s native host object methods do not have a `.bind` property.');
    }
    else {
      assert.strictEqual($.isNativeFunction(window.alert.bind), true, '`.bind`');
    }

    // In oldIE, native host object methods like `window.alert` do NOT have a `.toString` property
    if (typeof window.alert.toString !== 'undefined' && window.alert.toString !== null) {
      assert.strictEqual($.isNativeFunction(window.alert.toString), true, '`.toString`');
    }
    else {
      assert.ok(true, 'Skipped! This browser\'s native host object methods do not have a `.toString` property.');
    }

    // In oldIE, native host object methods like `window.alert` do NOT have a `.valueOf` property
    if (typeof window.alert.valueOf !== 'undefined' && window.alert.valueOf !== null) {
      assert.strictEqual($.isNativeFunction(window.alert.valueOf), true, '`.valueOf`');
    }
    else {
      assert.ok(true, 'Skipped! This browser\'s native host object methods do not have a `.valueOf` property.');
    }
  });

}(jQuery));
