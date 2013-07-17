/*
 * isNativeFunction
 * https://github.com/JamesMGreene/jquery.isNativeFunction
 *
 * Copyright (c) 2013 James M. Greene
 * Licensed under the MIT license.
 */

(function($, window) {
  'use strict';


  // RegExps
  var _nativeFuncBodyRegex = /^function [A-Za-z_\$][A-Za-z0-9_\$]*\s?\([^\(\)]*\)\s?\{\s?\[(native )?code\]\s?\}?;?}$/,
      _multiSpaceRegex = /\s+/g,
      _singleSpace = ' ',

      //
      // Core references
      //
      _coreObj = window.Object,
      _coreFunc = window.Function,
      _coreFunc_toString = _coreFunc.prototype.toString,
      _coreFunc_valueOf = _coreFunc.prototype.valueOf,
      _coreFunc_call = _coreFunc.prototype.call,
      _coreFunc_apply = _coreFunc.prototype.apply,
      _coreFunc_bind = _coreFunc.prototype.bind,
      _coreFunc_bind_type = typeof _coreFunc_bind,

      // Convenience references
      _objectType = 'object',
      _functionType = 'function',
      _undefinedType = 'undefined',
      _nullType = 'null',

      //
      // Functions
      //
      _$trim = $.trim,
      
      // `$.type` was added in jQuery 1.4.3
      _$type = typeof $.type === _functionType ? $.type : function(o) {
        var type = typeof o;
        return type === _objectType && o === null ? _nullType : type;
      },

      _getFunctionBody = function(o) {
        // NOTE:
        // The use of `String(o)` here instead of `'' + o` protects against trick objects with custom `valueOf` functions
        // so long as they do not also have a trick `toString` function. `String(o)` itself does NOT protect against trick
        // objects with custom `toString` functions.
        return _$trim(String(o)).replace(_multiSpaceRegex, _singleSpace);
      },

      _isFunctionPrototypeMethod = function(o) {
        return _$type(o.prototype) === _undefinedType &&
               (
                 o === _coreFunc_toString ||
                 o === _coreFunc_valueOf ||
                 o === _coreFunc_call ||
                 o === _coreFunc_apply ||
                 (_coreFunc_bind_type !== _undefinedType && o === _coreFunc_bind)
               );
      },

      _hasPurePrototypeFromFunctionPrototype = function(o) {
        return (
                 (
                   // Chrome, IE9+
                   _$type(o.prototype) === _objectType ||
                   // Firefox, PhantomJS
                   _$type(o.prototype) === _undefinedType
                 ) &&
                 // `toString`
                 _$type(o.toString) === _functionType &&
                 o.toString === _coreFunc_toString &&
                 _nativeFuncBodyRegex.test(_getFunctionBody(o.toString)) &&
                 // `valueOf`
                 _$type(o.valueOf) === _functionType &&
                 o.valueOf === _coreFunc_valueOf &&
                 _nativeFuncBodyRegex.test(_getFunctionBody(o.valueOf)) &&
                 // `call`
                 _$type(o.call) === _functionType &&
                 o.call === _coreFunc_call &&
                 _nativeFuncBodyRegex.test(_getFunctionBody(o.call)) &&
                 // `apply`
                 _$type(o.apply) === _functionType &&
                 o.apply === _coreFunc_apply &&
                 _nativeFuncBodyRegex.test(_getFunctionBody(o.apply)) &&
                 // `bind`
                 (
                   _$type(_coreFunc_bind) === 'undefined' ||
                   (
                     _$type(o.bind) === _functionType &&
                     o.bind === _coreFunc_bind &&
                     _nativeFuncBodyRegex.test(_getFunctionBody(o.bind))
                   )
                 )
               );
      },

      _isNativeFunction = function(o) {
        var type = _$type(o);

        // IE9+ and evergreen browser host object functions
        if (type === _functionType) {
                 // Every host object function must pass this check
          return _nativeFuncBodyRegex.test(_getFunctionBody(o)) &&
                 // Verify other core assumptions
                 o instanceof _coreFunc &&
                 o instanceof _coreObj &&
                 (
                   _isFunctionPrototypeMethod(o) ||
                   _hasPurePrototypeFromFunctionPrototype(o)
                 );
        }

        // oldIE (IE<9) browser host object functions
        if (type === _objectType) {
                 // Every host object function must pass this check
          return _nativeFuncBodyRegex.test(_getFunctionBody(o)) &&
                 // Very other core assumptions: oldIE host object functions inherit from nothing
                 !(o instanceof _coreFunc) &&
                 !(o instanceof _coreObj) &&
                 _$type(o.prototype) === _undefinedType &&
                 // Verify that other core Function.prototype methods are undefined
                 _$type(o.toString) === _undefinedType &&
                 _$type(o.valueOf) === _undefinedType &&
                 _$type(o.call) === _undefinedType &&
                 _$type(o.apply) === _undefinedType &&
                 _$type(o.bind) === _undefinedType;
        }

        // Anything else is definitely NOT a host object function
        return false;
      };

  /**
   * Determines if an object is actually a browser's native host object function.
   * @param {any} fn   Some object, presumably a function or native host object method.
   * @return {boolean} `true` if `fn` was a native function, otherwise `false`.
   */
  $.isNativeFunction = function(fn) {
    return _isNativeFunction(fn);
  };

}(jQuery, (window || this)));
