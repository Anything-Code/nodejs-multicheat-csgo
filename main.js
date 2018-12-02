const Glow = require('./glow')
const Memory = require('memoryjs')
const Keyboard = require('iohook')
const Keycode = require('keycode')
const WebServer = require('./webServer')

class Main {
    constructor () {
        this.started = false
        this.gameClosedAtStart = true
        this.listenForGameState()
        this.ws = new WebServer
    }
    listenForGameState () {
        this.processStateInterval = setInterval(() => {
            if (this.processFound('csgo.exe') && !this.started) {
                this.started = true
                console.log('"csgo.exe" found')
                this.listenForKeyboardInput(this.csProcess)
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
        this.csProcess = Memory.openProcess(processName)
        if (this.csProcess.szExeFile == processName)
            return true
        else
            return false
    }
    listenForKeyboardInput (csProcess) {
        console.log('Press f12 to toggle glow...')
        this.ws.socketIo.on('connection', socket => {
            socket.on('visuals transmitted', data => {
                this.toggleGlow(csProcess)
            })
        })
        Keyboard.on('keydown', key => {
            if (Keycode(key.rawcode) === 'f12' && this.started) {
                this.toggleGlow(csProcess)
            }
        })
        Keyboard.start()
    }
    toggleGlow (csProcess) {
        if (this.glow === undefined) {
            this.glow = new Glow(csProcess)
            this.ws.socketIo.emit('visuals transmitted', true)
        } else if (this.glow.activated) {
            this.glow.disable()
            this.ws.socketIo.emit('visuals transmitted', false)
        } else {
            this.glow.enable()
            this.ws.socketIo.emit('visuals transmitted', true)
        }
    }
}
new Main