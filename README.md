# aggregator-fn

\<aggregator-fn\> is a non-visual custom element that aggregates properties together using an inline JS expression.

This component is designed to provide an alternative to Polymer's template string interpolation.  It is most useful for markup-centric applications, consisting of web components that are not controlled by some state managed component container -- for example a ["peer-to-peer" binding framework](https://www.webcomponents.org/element/p-d.p-u).

The initial motivator for this component is being able to build url's from of a form consisting of input elements -- declaratively.

## Syntax:

```html
<aggregator-fn>
    <script nomodule>
        ({operation, expression}) => {
            return `https://newton.now.sh/${operation}/${encodeURI(expression)}`
        }  
    </script>
</aggregator-fn>
```

does the following:

1)  Dynamically attaches properties to the aggregator-fn element for each of the function arguments -- "operation" and "expression" in this case.
2)  Any time any of the property values changes, the aggregator function is evaluated (allowing for some debouncing), and the result is stored in the element's value property.  An event, "value-changed" is fired every time the value changes.


aggregator-fn doesn't make much sense standing on its own.  Let's see how we can use it in the markup below, to handle sending a request to the [Newton Api Advanced Math microservice](https://newton.now.sh/).

```html
    <div style="height:600px">
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

## IE11 Support

Note the use of lambda expressions within the script tag.  This poses some compatibility challenges.

Depending on which tool / server configururation you are using to serve your pages, these ES6 expressions can be transpiled on the fly or during the build to expressions that IE11 understands.  Polymer's serve / build tool is one such tool that does this.  If you use a tool like this, the aggregator-fn needs to know how to understand the parameters for the expression.  To do this, you need to add a JS reference specifically for IE11.  You also need to include a polyfill file needed for common ES6 expressions, such as the one generated by the [Financial Times polyfill service](https://polyfill.io/v2/docs/).  Your references can look like this:

```html
            <!-- For Retro Browsers -->
            <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
            <script nomodule src="https://unpkg.com/aggregator-fn@0.0.1/IE11-polyfill.js"></script>
            <script nomodule src="https://unpkg.com/xtal-latx@0.0.35/destruct.IE11.js"></script>
            <!-- End Polyfills -->
```

Here we are using "nomodule" with the assumption that only IE11 activates such scripts.  This may be slightly problematic if you are targeting Edge users who have yet to upgrade Edge 17, for example.

# Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP
