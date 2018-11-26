//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var debounce = function debounce(fn, time) {
    var timeout;
    return function () {
      var _this = this,
          _arguments = arguments;

      var functionCall = function functionCall() {
        return fn.apply(_this, _arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  function getScript(srcScript, ignore) {
    var inner = srcScript.innerHTML.trim(); //const trEq = 'tr = ';

    if (inner.startsWith('(') || inner.startsWith(ignore)) {
      var ied = self['xtal_latx_ied']; //IE11

      if (ied !== undefined) {
        return ied(inner);
      } else {
        var iFatArrowPos = inner.indexOf('=>');
        var c2del = ['(', ')', '{', '}'];
        var lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
        c2del.forEach(function (t) {
          return lhs = lhs.replace(t, '');
        });
        var rhs = inner.substr(iFatArrowPos + 2);
        return {
          args: lhs.split(',').map(function (s) {
            return s.trim();
          }),
          body: rhs
        };
      }
    } else {
      return null;
    }
  }

  function destruct(target, prop) {
    var megaProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'input';
    var debouncers = target._debouncers;
    if (!debouncers) debouncers = target._debouncers = {};
    var debouncer = debouncers[megaProp];

    if (!debouncer) {
      debouncer = debouncers[megaProp] = debounce(function () {
        target[megaProp] = Object.assign({}, target[megaProp]);
      }, 10); //use task sceduler?
    }

    Object.defineProperty(target, prop, {
      get: function get() {
        return this['_' + prop];
      },
      set: function set(val) {
        this['_' + prop] = val;

        if (this[megaProp]) {
          this[megaProp][prop] = val;
          debouncer(); //this[megaProp] = Object.assign({}, this[megaProp]);
        } else {
          this[megaProp] = babelHelpers.defineProperty({}, prop, val);
        }
      },
      enumerable: true,
      configurable: true
    });
  }

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this2;

          babelHelpers.classCallCheck(this, _class);
          _this2 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this2._evCount = {};
          return _this2;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
              case disabled:
                this._disabled = newVal !== null;
                break;
            }
          }
          /**
           * Dispatch Custom Event
           * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
           * @param detail Information to be passed with the event
           * @param asIs If true, don't append event name with '-changed'
           */

        }, {
          key: "de",
          value: function de(name, detail, asIs) {
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this3 = this;

            props.forEach(function (prop) {
              if (_this3.hasOwnProperty(prop)) {
                var value = _this3[prop];
                delete _this3[prop];
                _this3[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  function attachScriptFn(tagName, target, prop, body, imports) {
    var constructor = customElements.get(tagName);
    var count = constructor._count++;
    var script = document.createElement('script');

    if (supportsStaticImport()) {
      script.type = 'module';
    }

    script.innerHTML = "\n".concat(imports, "\n(function () {\n").concat(body, "\nconst constructor = customElements.get('").concat(tagName, "');\nconstructor['fn_' + ").concat(count, "] = __fn;\n})();\n");
    document.head.appendChild(script);
    attachFn(constructor, count, target, prop);
  }

  function supportsStaticImport() {
    var script = document.createElement('script');
    return 'noModule' in script;
  }

  function attachFn(constructor, count, target, prop) {
    var Fn = constructor['fn_' + count];

    if (Fn === undefined) {
      setTimeout(function () {
        attachFn(constructor, count, target, prop);
      }, 10);
      return;
    }

    target[prop] = Fn;
  }

  function getDynScript(el, callBack) {
    el._script = el.querySelector('script');

    if (!el._script) {
      setTimeout(function () {
        getDynScript(el, callBack);
      }, 10);
      return;
    }

    callBack();
  }

  var input = 'input';

  var AggregatorFn =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(AggregatorFn, _XtallatX);

    function AggregatorFn() {
      var _this4;

      babelHelpers.classCallCheck(this, AggregatorFn);
      _this4 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(AggregatorFn).apply(this, arguments));
      _this4._aggregator = null;
      return _this4;
    }

    babelHelpers.createClass(AggregatorFn, [{
      key: "aggregate",
      value: function aggregate() {
        if (this._input === undefined || this._aggregator === undefined || this._aggregator === null || this._disabled) return;
        this._input.__this = this;
        this.value = this._aggregator(this._input);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
          case input:
            this.input = JSON.parse(newVal);
            break;
        }

        babelHelpers.get(babelHelpers.getPrototypeOf(AggregatorFn.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
        this.aggregate();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'none';

        this._upgradeProperties(['disabled', input]);

        this.getS();
      }
    }, {
      key: "getS",
      value: function getS() {
        var _this5 = this;

        this._script = this.querySelector('script');

        if (!this._script) {
          setTimeout(function () {
            _this5.getS();
          }, 10);
          return;
        }

        this.eval();
      }
    }, {
      key: "eval",
      value: function _eval() {
        var _this6 = this;

        var ig = 'fn = ';
        var sInf = getScript(this._script, ig);
        if (sInf === null) return;
        sInf.args.forEach(function (arg) {
          if (arg !== '__this') destruct(_this6, arg);
        });

        var inner = this._script.innerHTML.trim().replace(ig, '');

        var count = AggregatorFn._count++;
        var fn = "\nvar af = customElements.get('".concat(AggregatorFn.is, "');\naf['fn_' + ").concat(count, "] = ").concat(inner, "\n        ");
        var script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = fn;
        document.head.appendChild(script);
        this.attachAggregator(count);
      }
    }, {
      key: "attachAggregator",
      value: function attachAggregator(count) {
        var _this7 = this;

        var aggregator = AggregatorFn['fn_' + count];

        if (aggregator === undefined) {
          setTimeout(function () {
            _this7.attachAggregator(count);
          }, 10);
          return;
        }

        this.aggregator = aggregator;
      }
    }, {
      key: "input",
      get: function get() {
        return this._input;
      },
      set: function set(val) {
        this._input = val;
        this.aggregate();
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(val) {
        this._value = val;
        this.de('value', {
          value: val
        });
      }
    }, {
      key: "aggregator",
      get: function get() {
        return this._aggregator;
      },
      set: function set(val) {
        this._aggregator = val;
        this.aggregate();
      }
    }], [{
      key: "is",
      get: function get() {
        return 'aggregator-fn';
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(AggregatorFn), "observedAttributes", this).concat([input]);
      }
    }]);
    return AggregatorFn;
  }(XtallatX(HTMLElement));

  AggregatorFn._count = 0;
  define(AggregatorFn);
})();