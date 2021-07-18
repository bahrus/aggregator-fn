import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor} from 'xtal-element/lib/XtalCore.js';
import {getArgsFromString} from 'xtal-element/lib/getDestructArgs.js';
import {destruct} from 'xtal-element/lib/destruct.js';
import {passAttrToProp} from 'xtal-element/lib/passAttrToProp.js';
import {AgFnProps} from './types.d.js';
/**
 * @element ag-fn
 * @tag ag-fn
 */
export class AgFn extends HTMLElement implements ReactiveSurface{
    static is = 'ag-fn';
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        passAttrToProp(this, slicedPropDefs,n,ov, nv);
    }
    /**
     * @private
     */
    static _count = 0;
    
    /**
     * @private
     */
    self = this;

    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);

    onPropChange(n: string, prop: PropDef, newVal: any){
        this.reactor.addToQueue(prop, newVal);
    }

    connectedCallback(){
        this.style.display = 'none';
        getScript(this);
        this.isC = true;
    }
}
export interface AgFn extends AgFnProps{}
type A = AgFn;

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

const attachScript = ({script, isC, self}: A) => {
    const args = getArgsFromString(script!.innerHTML);
    
    args.forEach(arg =>{
        if(arg !== 'self'){
            destruct(self, arg);
        }
    });
    const ig = 'fn = ';
    const inner = script!.innerHTML.trim().replace(ig, '');
    const count = AgFn._count++;
    const fn = `
var af = customElements.get('${AgFn.is}');
af['fn_' + ${count}] = ${inner}
    `
    
    const headScript = document.createElement('script');
    headScript.type = 'module';
    headScript.innerHTML = fn;
    document.head!.appendChild(headScript);
    attachAggregator(self, count);
}

function attachAggregator(self: A, count: number){
    const aggregator = (<any>AgFn)['fn_' + count];
    if(aggregator === undefined){
        setTimeout(() => {
            attachAggregator(self, count);
        }, 10);
        return;
    }
    self.aggregator = aggregator;    
}

const linkValue = ({_input, aggregator, disabled, isC, self}: A) => {
    if(_input === undefined ||  disabled) return;
    _input.self = self;
    //(<any>self)[slicedPropDefs.propLookup!.value!.alias!] = aggregator!(_input); 
    const val = aggregator!(_input);
    console.log(val);
    self.value = val;
    console.log(val);
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
const boolProp1: PropDef = {
    ...baseProp,
    type: Boolean,
};
const boolProp2: PropDef = {
    ...boolProp1,
    stopReactionsIfFalsy: true,
}
const propDefMap : PropDefMap<AgFn> = {
    _input: objProp1,
    aggregator: objProp2,
    disabled: boolProp1,
    debug: boolProp1,
    isC: boolProp2,
    value: {
        ...objProp1,
        notify: true,
    },
    script: {
        ...objProp1,
        stopReactionsIfFalsy: true,
        //transience: 0
    },
}
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(AgFn, slicedPropDefs, 'onPropChange');

xc.define(AgFn);

declare global {
    interface HTMLElementTagNameMap {
        'ag-fn': AgFn;
    }
}