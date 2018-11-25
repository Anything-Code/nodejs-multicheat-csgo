const GLOW = require('./glow')
const KEYBOARD = require('iohook')
const KEYCODE = require('keycode')

KEYBOARD.on('keydown', keyMeta => {
    if (KEYCODE(keyMeta.rawcode) === 'f12') {
        if (Glow.activated) {
            clearInterval(Glow.loopInterval)
            Glow.activated = false
            console.log('glow terminated...')
        } else {
            console.log('glow started...')
            Glow = new GLOW
        }
    }
})
KEYBOARD.start()

console.log('glow started...')
let Glow = new GLOW