import { xc } from 'xtal-element/lib/XtalCore.js';
import { getArgsFromString } from 'xtal-element/lib/getDestructArgs.js';
import { destruct } from 'xtal-element/lib/destruct.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
 * @element ag-fn
 * @tag ag-fn
 */
export class AgFn extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    attributeChangedCallback(n, ov, nv) {
        passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    connectedCallback() {
        this.style.display = 'none';
        getScript(this);
    }
}
AgFn.is = 'ag-fn';
AgFn.observedAttributes = ['disabled'];
AgFn._count = 0;
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
const attachScript = ({ script, self }) => {
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
const linkValue = ({ _input, aggregator, disabled, self }) => {
    if (_input === undefined || disabled)
        return;
    self[slicedPropDefs.propLookup.value.alias] = aggregator(_input);
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
const propDefMap = {
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
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(AgFn, slicedPropDefs, 'onPropChange');
xc.define(AgFn);
