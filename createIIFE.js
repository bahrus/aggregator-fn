const tiife = require('jiife/tiffe');
const jiife = require('jiife');
const xl = 'node_modules/xtal-element/'
const base = [xl + 'define.ts', xl + 'debounce.ts', xl + 'destruct.ts', xl + 'xtal-latx.ts', xl + 'attachScriptFn.ts'];
const aggregatorFn = base.concat('aggregator-fn.ts');
tiife.processFiles(aggregatorFn, 'dist/iife.ts');
jiife.processFiles(['aggregator-fn.ts'], 'dist/aggregator-fn.js', true);