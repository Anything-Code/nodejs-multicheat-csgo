const Memory = require('memoryjs')
const Keyboard = require('asynckeystate')

module.exports = class Autopistol {
    constructor (processHandle, client) {
        this.processHandle = processHandle
        this.client = client
        this.enable()
    }
    enable () {
        this.activated = true
        console.log('autopistol enabled...')
        this.loopInterval = setInterval(() => {
            if (Keyboard.getAsyncKeyState(0x1)) {
                Memory.writeMemory(this.processHandle, this.client + process.offsets.signatures.dwForceAttack, 5, 'int')
                setTimeout(() => Memory.writeMemory(this.processHandle, this.client + process.offsets.signatures.dwForceAttack, 4, 'int'), 15)
            }
        })
    }
    disable () {
        clearInterval(this.loopInterval)
        this.activated = false
        console.log('autopistol disabled...')
    }
}