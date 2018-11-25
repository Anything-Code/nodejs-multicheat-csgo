const Glow = require('./glow')
const Memory = require('memoryjs')
const Keyboard = require('iohook')
const Keycode = require('keycode')

class Main {
    constructor () {
        this.started = false
        this.gameClosedAtStart = true
        this.listenForGameState()
    }
    listenForGameState () {
        this.processStateInterval = setInterval(() => {
            if (this.processFound('csgo.exe') && !this.started) {
                this.started = true
                console.log('"csgo.exe" found')
                this.listenForKeyboardInput(this.process)
            } else if (!this.processFound('csgo.exe') && this.started) {
                this.started = false
                this.gameClosedAtStart = false
                console.log('"csgo.exe" was closed. Terminating Process...')
                process.exit()
            } else if (!this.processFound('csgo.exe') && !this.started && this.gameClosedAtStart) {
                this.gameClosedAtStart = false
                console.log('"csgo.exe" not found, please start "csgo.exe"')
            }
        }, 200)
    }
    processFound (processName) {
        this.process = Memory.openProcess(processName)
        if (this.process.szExeFile == processName)
            return true
        else
            return false
    }
    listenForKeyboardInput (process) {
        console.log('Press f12 to toggle glow...')
        Keyboard.on('keydown', key => {
            if (Keycode(key.rawcode) === 'f12' && this.started) {
                if (this.glow === undefined)
                    this.glow = new Glow(process)
                else if (this.glow.activated)
                    this.glow.disable()
                else
                    this.glow.enable()
            }
        })
        Keyboard.start()
    }
}
new Main