import { xc } from 'xtal-element/lib/XtalCore.js';
import { getArgsFromString } from 'xtal-element/lib/getDestructArgs.js';
import { destruct } from 'xtal-element/lib/destruct.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
 * @element ag-fn
 * @tag ag-fn
 */
export class AgFn extends HTMLElement {
    static is = 'ag-fn';
    static observedAttributes = ['disabled'];
    attributeChangedCallback(n, ov, nv) {
        passAttrToProp(this, slicedPropDefs, n, ov, nv);
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
    reactor = new xc.Rx(this);
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    connectedCallback() {
        this.style.display = 'none';
        getScript(this);
        this.isC = true;
    }
}
function getScript(self) {
    const script = self.querySelector('script');
    if (script === null) {
        setTimeout(() => {
            getScript(self);
        }, 10);
        return;
    }
    self.script = script;
}
const attachScript = ({ script, isC, self }) => {
    const args = getArgsFromString(script.innerHTML);
    args.forEach(arg => {
        if (arg !== 'self') {
            destruct(self, arg);
        }
    });
    const ig = 'fn = ';
    const inner = script.innerHTML.trim().replace(ig, '');
    const count = AgFn._count++;
    const fn = `
var af = customElements.get('${AgFn.is}');
af['fn_' + ${count}] = ${inner}
    `;
    const headScript = document.createElement('script');
    headScript.type = 'module';
    headScript.innerHTML = fn;
    document.head.appendChild(headScript);
    attachAggregator(self, count);
};
function attachAggregator(self, count) {
    const aggregator = AgFn['fn_' + count];
    if (aggregator === undefined) {
        setTimeout(() => {
            attachAggregator(self, count);
        }, 10);
        return;
    }
    self.aggregator = aggregator;
}
const linkValue = ({ _input, aggregator, disabled, isC, self }) => {
    if (_input === undefined || disabled)
        return;
    _input.self = self;
    //(<any>self)[slicedPropDefs.propLookup!.value!.alias!] = aggregator!(_input); 
    self.value = aggregator(_input);
};
const propActions = [
    attachScript, linkValue
];
const baseProp = {
    async: true,
    dry: true,
};
const objProp1 = {
    ...baseProp,
    type: Object,
};
const objProp2 = {
    ...objProp1,
    stopReactionsIfFalsy: true,
};
const boolProp1 = {
    ...baseProp,
    type: Boolean,
};
const boolProp2 = {
    ...boolProp1,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
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
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(AgFn, slicedPropDefs, 'onPropChange');
xc.define(AgFn);
