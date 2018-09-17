# aggregator-fn

\<aggregator-fn\> is a non-visual custom element that aggregates properties together using an inline JS expression.

This component is designed for markup-centric applications, consisting of web components that are not controlled by some state managed component container -- for example a ["peer-to-peer" binding framework](https://www.webcomponents.org/element/p-d.p-u).

One thing Polymer's powerful binding mechanism brings to the table, that is useful to isolate as a standalone component, is an aggregator, or expression evaluator component.  The primary motivator for this component is formulating url's out of a form -- declaratively.

aggregator-fn doesn't make much sense standing on its own.  Let's see how we can use it in the markup below, to handle sending a request to the [Newton Api Advanced Math microservice](https://newton.now.sh/).

```html
    <div>
        <label for="operation">Operation:</label>
        <input type="text" name="operation" value="derive">
        <p-d on="input" to="aggregator-fn{operation}"></p-d>
        <label for="expression">Expression:</label>
        <input type="text" name="expression" value="x^2">
        <p-d on="input" to="aggregator-fn{expression}"></p-d>
        <aggregator-fn>
            <script nomodule>
                ({operation, expression}) => {
                    return `https://newton.now.sh/${operation}/${encodeURI(expression)}`
                }  
            </script>
        </aggregator-fn>
        <p-d on="value-changed" to="{href}"></p-d>
        <xtal-fetch fetch></xtal-fetch>
        <p-d on="fetch-complete" to="{input}"></p-d>
        <xtal-json-editor options="{}" height="300px"></xtal-json-editor>
        
    </div>
```

<!--
```
<custom-element-demo>
  <template>
      <div>
        <label for="operation">Operation:</label>
        <input type="text" name="operation" value="derive">
        <p-d on="input" to="aggregator-fn{operation}"></p-d>
        <label for="expression">Expression:</label>
        <input type="text" name="expression" value="x^2">
        <p-d on="input" to="aggregator-fn{expression}"></p-d>
        <aggregator-fn>
            <script nomodule>
                ({operation, expression}) => {
                    return `https://newton.now.sh/${operation}/${encodeURI(expression)}`
                }  
            </script>
        </aggregator-fn>
        <p-d on="value-changed" to="{href}"></p-d>
        <xtal-fetch fetch></xtal-fetch>
        <p-d on="fetch-complete" to="{input}"></p-d>
        <xtal-json-editor options="{}" height="300px"></xtal-json-editor>
        
        <script type="module" src="https://unpkg.com/aggregator-fn@0.0.1/aggregator-fn.js?module"></script>
        <script type="module" src="https://unpkg.com/xtal-fetch@0.0.47/xtal-fetch.js"></script>
        <script type="module" src="https://unpkg.com/p-d.p-u@0.0.69/p-d.p-u.js"></script>
        <script type="module" src="https://unpkg.com/xtal-json-editor@0.0.29/xtal-json-editor.js"></script>
    </div>

    </template>
</custom-element-demo>
```
-->

# Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP
