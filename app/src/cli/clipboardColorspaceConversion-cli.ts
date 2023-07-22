#!/usr/bin/env node
import clipboardColorspaceConversion from "../clipboardColorspaceConversion"
import { program } from "commander"
import reqPackageJson, { reqPackagePath } from "req-package-json"
import {promises as fs} from "fs"
import * as path from "path"
const config = reqPackageJson()
import * as console from "colorful-cli-logger"

program
  .version(config.version)
  .description(config.description)
  .name(config.name)
  .option('-s, --silent', 'silence stdout')
  // .argument('<required example>', "description of required example")
  // .argument('[optional example]', "description of optional example")
  .action((arg1, args2, options) => {
    console.setVerbose(!options.silent)
    
    // clipboardColorspaceConversion(arg1, args2)
    
    
  })

.parse(process.argv)

