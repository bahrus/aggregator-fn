import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { define } from "./node_modules/xtal-latx/define.js";
import { destruct, getScript } from "./node_modules/xtal-latx/destruct.js";
import { attachScriptFn } from "./node_modules/xtal-latx/attachScriptFn.js";
var input = 'input';
export var AggregatorFn =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(AggregatorFn, _XtallatX);

  function AggregatorFn() {
    var _this;

    babelHelpers.classCallCheck(this, AggregatorFn);
    _this = babelHelpers.possibleConstructorReturn(this, (AggregatorFn.__proto__ || Object.getPrototypeOf(AggregatorFn)).apply(this, arguments));
    _this._aggregator = null;
    return _this;
  }

  babelHelpers.createClass(AggregatorFn, [{
    key: "aggregate",
    value: function aggregate() {
      if (this._input === undefined || this._aggregator === undefined || this._aggregator === null || this._disabled) return;
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

      babelHelpers.get(AggregatorFn.prototype.__proto__ || Object.getPrototypeOf(AggregatorFn.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
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

      var sInf = getScript(this._script);
      if (sInf === null) return;
      sInf.args.forEach(function (arg) {
        destruct(_this3, arg);
      });
      var inner = this._script.innerHTML; //const count = AggregatorFn._count++;

      console.log(inner);
      var body = "\nconst __fn = ".concat(inner, ";\n");
      attachScriptFn(AggregatorFn.is, this, 'aggregator', body);
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
      return babelHelpers.get(AggregatorFn.__proto__ || Object.getPrototypeOf(AggregatorFn), "observedAttributes", this).concat([input]);
    }
  }]);
  return AggregatorFn;
}(XtallatX(HTMLElement));
AggregatorFn._count = 0;
define(AggregatorFn); //# sourceMappingURL=aggregator-fn.js.map