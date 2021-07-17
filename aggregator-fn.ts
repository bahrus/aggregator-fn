import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor} from 'xtal-element/lib/XtalCore.js';
import {getArgsFromString} from 'xtal-element/lib/getDestructArgs.js';
import {destruct} from 'xtal-element/lib/destruct.js';
import {passAttrToProp} from 'xtal-element/lib/passAttrToProp.js';

/**
 * @element aggregator-fn
 */
export class AggregatorFn extends HTMLElement implements ReactiveSurface{
    static is = 'aggregator-fn';
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        passAttrToProp(this, slicedPropDefs,n,ov, nv);
    }
    static _count = 0;
    _input: any;
    disabled: boolean | undefined;
    value: any;
    script: HTMLScriptElement | undefined;
    aggregator: ((input: any) => any) | undefined;

    self = this;
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);

    onPropChange(n: string, prop: PropDef, newVal: any){
        this.reactor.addToQueue(prop, newVal);
    }

    connectedCallback(){
        this.style.display = 'none';
        getScript(this);
    }
}
type A = AggregatorFn;

function getScript(self: A){
    const script = self.querySelector('script');
    if(script === null){
        setTimeout(() => {
            getScript(self);
        }, 10);
        return;
    }
    self.script = script;
}

const attachScript = ({script, self}: A) => {
    const args = getArgsFromString(script!.innerHTML);
    
    args.forEach(arg =>{
        if(arg !== 'self'){
            destruct(self, arg);
        }
    });
    const ig = 'fn = ';
    const inner = script!.innerHTML.trim().replace(ig, '');
    const count = AggregatorFn._count++;
    const fn = `
var af = customElements.get('${AggregatorFn.is}');
af['fn_' + ${count}] = ${inner}
    `
    
    const headScript = document.createElement('script');
    headScript.type = 'module';
    headScript.innerHTML = fn;
    document.head!.appendChild(headScript);
    attachAggregator(self, count);
}

function attachAggregator(self: A, count: number){
    const aggregator = (<any>AggregatorFn)['fn_' + count];
    if(aggregator === undefined){
        setTimeout(() => {
            attachAggregator(self, count);
        }, 10);
        return;
    }
    self.aggregator = aggregator;    
}

const linkValue = ({_input, aggregator, disabled, self}: A) => {
    if(_input === undefined ||  disabled) return;
    (<any>self)[slicedPropDefs.propLookup!.value!.alias!] = aggregator!(_input); 
}

const propActions = [
    attachScript, linkValue
] as PropAction[];

const baseProp: PropDef = {
    async: true,
    dry: true,
};
const objProp1 : PropDef = {
    ...baseProp,
    type: Object,
}
const objProp2: PropDef = {
    ...objProp1,
    stopReactionsIfFalsy: true,
}
const propDefMap : PropDefMap<AggregatorFn> = {
    _input: objProp1,
    aggregator: objProp2,
    disabled: {
        ...baseProp,
        type: Boolean,
    },
    value: {
        ...objProp1,
        obfuscate: true,
        notify: true,
    },
    script: {
        ...objProp1,
        stopReactionsIfFalsy: true,
        //transience: 0
    },
}
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(AggregatorFn, slicedPropDefs, 'onPropChange');

xc.define(AggregatorFn);