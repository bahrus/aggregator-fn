[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/aggregator-fn)

<a href="https://nodei.co/npm/aggregator-fn/"><img src="https://nodei.co/npm/aggregator-fn.png"></a>

[![Actions Status](https://github.com/bahrus/aggregator-fn/workflows/CI/badge.svg)](https://github.com/bahrus/aggregator-fn/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/aggregator-fn">

# aggregator-fn

NB:  aggregator-fn shares quite a bit of code with [litter-g](https://www.webcomponents.org/element/litter-g), as they both tackle similar problems.  It would be natural to use the two together (without much additional overhead.)

\<aggregator-fn\> is a non-visual custom element that aggregates properties together using an inline JS expression.

This component is designed to provide an alternative to Polymer's template string interpolation.  It is most useful for markup-centric applications, consisting of web components that are not controlled by some state managed component container -- for example a ["peer-to-peer" binding framework](https://github.com/bahrus/p-et-alia).

The initial motivator for this component is being able to build url's from a form consisting of input elements -- declaratively.

## Syntax:

```html
<aggregator-fn><script nomodule>
    ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
</script></aggregator-fn>
```

does the following:

1)  Dynamically attaches properties to the aggregator-fn element for each of the function arguments -- "operation" and "expression" in this case.
2)  Any time any of the property values change, the aggregator function is evaluated (allowing for some debouncing), and the result is stored in the element's value property.  An event, "value-changed" is fired every time the value changes.

aggregator-fn doesn't make much sense standing on its own.  Let's see how we can use it in the markup below, to handle sending a request to the [Newton Api Advanced Math microservice](https://newton.now.sh/).

```html
    <div>
        <label for=operation>Operation:</label>
        <input name=operation value=integrate>
        <p-d on=input to=[-operation] m=1></p-d>
        <label for=expression>Expression:</label>
        <input name=expression value="x^2">
        <p-d on="input" to=[-expression] m=1></p-d>
        <aggregator-fn -operation -expression><script nomodule>
            ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
        </script></aggregator-fn>
        <p-d on=value-changed to=[-href] m=1></p-d>
        <xtal-fetch fetch -href></xtal-fetch>
        <p-d on=fetch-complete to=[-data] m=1></p-d>
        <json-viewer -data></json-viewer>
        
    </div>
```

## [Demo](https://jsfiddle.net/bahrus/Ln1cqdgb/)

<!--
```
<custom-element-demo>
  <template>
    <div>
        <label for=operation>Operation:</label>
        <input id=operation value=integrate>
        <p-d on=input to=[-operation] m=1></p-d>
        <label for=expression>Expression:</label>
        <input id=expression value="x^2">
        <p-d on=input to=[-expression] m=1></p-d>
        <aggregator-fn -operation -expression><script nomodule>
            ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
        </script></aggregator-fn>
        <p-d on=value-changed to=[-href] m=1></p-d>
        <xtal-fetch-get fetch -href></xtal-fetch-get>
        <p-d on=result-changed to=[-data] m=1></p-d>
        <json-viewer -data></json-viewer>
        <script type=module src=https://unpkg.com/@alenaksu/json-viewer@0.1.0/build/index.js?module></script>
        <script type=module src=https://unpkg.com/aggregator-fn@0.0.18/aggregator-fn.js?module></script>
        <script type=module src=https://unpkg.com/p-et-alia@0.0.72/p-d.js?module></script>
        <script type=module src=https://unpkg.com/xtal-fetch@0.0.76/xtal-fetch-get.js?module></script>
    </div>
    </template>
</custom-element-demo>
```
-->

## [Post IE/11 Support](https://docs.microsoft.com/en-us/deployedge/edge-ie-mode)

## Accessing the custom element itself

In some (rare?) circumstances, you may need the aggregator function to have access to the context from which it is being called.  To do this, add an argument, self:

```html
<aggregator-fn>
    <script nomodule>
        ({a, b, c, self}) => {
            console.log(self;
            return a + b + c;
        }
    </script>
</aggregator-fn>
```

## Viewing Your Element

```
$ npm run serve
```

## Running Tests

```
$ npm run test
```
