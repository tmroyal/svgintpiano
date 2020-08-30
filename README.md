# SVGIntPiano

An interactive SVG piano keyboard plugin written in pure JavaScript with no dependencies

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

Where "cont" is the id of an element defined similarly to:

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

## API

The plugin/library responds to the following functions:

```set(state, key)```

- (boolean) state: the desired state
- (int) key: the midi number responding to the key

Sets the key to the value of state. This sets the css value of the key for display purposes.

```clear()```

Sets all keys to off.

```subscribe(message, callback)```

- (string) message: one of "keyon" and "keyoff"
- (function) callback: a function that takes as its first argument the
  midi number of the key pressed or released

Returns: (string) id : the id that is used to unsubscribe from a callback

Use this to assign functions that take place when keys are pressed and released.

```unsubscribe(message, key)```
- (string) message: one of "keyon" and "keyoff"
- (string) key: string returned from `subscribe()`

Use this to unsubscribe from an event.

## Styling

The appearance of the keyboard is specified through CSS. Declaration that can be used for
SVG work for the keys of this piano plugin.

### Note on the naming convention 

The following class names are of the form ```svgkey_(specifier)```. This assumes that ```prop.cssClassPrefix``` mentioned above is not set. If it is, use what ever you set this to in the place of ```svgkey```. For example, if you set ```cssClassPrefix``` to ```pianokey```, your class names will be of the form ```pianokey_specifier```.

### The class names

```.svgkey_off```

The styling for white keys when they are not being depressed or when the ```set(false, midinumber)``` method is called.

```.svgkey_on```

The styling for white keys when they are being depressed or when the ```set(true, midinumber)``` method is called.

```.svgkey_black_off```

The styling for black keys when they are not being depressed or when the ```set(false, midinumber)``` method is called.

```.svgkey_black_on```

The styling for black keys when they are being depressed or when the ```set(true, midinumber)``` method is called.

Note as well, psuedo selectors such as ```hover``` are available to SVG rectangles.

## Contributing

I do not have a maintenance right now for accepting issues and pull requests. If you send one, I will try my best to answer questions or accept the pull request if its appropriate.

Thanks!
