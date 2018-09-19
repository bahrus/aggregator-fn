import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';
import {destruct, getScript} from 'xtal-latx/destruct.js';
import {attachScriptFn, getDynScript} from 'xtal-latx/attachScriptFn.js';

const input = 'input';
export class AggregatorFn extends XtallatX(HTMLElement){
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
        getDynScript(this, () =>{
            this.eval();
        })
    }
    _script!: HTMLScriptElement;
    eval(){
        const sInf = getScript(this._script);
        
        if(sInf === null) return;
        sInf.args.forEach(arg =>{
            destruct(this, arg);
        });
        const inner = this._script.innerHTML;
        const body = `
const __fn = ${inner};
`;
        attachScriptFn(AggregatorFn.is, this, 'aggregator', body);

    }

}
define(AggregatorFn);