import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';
import {destruct, getScript} from 'xtal-latx/destruct.js';

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
        const sInf = getScript(this._script);
        
        if(sInf === null) return;
        sInf.args.forEach(arg =>{
            destruct(this, arg);
        });
        const inner = this._script.innerHTML;
        console.log(inner);
        const temp = eval(`({
            fn: function(){return ${inner}}
        })
        `);
        this.aggregator = temp.fn();
    }
}
define(AggregatorFn);