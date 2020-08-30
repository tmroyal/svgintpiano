# SVGIntPiano

An interactive svgpiano written in pure JavaScript with no dependencies

This library/plugin provides a stylable piano keyboard using SVG and CSS. The library
functions both as an input and output. The goal is to be very lightweight so that it contains a small footprint and remains modifiable. 

## Examples

Currently, there are three examples that demonstrates the library's functionality:

- an [example](https://tmroyal.github.io/svgintpiano/examples/eventSubscription.html) showing how to connect key presses to callbacks
- an [example](https://tmroyal.github.io/svgintpiano/examples/chordDisplayer.html) showing how to use svgintpiano as a display
- an [example](https://tmroyal.github.io/svgintpiano/examples/keyboardStyling.html) showing how to style the piano with SVG

## Installation

Currently, you can download the files in the `dist` directory and include the js file and, optionally, the CSS file.

## Initializing

To initialize an SVGIntPiano object:

```
const params = {
  \\ setup parameters go here
};
const piano = new SVGIntPiano("cont", params);
```

Where "cont" is the id of an element difined similarly to:

```
<body>
  <div id="cont"></div>
</body>
```

The library creates an SVG within the element whose id is passed as the first argument.

## Parameters

This library contains a number of parameters that enable some custimization of functionality.

Term 1
: definition 1
: definition 2

Term 2
: definition 1
: definition 2    

  props.lowNote = props.lowNote || 48;
    props.highNote = props.highNote || 72;
    props.margin = props.margin || 1;
    props.whiteKeySpacing = props.whiteKeySpacing || 1;
    props.blackKeyVScale = props.blackKeyVScale || 0.668;
    props.blackKeyHScale = props.blackKeyHScale || 0.55;
    props.width = props.width || 500;
    props.height = props.height || 180;
    props.cssClassPrefix = props.cssClassPrefix || 'svgkey';

    if (!props.hasOwnProperty("interactive")){
      props.interactive = true;
    }

    if (props.lowNote > props.highNote){
      console.warn("SVGIntPiano: improperly specified lowNote and/or highNote")
      props.highNote = props.lowNote;
    }


