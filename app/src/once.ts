import convert from './colorConv';
import clipboard from 'clipboardy';

export default function parse(args: string, colorSpace?: string) {
  try {
    const result = convert(args, undefined, colorSpace)
    console.log(result)
    try {
      clipboard.writeSync(result)
      console.log("")
      console.log("-------------------")
      console.log("Copied to clipboard")
    }
    catch(e) {
      console.error("")
      console.error("---------------------------")
      console.error("Failed to copy to clipboard")
    }
    
  }
  catch(e) {
    console.error(e)
  }
}


