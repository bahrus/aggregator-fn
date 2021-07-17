import {AgFn} from './ag-fn.js';
import {define} from 'xtal-element/lib/define.js';

/**
 * @element aggregator-fn
 * @tag aggregator-fn
 */
export class AggregatorFn extends AgFn{
    static is = 'aggregator-fn';
}

define(AggregatorFn);

declare global {
    interface HTMLElementTagNameMap {
        'aggregator-fn': AggregatorFn;
    }
}