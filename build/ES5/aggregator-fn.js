import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { define } from "./node_modules/xtal-latx/define.js";
import { destruct, getScript } from "./node_modules/xtal-latx/destruct.js";
var input = 'input';
export var AggregatorFn =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(AggregatorFn, _XtallatX);

  function AggregatorFn() {
    var _this;

    babelHelpers.classCallCheck(this, AggregatorFn);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(AggregatorFn).apply(this, arguments));
    _this._aggregator = null;
    return _this;
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
      var _this2 = this;

      this._script = this.querySelector('script');

      if (!this._script) {
        setTimeout(function () {
          _this2.getS();
        }, 10);
        return;
      }

      this.eval();
    }
  }, {
    key: "eval",
    value: function _eval() {
      var _this3 = this;

      var ig = 'fn = ';
      var sInf = getScript(this._script, ig);
      if (sInf === null) return;
      sInf.args.forEach(function (arg) {
        if (arg !== '__this') destruct(_this3, arg);
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
      var _this4 = this;

      var aggregator = AggregatorFn['fn_' + count];

      if (aggregator === undefined) {
        setTimeout(function () {
          _this4.attachAggregator(count);
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
define(AggregatorFn); //# sourceMappingURL=aggregator-fn.js.map