const Glow = require('./glow')
const NoFlash = require('./noFlash')
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
        return this.csProcess.szExeFile == processName
    }
    listenForKeyboardInput (csProcess) {
        console.log('Press f12 to toggle glow...')
        this.ws.socketIo.on('connection', socket => {
            socket.on('visuals transmitted', visuals => {
                if (visuals.glow)
                    this.toggleGlow(csProcess)
                else if (visuals.noFlash)
                    this.toggleNoFlash(csProcess)
            })
        })
        Keyboard.on('keydown', key => {
            if (Keycode(key.rawcode) === 'f12' && this.started) {
                this.toggleGlow(csProcess)
            }
        })
        Keyboard.start()
    }
    toggleNoFlash (csProcess) {
        if (this.noFlash === undefined) {
            this.noFlash = new NoFlash(csProcess)
            this.ws.socketIo.emit('noFlash transmitted', true)
        } else if (this.noFlash.activated) {
            this.noFlash.disable()
            this.ws.socketIo.emit('noFlash transmitted', false)
        } else {
            this.noFlash.enable()
            this.ws.socketIo.emit('noFlash transmitted', true)
        }
    }
    toggleGlow (csProcess) {
        if (this.glow === undefined) {
            this.glow = new Glow(csProcess)
            this.ws.socketIo.emit('glow transmitted', true)
        } else if (this.glow.activated) {
            this.glow.disable()
            this.ws.socketIo.emit('glow transmitted', false)
        } else {
            this.glow.enable()
            this.ws.socketIo.emit('glow transmitted', true)
        }
    }
}
new Main