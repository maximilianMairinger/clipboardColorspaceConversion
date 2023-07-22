import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/clipboardColorspaceConversion.ts',
  output: {
    file: 'app/dist/cjs/clipboardColorspaceConversion.js',
    format: 'cjs'
  },
})