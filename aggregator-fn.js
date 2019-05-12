import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
import { destruct, getScript } from 'xtal-element/destruct.js';
const input = 'input';
export class AggregatorFn extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._aggregator = null;
    }
    static get is() { return 'aggregator-fn'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([input]);
    }
    get _input() {
        return this.__input;
    }
    set _input(val) {
        this.__input = val;
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
        if (this.__input === undefined || this._aggregator === undefined || this._aggregator === null || this._disabled)
            return;
        this.__input.__this = this;
        this.value = this._aggregator(this.__input);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case input:
                this._input = JSON.parse(newVal);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.aggregate();
    }
    connectedCallback() {
        this.style.display = 'none';
        this.propUp(['disabled', input]);
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
        const ig = 'fn = ';
        const sInf = getScript(this._script, ig);
        if (sInf === null)
            return;
        sInf.args.forEach(arg => {
            if (arg !== '__this')
                destruct(this, arg);
        });
        const inner = this._script.innerHTML.trim().replace(ig, '');
        const count = AggregatorFn._count++;
        const fn = `
var af = customElements.get('${AggregatorFn.is}');
af['fn_' + ${count}] = ${inner}
        `;
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = fn;
        document.head.appendChild(script);
        this.attachAggregator(count);
    }
    attachAggregator(count) {
        const aggregator = AggregatorFn['fn_' + count];
        if (aggregator === undefined) {
            setTimeout(() => {
                this.attachAggregator(count);
            }, 10);
            return;
        }
        this.aggregator = aggregator;
    }
}
AggregatorFn._count = 0;
define(AggregatorFn);
