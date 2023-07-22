import Color from "colorjs.io"
import hexRgb from 'hex-rgb';


type W = Color.Space
const rgbRegex = /^((#?((([a-f0-9]{2}){3,4})|([a-f0-9]{3,4})))|((((rgba?)|color)\()?(((0?(\.\d+))( |, ?)((0?(\.\d+))|1)( |, ?)((0?(\.\d+))|1)(( |, ?)((0?(\.\d+))|1))?)|((\d\d?\d?)( |, ?)(\d\d?\d?)( |, ?)(\d\d?\d?)((( |, ?)((0?(\.\d+))|1)))?)))\)?)$/gi


export default function(ogStr, attrb = "background: ", fromColorSpace = "p3") {
  let str = ogStr

  let colors
  let isHex = false
  let is255Base = false
  try {
    colors = hexRgb(str, {format: "array"})
    console.log("colors", colors)
    isHex = true
  }
  catch(e) {}

  if (isHex) is255Base = true
  else {
    const matches = !!str.match(rgbRegex)
    if (!matches) throw new Error("Invalid color string")

    let q = str.split("(")
    if (q.length > 1) str = q[q.length-1]
    q = str.split(")")
    if (q.length > 1) str = q[0]

    colors = str.split(/, *|  */i).map(a => +a.trim())



    if (ogStr.includes("rgb")) is255Base = true
    else if (ogStr.includes("color")) {}
    else if (colors.some(a => a > 1)) is255Base = true
  }

  if (is255Base) {
    const opacity = colors[3]
    colors = [colors[0], colors[1], colors[2]].map(a => a/255)
    if (opacity !== undefined) colors.push(opacity)
  }


  if (!(colors.length === 3 || colors.length === 4)) throw new Error("Expected 3 or 4 values, got " + colors.length)
  if (colors.some(a => isNaN(a))) throw new Error("Expected all values to be numbers, got " + colors)
  if (colors.some(a => a < 0 || a > 1)) throw new Error("Expected all values to be between 0 and 1, got " + colors.map(c => Math.round(c * 1000)/1000))



  

  return toString(colors, attrb, fromColorSpace)
}


/**
 * @param {[red: number, green: number, blue: number, alpha?: number]} arr
 * @param {string} attrb
 * @param {"p3" | "srgb"} space
 * @returns {string}
 */
function toString(colors, attrb, space) {
  let alpha = 1
  if (colors.length === 4) alpha = colors.pop()
  let color = new Color(space, colors, alpha)
  const srgbFallbackStr = color.to("srgb").toString()
  const displayP3Str = color.toString()

  return `${attrb}${srgbFallbackStr};\n${attrb}${displayP3Str};`
}




// cases we want to support
// rgb(.5,.2,0.2)
// rgb(255, 200, 100)
// 255 200 100
// 255, 200,100
// color(255, 200,100)
// #ffffff
