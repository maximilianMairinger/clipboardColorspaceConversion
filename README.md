<h1> <img src="pics/icon.png" style="display: inline-block; height: .95em; margin-right: 5px; margin-bottom: -5px"/> Clipboard colorspace conversion</h1>

![Flowchart to JSON Illustration](pics/banner.png)

> Note: This plugin is aimed at developers/designers working with a environment/monitor that supports a color space with a wider gamut than sRGB. E.g. Figma running in a browser is limited to sRGB currently, however the desktop app supports the option to use the native OS one. You may need to enable this in the settings under: `Figma > Preferences > Color Space > Unmanaged`.

When working in a wider color gamut (like the display of a modern macbook, supporting p3) and coping colors to be rendered on the web you may find them to look different (notably less saturated), to what you designed. While this is to some extent a invadable consequence of converting to a smaller color gamut (sRGB), as some colors simply cannot be represented there, we can do better than clipping off the values that are out of range (which undermines all deltas of colors not inside the range) as well as linearly interpolating from the respective corners of the gamut (which is not perceptually uniform). There are better ways of converting colors to a lower color space while respecting both concerns. The specific implementation is explained here [on colorjs.io](https://colorjs.io/docs/gamut-mapping.html). The result is by the nature of the problem not perfect but much more sensible. Especially as we are, as of recently, not limited to sRGB anymore on the web. The new CSS Color Module Level 4 specifies the `color()` function with which we can represent colors in wider color spaces, when supported. As this feature is decently new we provide a fallback sRGB representation as well, which is gamut mapped as explained above. 

## Installation

```shell
 $ npm i clipboard-colorspace-conversion
```

Or for CLI usage:

```shell
 $ npm i -g clipboard-colorspace-conversion
```

## Usage

This library can be used as JS module (= API), as CLI or as a [Figma plugin](https://github.com/maximilianMairinger/exportColorInGamut).

### CLI

### One time usage

The result will be copied to your clipboard if possible and logged to the console.

```shell
ccc <color>
```

`color` can be any HEX or rgb string copied from somewhere. Here are some examples that work: `0.2, 0.1, 1`, `233 100 0`, `rgb(0, 0, 255)`, `ff00ff`, `#f0f`, `#ff00ff00`.

An example output would be:

```js
`background: rgb(21.596% 9.3558% 100%);
background: color(display-p3 0.2 0.1 1);`
```

### Watch mode

```shell
ccc
```

This will watch your clipboard, anything matching a color-code regex (see examples above), will be converted overridden in your clipboard. Whenever this happens a OS level notification will show. Clicking on it will undo the change.

> Notifications depend on node-notifier. Hence the requirements are:
>  * macOS: >= 10.8 for native notifications, or Growl if earlier.
>  * Linux: notify-osd or libnotify-bin installed (Ubuntu should have this by default)
>  * Windows: >= 8, or task bar balloons for Windows < 8. Growl as fallback. Growl takes precedence over Windows balloons.
>  * General Fallback: Growl

### Options

 * `--inputColorSpace` What is the colorspace of the input (your displays colorspace if the app where you got the color from does not do the conversion). Can be one of [these](https://colorjs.io/docs/spaces.html). Defaults to p3 (as in the m1 mbp's display)


### API

For one time usage:

```ts
import clipboardColorspaceConversion from "clipboard-colorspace-conversion"

const colorString = "0.2, 0.1, 1"
const attrb = "background: " // optional
const fromColorSpace = "p3"  // optional

const convertedStr = clipboardColorspaceConversion(colorString, attrb, fromColorSpace)

console.log(convertedStr) // 'background: rgb(21.596% 9.3558% 100%);\n' +
                          // 'background: color(display-p3 0.2 0.1 1);'
```

## Contribute

All feedback is appreciated. Create a pull request or write an issue.
