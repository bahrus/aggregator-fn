
    (function () {
    function define(custEl: any){
    let tagName = custEl.is;
    if(customElements.get(tagName)){
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const debounce = (fn: (args: any) => void, time: number) => {
    let timeout: any;
    return function (this: Function) {
        const functionCall = () => fn.apply(this, <any>arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}
interface IScriptInfo{
    args: string[],
    body: string,
}
function  getScript(srcScript: HTMLScriptElement, ignore: string) : IScriptInfo | null{
    const inner = srcScript.innerHTML.trim();
    //const trEq = 'tr = ';
    if(inner.startsWith('(') || inner.startsWith(ignore)){
        const ied = (<any>self)['xtal_latx_ied']; //IE11
        if(ied !== undefined){ 
            return ied(inner);
        }else{
            const iFatArrowPos = inner.indexOf('=>');
            const c2del = ['(', ')', '{', '}'];
            let lhs = inner.substr(0, iFatArrowPos).replace(ignore, '').trim();
            c2del.forEach(t => lhs = lhs.replace(t, ''));
            const rhs = inner.substr(iFatArrowPos + 2);
            return {
                args: lhs.split(',').map(s => s.trim()),
                body: rhs,
            }
        }
        
    }else{
        return null;
    }
    
}

function destruct(target: any, prop: string, megaProp: string = 'input'){
    let debouncers = (<any>target)._debouncers;
    if(!debouncers) debouncers =  (<any>target)._debouncers = {};
    let debouncer = debouncers[megaProp];
    if(!debouncer){
        debouncer = debouncers[megaProp] = debounce((t) => {
            (<any>t)[megaProp] = Object.assign({}, (<any>t)[megaProp]);
        }, 10);  //use task sceduler?
    }
    Object.defineProperty(target, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (val) {
            this['_' + prop] = val;
            if(this[megaProp]) {
                this[megaProp][prop] = val;
                debouncer(this);
                //this[megaProp] = Object.assign({}, this[megaProp]);
            }else{
                this[megaProp] = {[prop]: val}; 
            }
        },
        enumerable: true,
        configurable: true,
    });
}
const disabled = 'disabled';

interface IXtallatXI extends HTMLElement {
    /**
     * Any component that emits events should not do so if it is disabled.
     * Note that this is not enforced, but the disabled property is made available.
     * Users of this mix-in should ensure not to call "de" if this property is set to true.
    */
    disabled: boolean;
    /**
     * Set attribute value.
     * @param name 
     * @param val 
     * @param trueVal String to set attribute if true.
     */
    attr(name: string, val: string | boolean, trueVal?: string): void;
    /**
     * Dispatch Custom Event
     * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
     * @param detail Information to be passed with the event
     * @param asIs If true, don't append event name with '-changed'
     */
    de(name: string, detail: any, asIs?: boolean): CustomEvent;
    /**
     * Needed for asynchronous loading
     * @param props Array of property names to "upgrade", without losing value set while element was Unknown
     */
    _upgradeProperties(props: string[]): void;
    attributeChangedCallback(name: string, oldVal: string, newVal: string): void;
    connectedCallback?(): void;
    // static observedAttributes: string[]; 
}
type Constructor<T = {}> = new (...args: any[]) => T;
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX<TBase extends Constructor<HTMLElement>>(superClass: TBase) {
    return class extends superClass implements IXtallatXI {
        static get observedAttributes() {
            return [disabled];
        }

        _disabled!: boolean;
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
        attr(name: string, val: string | boolean | null, trueVal?: string) {
            const v = val ? 'set' : 'remove';  //verb
            (<any>this)[v + 'Attribute'](name, trueVal || val);
        }
        _evCount: { [key: string]: number } = {};
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n 
         */
        to$(n: number) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name: string) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            } else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name: string, oldVal: string, newVal: string) {
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
        de(name: string, detail: any, asIs: boolean = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }

        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props: string[]) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = (<any>this)[prop];
                    delete (<any>this)[prop];
                    (<any>this)[prop] = value;
                }
            })

        }
    }
}
function attachScriptFn(tagName: string, target: any, prop: string, body: string, imports:string){
    const constructor = customElements.get(tagName);
    const count = constructor._count++;
    const script = document.createElement('script');
    
    if(supportsStaticImport()) {
        script.type = 'module';
    }
    script.innerHTML = `
${imports}
(function () {
${body}
constructor['fn_' + ${count}] = __fn;
})();
`;
    document.head!.appendChild(script);
    attachFn(constructor, count, target, prop);
}

function supportsStaticImport() {
    const script = document.createElement('script');
    return 'noModule' in script; 
  }

function attachFn(constructor: any, count: number, target: any, prop: string){
    const Fn = constructor['fn_' + count];
    if(Fn === undefined){
        setTimeout(() => {
            attachFn(constructor, count, target, prop);
        }, 10);
        return;
    }
    target[prop] = Fn;
}
function getDynScript(el: HTMLElement, callBack: any){
    (<any>el)._script = el.querySelector('script') as HTMLScriptElement;
    if(!(<any>el)._script){
        setTimeout(() => {
            getDynScript(el, callBack)
        }, 10);
        return;
    }
    callBack();
} 

const input = 'input';
class AggregatorFn extends XtallatX(HTMLElement){
    static get is() { return 'aggregator-fn';}
    static get observedAttributes() {
        return super.observedAttributes.concat([input]);
    }
    static _count = 0;
    _input: any | null;
    get input(){
        return this._input;
    }
    set input(val){
        this._input = val;
        this.aggregate();
    }
    _value: any | null;
    get value(){
        return this._value;
    }
    set value(val){
        this._value = val;
        this.de('value', {
            value: val
        })
    }
    _aggregator: ((input: any) => any) | null = null;
    get aggregator(){
        return this._aggregator;
    }
    set aggregator(val){
        this._aggregator = val;
        this.aggregate();
    }
    aggregate(){
        if(this._input === undefined || this._aggregator === undefined || this._aggregator === null || this._disabled) return;
        this._input.__this = this; 
        this.value = this._aggregator(this._input); 
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch(name){
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
    _script!: HTMLScriptElement;
    getS(){
        this._script = this.querySelector('script') as HTMLScriptElement;
        if(!this._script){
            setTimeout(() => {
                this.getS();
            }, 10);
            return;
        }
        this.eval();
    }
    eval(){
        const ig = 'fn = ';
        const sInf = getScript(this._script, ig);
        
        if(sInf === null) return;
        sInf.args.forEach(arg =>{
            if(arg !== '__this') destruct(this, arg);
        });
        const inner = this._script.innerHTML.trim().replace(ig, '');
        const count = AggregatorFn._count++;
        const fn = `
var af = customElements.get('${AggregatorFn.is}');
af['fn_' + ${count}] = ${inner}
        `
        
        const script = document.createElement('script');
        script.type = 'module';
        script.innerHTML = fn;
        document.head!.appendChild(script);
        this.attachAggregator(count);
    }
    attachAggregator(count: number){
        const aggregator = (<any>AggregatorFn)['fn_' + count];
        if(aggregator === undefined){
            setTimeout(() => {
                this.attachAggregator(count);
            }, 10);
            return;
        }
        this.aggregator = aggregator;
    }
}
define(AggregatorFn);
    })();  
        