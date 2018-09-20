const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/'
const base = [xl + 'define.js', xl + 'debounce.js', xl + 'destruct.js', xl + 'xtal-latx.js', xl + 'attachScriptFn.js'];
const aggregatorFn = base.concat('aggregator-fn.js');
jiife.processFiles(aggregatorFn, 'aggregator-fn.iife.js');