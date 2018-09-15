import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';
import {destruct, getScript} from 'xtal-latx/destruct.js';
import {debounce} from 'xtal-latx/debounce.js'

const input = 'input';
export class AggregatorFn extends XtallatX(HTMLElement){
    static get is() { return 'aggregator-fn';}
    static get observedAttributes() {
        return super.observedAttributes.concat([input]);
    }
    _input: any | null;
    get input(){
        return this._input;
    }
    set input(val){
        this._input = val;
        //this.aggregate();
        this._debouncer();
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
        //this.aggregate();
        this._debouncer();
        
    }
    aggregate(){
        if(this._input === undefined || this._aggregator === undefined || this._aggregator === null) return;
        this.value = this._aggregator(this._input); 
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch(name){
            case input:
                this.input = JSON.parse(newVal);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    _debouncer: any;
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(['disabled', input]);
        this._debouncer = debounce((stateUpdate) => {
            this.aggregate();
        }, 50);
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
        const sInf = getScript(this._script);
        if(sInf === null) return;
        sInf.args.forEach(arg =>{
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