# SVGIntPiano

An interactive svgpiano written in pure JavaScript with no dependencies

This library/plugin provides a stylable piano keyboard using SVG and CSS. The library
can function both as an input and output. The goal is to be very lightweight so that it contains a small footprint and remains modifiable. 

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

```lowNote```

(int) The lowest note that the keyboard displays

```highNote```

(int) The highest note that the keyboard displays

```width```
```height```

(int) The dimensions of the SVG in pixels

```margin```

(int) The margin around the sides of the SVG in pixels

```interactive```

(bool) Enables or disables touch interactivity

```whiteKeySpacing```

(int) The spacing of the white keys in pixels

```blackKeyVScale```

(float) How large the black keys are in relationship to the white keys in the 
vertical dimension

```blackKeyHScale```

(float) How large the black keys are in relationship to the white keys in the 
horizontal dimension

```cssClassPrefix```

(string) Default is svgkey. This defines the prefix of the classes used to style the 
keyboard plugin.



