import {XtallatX, define} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js'
import {destruct, getScript} from 'xtal-element/destruct.js';
import {AttributeProps} from 'xtal-element/types.d.js';

export class AggregatorFn extends XtallatX(hydrate(HTMLElement)){
    static is = 'aggregator-fn';
    static attributeProps = ({disabled, _input, aggregator} : AggregatorFn) => ({
        bool: [disabled],
        str: [name],
        obj: [_input, aggregator]
    }  as AttributeProps);
    static _count = 0;
    onPropsChange(name: string){
        switch(name){
            case '_input':
            case 'aggregator':
                this.aggregate();
                break;
        }
        super.onPropsChange(name);
    }
    _input: any | null;

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
    aggregator : ((input: any) => any) | null = null;
    aggregate(){
        if(this._input === undefined || this.aggregator === undefined || this.aggregator === null || this.disabled) return;
        this._input.self = this; 
        this.value = this.aggregator(this._input); 
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

    connectedCallback() {
        this.style.display = 'none';
        super.connectedCallback();
        this.getS();
    }
}
define(AggregatorFn);