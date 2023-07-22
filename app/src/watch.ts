import notifier from 'node-notifier';
import clipboard from 'clipboardy';
import {GlobalKeyboardListener} from "node-global-key-listener";
import convert from './clipboardColorspaceConversion';
import LinkedList from "fast-linked-list"

function log(...a) {
  const time = new Date().toLocaleTimeString()
  console.log(`[${time}]`, ...a)
}

function error(...a) {
  const time = new Date().toLocaleTimeString()
  console.error(`[${time}]`, ...a)
}


function notify(options) {
  return new Promise((res) => {
  
    notifier.notify(options);
    
    notifier.addListener('click', () => {
      res("click")
    })
    
    notifier.addListener('timeout', () => {
      res("timeout")
    })
  })
}

export function watch(fromColorSpace?: string) {


  const listener = new LinkedList<(clipboardText: string) => void>()



  const v = new GlobalKeyboardListener();
  v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "C" && (down["LEFT META"] || down["RIGHT META"])) {
      clipboard.read().then((txt) => {
        for (const f of listener) {
          f(txt)
        }
      })
      
      return true;
    }
  });




  listener.push(async (clipboardText) => {
    console.log("Clipboard updated", clipboardText)
    try {
      const result = convert(clipboardText, undefined, fromColorSpace)

      console.log(`Converted "${clipboardText}" to "${result}"`)

      try {
        clipboard.writeSync(result)

        try {
          const res = await notify({
            title: 'Clipboard content updated!',
            message: 'Detected a css color, hence did color space conversion and updated clipboard. Click this message to undo.',
          })

          if (res == "click") {
            log("Undoing")
            try {
              clipboard.writeSync(clipboardText)
            }
            catch(e) {
              error("Failed to undo")
              console.log("Old clipboard content:\n---\n" + clipboardText + "\n---")
              
              try {
                await notify({
                  title: 'Failed to undo!',
                  message: 'You clicked the previous notification, which meant you wanted to undo the conversion, but we failed to do so. You can check the console for the old clipboard content.',
                })
              }
              catch(e) {
                error("Failed to notify 2")
              }
            }
          }
        }
        catch(e) {
          error("Failed to notify")
        }
      }
      catch(e) {
        error("Failed to copy to clipboard")
      }
    }
    catch(e) {
      // console.log("Failed to convert", e)
    }
  })





}

export default watch
