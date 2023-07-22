#!/usr/bin/env node
import watch from "../watch"
import once from "../once"
import { program } from "commander"
import reqPackageJson, { reqPackagePath } from "req-package-json"
import {promises as fs} from "fs"
import * as path from "path"
const config = reqPackageJson()

program
  .version(config.version)
  .description(config.description)
  .name(config.name)
  .option('--inputColorSpace', "What is the colorspace of the input (your displays colorspace if the app where you got the color from does not do the conversion). Can be one of these. https://colorjs.io/docs/spaces.html. Defaults to p3 (as in the m1 mbp's display)")
  .argument('[Color string]', "Color string for one time conversion, if you leave this empty it will listen for clipboard changes and convert them automatically")
  .action((arg1, options) => {
    
    if (arg1 !== undefined) {
      once(arg1, options.inputColorSpace)
    }
    else {
      watch(options.inputColorSpace)
      console.log("Listening for clipboard changes...")
    }
    
    
  })

.parse(process.argv)

