const Glow = require('./glow')
const NoFlash = require('./noFlash')
const Autopistol = require('./autopistol')
const Memory = require('memoryjs')
const Keyboard = require('iohook')
const Keycode = require('keycode')
const WebServer = require('./webServer')

module.exports = class Bootstrap {
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
        let csProcess = Memory.openProcess(processName),
            clientModule = Memory.findModule("client_panorama.dll", csProcess.th32ProcessID)
        this.processhandle = csProcess.handle
        this.client = clientModule.modBaseAddr
        return csProcess.szExeFile == processName
    }
    listenForKeyboardInput () {
        console.log('Press f12 to turn everything off...')
        this.ws.socketIo.on('connection', socket => {
            socket.on('visuals transmitted', visuals => {
                if (visuals.glow)
                    this.toggleGlow()
                else if (visuals.noFlash)
                    this.toggleNoFlash()
            })
            socket.on('misc transmitted', misc => {
                if (misc.autopistol)
                    this.toggleAutopistol()
            })
        })
        Keyboard.on('keydown', key => {
            if (Keycode(key.rawcode) === 'f12' && this.started) {
                if (this.glow != undefined) {
                    this.glow.disable()
                    this.ws.socketIo.emit('glow transmitted', false)
                }
                if (this.noFlash != undefined) {
                    this.noFlash.disable()
                    this.ws.socketIo.emit('noFlash transmitted', false)
                }
            }
        })
        Keyboard.start()
    }
    toggleAutopistol () {
        if (this.autopistol === undefined) {
            this.autopistol = new Autopistol(this.processhandle, this.client)
            this.ws.socketIo.emit('autopistol transmitted', true)
        } else if (this.autopistol.activated) {
            this.autopistol.disable()
            this.ws.socketIo.emit('autopistol transmitted', false)
        } else {
            this.autopistol.enable()
            this.ws.socketIo.emit('autopistol transmitted', true)
        }
    }
    toggleNoFlash () {
        if (this.noFlash === undefined) {
            this.noFlash = new NoFlash(this.processhandle, this.client)
            this.ws.socketIo.emit('noFlash transmitted', true)
        } else if (this.noFlash.activated) {
            this.noFlash.disable()
            this.ws.socketIo.emit('noFlash transmitted', false)
        } else {
            this.noFlash.enable()
            this.ws.socketIo.emit('noFlash transmitted', true)
        }
    }
    toggleGlow () {
        if (this.glow === undefined) {
            this.glow = new Glow(this.processhandle, this.client)
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