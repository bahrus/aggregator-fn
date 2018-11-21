[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/aggregator-fn)

<a href="https://nodei.co/npm/aggregator-fn/"><img src="https://nodei.co/npm/aggregator-fn.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/aggregator-fn@0.0.13/dist/aggregator-fn.iife.min.js?compression=gzip">

# aggregator-fn

NB:  aggregator-fn shares quite a bit of code with [litter-g](https://www.webcomponents.org/element/litter-g), as they both tackle similar problems.  It would be natural to use the two together (without much additional overhead.)

\<aggregator-fn\> is a non-visual custom element that aggregates properties together using an inline JS expression.

This component is designed to provide an alternative to Polymer's template string interpolation.  It is most useful for markup-centric applications, consisting of web components that are not controlled by some state managed component container -- for example a ["peer-to-peer" binding framework](https://www.webcomponents.org/element/p-d.p-u).

The initial motivator for this component is being able to build url's from a form consisting of input elements -- declaratively.

## Syntax:

```html
<aggregator-fn><script nomodule>
    ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
</script></aggregator-fn>
```

does the following:

1)  Dynamically attaches properties to the aggregator-fn element for each of the function arguments -- "operation" and "expression" in this case.
2)  Any time any of the property values changes, the aggregator function is evaluated (allowing for some debouncing), and the result is stored in the element's value property.  An event, "value-changed" is fired every time the value changes.


aggregator-fn doesn't make much sense standing on its own.  Let's see how we can use it in the markup below, to handle sending a request to the [Newton Api Advanced Math microservice](https://newton.now.sh/).

```html
    <div>
        <label for="operation">Operation:</label>
        <input type="text" name="operation" value="derive">
        <p-d on="input" to="aggregator-fn" prop="operation" m="1"></p-d>
        <label for="expression">Expression:</label>
        <input type="text" name="expression" value="x^2">
        <p-d on="input" prop="expression"></p-d>
        <aggregator-fn><script nomodule>
            ({operation, expression}) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
        </script></aggregator-fn>
        <p-d on="value-changed" prop="href"></p-d>
        <xtal-fetch fetch></xtal-fetch>
        <p-d on="fetch-complete" prop="input"></p-d>
        <xtal-json-editor options="{}" height="300px"></xtal-json-editor>
        
    </div>
```

<!--
```
<custom-element-demo>
  <template>
    <div style="height:600px">
        <!-- ================    HTML Markup =====================-->
        <!-- Specify Mathematical Operation -->
        <label for="operation">Operation:</label>
        <input disabled type="text" name="operation" value="derive">
        <!-- Pass down Operation to aggregator-fn when operation changes-->
        <p-d on="input" to="aggregator-fn" prop="operation"></p-d>
        <!-- Specify Mathematical Expression-->
        <label for="expression">Expression:</label>
        <input disabled type="text" name="expression" value="x^2">
        <!-- Pass down Expression to aggregator-fn when expression changes -->
        <p-d on="input" prop="expression"></p-d>
        <!-- Combine Operation and Expression into URL Newton Microservice Api understands-->
        <aggregator-fn disabled><script nomodule>
            ({ operation, expression }) => `https://newton.now.sh/${operation}/${encodeURI(expression)}`
        </script></aggregator-fn>
        <!-- Pass down url calculated by aggregator-fn to xtal-fetch's href property-->
        <p-d on="value-changed" prop="href"></p-d>
        <!-- Make fetch call to Newton Microservice Api -->
        <xtal-fetch debounce-duration="100" fetch disabled></xtal-fetch>
        <!-- Pass results of fetch to Json Viewer -->
        <p-d on="fetch-complete" prop="input"></p-d>
        <xtal-json-editor options="{}" height="300px"></xtal-json-editor>
        
        <!-- ========================  Script Refs ========================== -->
        <!-- Polyfills Needed for MS browsers -->
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <!-- End Polyfills -->
        <script type="module" src="https://cdn.jsdelivr.net/npm/aggregator-fn@0.0.11/aggregator-fn.iife.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.52/xtal-fetch.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.82/dist/p-d.iife.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-json-editor@0.0.29/xtal-json-editor.js"></script>
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

## Accessing the custom element itself

In some (rare?) circumstances, you may need the aggregator function to have access to the context from which it is being called.  To do this, add an argument, __this:

```html
<aggregator-fn>
    <script nomodule>
        ({a, b, c, __this}) => {
            console.log(__this);
            return a + b + c;
        }
    </script>
</aggregator-fn>
```

# Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

WIP
