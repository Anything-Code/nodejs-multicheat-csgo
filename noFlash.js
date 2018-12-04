const Offsets = require('./offsets')
const Memory = require('memoryjs')

module.exports = class NoFlash {
    constructor (processObject) {
        this.processObject = processObject
        this.processHandle = this.processObject.handle
        this.clientModule = Memory.findModule("client_panorama.dll", this.processObject.th32ProcessID)
        this.client = this.clientModule.modBaseAddr
        this.enable()
    }
    enable () {
        this.loopInterval = setInterval(() => {
            this.localPlayer = Memory.readMemory(this.processHandle, this.client + Offsets.dwLocalPlayer, 'int')
            this.flashMaxAlpha = Memory.readMemory(this.processHandle, this.localPlayer + Offsets.m_flFlashMaxAlpha, 'float')

            if (this.flashMaxAlpha > 0.0)
                Memory.writeMemory(this.processHandle, this.localPlayer + Offsets.m_flFlashMaxAlpha, 0.0, 'float')
        })
        this.activated = true
        console.log('NoFlash enabled...')
    }
    disable () {
        clearInterval(this.loopInterval)
        Memory.writeMemory(this.processHandle, this.localPlayer + Offsets.m_flFlashMaxAlpha, 255.0, 'float');
        this.activated = false
        console.log('NoFlash disabled...')
    }
}