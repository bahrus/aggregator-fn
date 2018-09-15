import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { define } from 'xtal-latx/define.js';
import { destruct, getScript } from 'xtal-latx/destruct.js';
const input = 'input';
export class AggregatorFn extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._aggregator = null;
    }
    static get is() { return 'aggregator-fn'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([input]);
    }
    get input() {
        return this._input;
        this.aggregate();
    }
    set input(val) {
        this._input = val;
        this.aggregate();
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
        this.de('value', {
            value: val
        });
    }
    get aggregator() {
        return this._aggregator;
    }
    set aggregator(val) {
        this._aggregator = val;
        this.aggregate();
    }
    aggregate() {
        if (this._input === undefined || this._aggregator === undefined || this._aggregator === null)
            return;
        this.value = this._aggregator(this._input);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case input:
                this.input = JSON.parse(newVal);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(['disabled', input]);
        this.getS();
    }
    getS() {
        this._script = this.querySelector('script');
        if (!this._script) {
            setTimeout(() => {
                this.getS();
            }, 10);
            return;
        }
        this.eval();
    }
    eval() {
        const sInf = getScript(this._script);
        if (sInf === null)
            return;
        sInf.args.forEach(arg => {
            destruct(this, arg);
        });
        const temp = eval(`({
            fn: function(){
                ${this._script.innerHTML}
            }
        })
        `);
        this.aggregator = temp.fn();
    }
}
define(AggregatorFn);
//# sourceMappingURL=aggregator-fn.js.map