import { XE } from 'xtal-element/src/XE.js';
import { getArgsFromString } from 'xtal-element/lib/getDestructArgs.js';
import { destruct } from 'xtal-element/lib/destruct.js';
/**
 * @tag 'ag-fn'
 * @element 'ag-fn'
 */
export class AgFnCore extends HTMLElement {
    static _count = 0;
    getScript(self) {
        const script = this.querySelector('script');
        if (script === null) {
            setTimeout(() => {
                this.getScript(this);
            }, 10);
            return;
        }
        this.script = script;
    }
    attachScript({ script }) {
        const args = getArgsFromString(script.innerHTML);
        args.forEach(arg => {
            if (arg !== 'self') {
                destruct(this, arg);
            }
        });
        const ig = 'fn = ';
        const inner = script.innerHTML.trim().replace(ig, '');
        const count = AgFnCore._count++;
        const fn = `
    var af = customElements.get('${tagName}');
    af['fn_' + ${count}] = ${inner}
        `;
        const headScript = document.createElement('script');
        headScript.type = 'module';
        headScript.innerHTML = fn;
        document.head.appendChild(headScript);
        this.attachAggregator(this, count);
    }
    attachAggregator(self, count) {
        const agfn = customElements.get('ag-fn');
        const aggregator = agfn['fn_' + count];
        if (aggregator === undefined) {
            setTimeout(() => {
                this.attachAggregator(this, count);
            }, 10);
            return;
        }
        this.aggregator = aggregator;
    }
    updateValue({ _input, disabled, hostSelector, aggregator }) {
        if (_input === undefined || disabled)
            return;
        _input.self = this;
        let host;
        if (hostSelector !== undefined) {
            host = this.closest(hostSelector);
        }
        else {
            host = this.getRootNode().host;
        }
        if (host)
            _input.host = host;
        this.value = aggregator(_input);
    }
}
const tagName = 'ag-fn';
const ce = new XE({
    config: {
        tagName,
        propDefaults: {
            isC: true,
            debug: false,
        },
        propInfo: {
            value: {
                notify: {
                    dispatch: true,
                }
            }
        },
        actions: {
            getScript: {
                ifAllOf: ['isC']
            },
            attachScript: {
                ifAllOf: ['script']
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
export const AgFn = ce.classDef;
