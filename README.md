[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/aggregator-fn)

<a href="https://nodei.co/npm/aggregator-fn/"><img src="https://nodei.co/npm/aggregator-fn.png"></a>

[![Actions Status](https://github.com/bahrus/aggregator-fn/workflows/CI/badge.svg)](https://github.com/bahrus/aggregator-fn/actions?query=workflow%3ACI)

<img src="https://badgen.net/bundlephobia/minzip/aggregator-fn">

# aggregator-fn

\<aggregator-fn\> (or \<ag-fn\> for short) is a non-visual custom element that aggregates properties together using an inline JS expression, and which can act as a "piping" processor between two or more elements.

It is most useful for markup-centric applications, consisting of web components that are not controlled by some state managed component container -- for example a ["peer-to-peer" binding framework](https://github.com/bahrus/p-et-alia).

The initial motivator for this component is being able to build url's from a form consisting of input elements -- declaratively.

See [form-matter](https://github.com/bahrus/form-matter) for an alternative.

## Syntax:

```html
<aggregator-fn><script nomodule>
    ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
</script></aggregator-fn>
```

or

```html
<ag-fn><script nomodule>
    ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
</script></ag-fn>
```

does the following:

1)  Dynamically attaches properties to the aggregator-fn element for each of the function arguments -- "operation" and "expression" in this case.
2)  Any time any of the property values change, the aggregator function is evaluated (allowing for some debouncing), and the result is stored in the element's value property.  An event, "value-changed" is fired every time the value changes.

aggregator-fn doesn't make much sense standing on its own.  Let's see how we can use it in the markup below, to handle sending a request to the [Newton Api Advanced Math microservice](https://newton.now.sh/).

```html
<div>
    <label for=operation>Operation:</label>
    <input id=operation value=integrate>
    <!-- "p-d" = pass down -->
    <p-d on=input to=[-operation] m=1 init-val=value></p-d>
    <label for=expression>Expression:</label>
    <input id=expression value="x^2">
    <p-d on=input to=[-expression] m=1 init-val=value></p-d>
    <aggregator-fn -operation -expression><script nomodule>
        ({operation, expression}) => `https://newton.now.sh/api/v2/${operation}/${encodeURI(expression)}`
    </script></aggregator-fn>
    <p-d on=value-changed to=[-href] m=1 as-str-attr></p-d>
    <k-fetch -href as=json></k-fetch>
    <p-d on=fetch-complete to=[-object] m=1></p-d>
    <json-viewer -object></json-viewer>
    <script type=module>
        import 'https://cdn.skypack.dev/aggregator-fn@0.0.26?min';
        import 'https://cdn.skypack.dev/k-fetch@0.0.5?min';
        import 'https://cdn.skypack.dev/pass-down@0.0.24?min';
    </script>
    <script type=module src=https://unpkg.com/@power-elements/json-viewer@2.1.1/json-viewer.js?module></script>
</div>
```

## [Demo](https://jsfiddle.net/bahrus/Ln1cqdgb/2/)

<!--
```
<custom-element-demo>
  <template>
<div>
    <label for=operation>Operation:</label>
    <input id=operation value=integrate>
    <p-d on=input to=[-operation] m=1 init-val=value></p-d>
    <label for=expression>Expression:</label>
    <input id=expression value="x^2">
    <p-d on=input to=[-expression] m=1 init-val=value></p-d>
    <aggregator-fn -operation -expression><script nomodule>
        ({operation, expression}) => `https://newton.now.sh/api/v2/${operation}/${encodeURI(expression)}`
    </script></aggregator-fn>
    <p-d on=value-changed to=[-href] m=1 as-str-attr></p-d>
    <k-fetch -href as=json></k-fetch>
    <p-d on=fetch-complete to=[-object] m=1></p-d>
    <json-viewer -object></json-viewer>
    <script type=module>
        import 'https://cdn.skypack.dev/aggregator-fn@0.0.26?min';
        import 'https://cdn.skypack.dev/k-fetch@0.0.5?min';
        import 'https://cdn.skypack.dev/pass-down@0.0.24?min';
    </script>
    <script type=module src=https://unpkg.com/@power-elements/json-viewer@2.1.1/json-viewer.js?module></script>
</div>
    </template>
</custom-element-demo>
```
-->

## [Post IE/11 Support](https://docs.microsoft.com/en-us/deployedge/edge-ie-mode)

## Accessing the custom element itself, containing host

In some circumstances, you may need the aggregator function to have access to the context from which it is being called.  To do this, add an argument, "self":

```html
<ag-fn>
    <script nomodule>
        ({a, b, c, self}) => {
            console.log(self);
            return a + b + c;
        }
    </script>
</ag-fn>
```

You can also reference the host component if it is available.  The host is obtained via self.getRootNode().host.  This makes sense if aggregator-fn/ag-fn is used within a traditional web component that uses Shadow DOM.  If it is used inside a web component that doesn't use shadowDOM, or some other containing DOM element you want to give special access to and call it "host", use property/attribute hostSelector/host-selector.





## [API Reference](https://bahrus.github.io/wc-info/cdn-base.html?npmPackage=aggregator-fn)

## Viewing Your Element

1.  Install node.js
2.  Install git.  Fork or clone this repo.
3.  From a command window, navigate to the folder created in step 2.
4.  Now run:

```
$ npm run serve
```

## Running Tests

```
$ npm run test
```
