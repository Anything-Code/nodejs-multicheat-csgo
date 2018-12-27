const Memory = require('memoryjs')

module.exports = class Glow {
    constructor (processHandle, client) {
        this.processHandle = processHandle
        this.client = client
        this.enable()
    }
    enable () {
        this.activated = true
        process.cfg.visuals.glow = true
        console.log('glow enabled...')
        this.loopInterval = setInterval(() => {
            if (Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList, 'dword') > 0) {
                let glow_manager = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwGlowObjectManager, 'int')
        
                for (let i = 0; i < 64; i++) {
                    let entity = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')
        
                    if (entity) {
                        let entity_team_id = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iTeamNum, 'int'),
                            entity_glow = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iGlowIndex, 'int')
        
                        switch (entity_team_id) {
                            case 2: // Terrorist
                                this.drawOutline(glow_manager, entity_glow, '#FF0000')
                            break;
                            case 3: //Counter Terrorist
                                this.drawOutline(glow_manager, entity_glow, '#0011ff')
                            break;
                        }
                    }
                }
            }
        })
    }
    disable () {
        clearInterval(this.loopInterval)
        this.activated = false
        process.cfg.visuals.glow = false
        console.log('glow disabled...')
    }
    drawOutline (glow_manager, entity_glow, hexColor) {
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x4), this.hexToRgb(hexColor).r, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x8), this.hexToRgb(hexColor).g, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0xC), this.hexToRgb(hexColor).b, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x10), this.hexToRgb(hexColor).a, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x24), 1, 'int')
    }
    hexToRgb (h) {
        var color = this.cutHex(h);
        var r = parseInt(color.substring(0, 2), 16), g = parseInt(color.substring(2, 4), 16), b = parseInt(color.substring(4, 6), 16)
        return {
            r : this.roundDown(r / 255, 3),
            g : this.roundDown(g / 255, 3),
            b : this.roundDown(b / 255, 3),
            a : 0.80
        }
    }
    cutHex (h) {
        return (h.charAt(0) == '#') ? h.substring(1, 7) : h
    }
    roundDown (number, decimals) {
        decimals = decimals || 0
        return  Math.floor( number * Math.pow(10, decimals) ) / Math.pow(10, decimals)
    }
}