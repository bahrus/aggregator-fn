
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};
function getScript(srcScript) {
    const inner = srcScript.innerHTML.trim();
    if (inner.startsWith('(')) {
        const ied = self['xtal_latx_ied']; //IE11
        if (ied !== undefined) {
            return ied(inner);
        }
        else {
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos);
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            };
        }
    }
    else {
        return null;
    }
}
function destruct(target, prop, megaProp = 'input') {
    let debouncers = target._debouncers;
    if (!debouncers)
        debouncers = target._debouncers = {};
    let debouncer = debouncers[megaProp];
    if (!debouncer) {
        debouncer = debouncers[megaProp] = debounce(() => {
            target[megaProp] = Object.assign({}, target[megaProp]);
        }, 10);
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (val) {
            this['_' + prop] = val;
            if (this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer();
                //this[megaProp] = Object.assign({}, this[megaProp]);
            }
            else {
                this[megaProp] = { [prop]: val };
            }
        },
        enumerable: true,
        configurable: true,
    });
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
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
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
const input = 'input';
class AggregatorFn extends XtallatX(HTMLElement) {
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
        if (this._input === undefined || this._aggregator === undefined || this._aggregator === null || this._disabled)
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
        this.aggregate();
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
        const inner = this._script.innerHTML;
        //const count = AggregatorFn._count++;
        console.log(inner);
        const body = `
const __fn = ${inner};
`;
        attachScriptFn(AggregatorFn.is, this, 'aggregator', body);
    }
}
AggregatorFn._count = 0;
define(AggregatorFn);
    })();  
        