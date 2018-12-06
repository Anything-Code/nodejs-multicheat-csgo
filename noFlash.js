const Memory = require('memoryjs')

module.exports = class NoFlash {
    constructor (processHandle, client) {
        this.processHandle = processHandle
        this.client = client
        this.enable()
    }
    enable () {
        this.loopInterval = setInterval(() => {
            this.localPlayer = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwLocalPlayer, 'int')
            this.flashMaxAlpha = Memory.readMemory(this.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 'float')

            if (this.flashMaxAlpha > 0.0)
                Memory.writeMemory(this.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 0.0, 'float')
        })
        this.activated = true
        process.cfg.visuals.noFlash = true
        console.log('NoFlash enabled...')
    }
    disable () {
        clearInterval(this.loopInterval)
        Memory.writeMemory(this.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 255.0, 'float');
        this.activated = false
        process.cfg.visuals.noFlash = false
        console.log('NoFlash disabled...')
    }
}