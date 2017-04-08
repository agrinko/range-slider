# Range/slider JavaScript component

Customizable slider (range) component (widget) for JavaScript with no external dependencies (*even jQuery!)*

Enhance your users' experience with an attractive and interactive way to input numbers.

## Features

- No dependencies!
- Totally responsive!
- Positive and negative integers supported
- Neat design: plain 2D or stylish 3D view, smooth fade animations
- 3 pre-defined themes and possibility to customize your own theme
- 3 pre-defined sizes
- 3 shapes of the handle: square, round or rectangle
- Popup showing current value when moving
- Control over min, max and current value labels visibility and placement
- Full control over the value: min-max bounds, integer step, unit of measurement, possibility to prevent from dragging
to a particular number under some circumstances
- Simple API to interact with the value
- OOP-style (`RangeSlider` class with settings hash in constructor)
- Source code in 3 samples: *ES 2015*, *ES 5.1* and *ES 5.1 minified*

## Supported browsers

Tested in:
- Chrome 56
- Firefox 51
- IE 10

IE 9 is semi-supported: slider functions well but 3D design looks strange there.

Should also work in all major browsers, but need to test. If you find it working in
lower versions of Chrome or FF, or in other browsers, please communicate to update the doc!

## Example

Download the repo folder and open `index.html` in your browser.

It uses some self-explaining examples to demonstrate widget's abilities.

![sample](sample.png)

An example of default initialization:

```html
<div id="slider"></div>
<script>
    new RangeSlider(document.getElementById("slider"));
</script>
```

OR

```javascript
var slider = new RangeSlider();
document.body.appendChild(slider.getElement());
```

Example of maximal configuration:

```javascript
new RangeSlider(document.getElementById("slider-max"), {
    step: 10,
    min: 80,
    max: 1000,
    value: 200,
    unit: "km/h",
    width: "75%",
    design: "3d",
    showMinMaxLabels: true,
    showCurrentValueLabel: true,
    labelsPosition: "bottom",
    popup: "bottom",
    theme: "attention",
    handle: "round",
    size: "large"
});
```

## Installation

### Using npm

`npm install range-slider`

Then in your JS code:

`require("range-slider")`

This will require minified file as a dependency.

It's assumed to work with both CommonJS or AMD, but needs to be tested. Please communicate if you confirm.

Don't forget to add CSS file manually!

### Simple download

Download one of the versions from [src](./src) directory (either [EcmaScript 6 full](./src/range-slider.es6),
[EcmaScript 5 full](./src/range-slider.js) or [EcmaScript 5 minified](./src/range-slider.min.js)).
Attach the script anywhere on your page.

Download [full](./css/range-slider.css) or [minified](./css/range-slider.min.css) CSS and attach to your page.

For example:

```html
<head>
    <link rel="stylesheet" href="css/range-slider.min.css">
</head>
<body>
    <div id="slider"></div>
    <script src="vendor/range-slider.min.js"></script>
    <script>
        new RangeSlider(document.getElementById("slider"));
    </script>
</body>
```

### Repository

If you want to contribute or research the repo, clone it and run `npm install`.

Then run `npm run build` each time you want to compile and minify ES6 and CSS source code.

## API

### Settings

### Callbacks

### Methods

## CSS customization

## TODO

*Alexey Grinko, 2017 (c)*