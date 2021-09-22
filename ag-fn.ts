import {XE} from 'xtal-element/src/XE.js';
import {getArgsFromString} from 'xtal-element/lib/getDestructArgs.js';
import {destruct} from 'xtal-element/lib/destruct.js';
import {AgFnProps, AgFnActions} from './types';

export class AgFnCore extends HTMLElement implements AgFnActions{
    static _count = 0;
    getScript(self: this){
        const script = this.querySelector('script');
        if(script === null){
            setTimeout(() => {
                this.getScript(this);
            }, 10);
            return;
        }
        this.script = script;      
    }

    attachScript({script}: this){
        const args = getArgsFromString(script!.innerHTML);
        
        args.forEach(arg =>{
            if(arg !== 'self'){
                destruct(this, arg);
            }
        });
        const ig = 'fn = ';
        const inner = script!.innerHTML.trim().replace(ig, '');
        const count = AgFnCore._count++;
        const fn = `
    var af = customElements.get('${tagName}');
    af['fn_' + ${count}] = ${inner}
        `
        
        const headScript = document.createElement('script');
        headScript.type = 'module';
        headScript.innerHTML = fn;
        document.head!.appendChild(headScript);
        this.attachAggregator(this, count);
    }

    attachAggregator(self: this, count: number){
        const agfn = customElements.get('ag-fn') as any;
        const aggregator = agfn['fn_' + count];
        if(aggregator === undefined){
            setTimeout(() => {
                this.attachAggregator(this, count);
            }, 10);
            return;
        }
        
        this.aggregator = aggregator;    
    }

    updateValue({_input, disabled, hostSelector, aggregator}: this){
        if(_input === undefined ||  disabled) return;
        _input.self = this;
        let host;

        if(hostSelector!== undefined){
            host = this.closest(hostSelector);
        }else{
            host = (<any>this.getRootNode()).host;
        }
        if(host) _input.host = host;
        this.value = aggregator!(_input); 
    }
}

const tagName = 'ag-fn';

export interface AgFnCore extends AgFnProps{}

const ce = new XE<AgFnProps, AgFnActions>({
    config:{
        tagName,
        propDefaults:{
            isC: true,
            debug: false,

        },
        propInfo:{
            value:{
                notify:{
                    dispatch:true,
                }
            }
        },
        actions:{
            getScript:{
                ifAllOf:['isC']
            },
            attachScript:{
                ifAllOf:['script']
            },
            updateValue: {
                ifKeyIn: ['_input'],
                ifAllOf: ['aggregator', 'isC'],
                ifNoneOf: ['disabled']
            }
        }
    },
    superclass: AgFnCore
});

export const AgFn = ce.classDef!;

declare global {
    interface HTMLElementTagNameMap {
        'ag-fn': AgFnCore;
    }
}