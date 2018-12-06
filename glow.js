const Memory = require('memoryjs')

module.exports = class Glow {
    constructor (processHandle, client) {
        this.processHandle = processHandle
        this.client = client
        this.enable()
    }
    enable () {
        this.activated = true
        console.log('glow enabled...')
        this.loopInterval = setInterval(() => {
            if (Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList, 'dword') > 0) {
                let glow_manager = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwGlowObjectManager, 'int')
        
                for (let i = 1; i < 32; i++) {
                    let entity = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')
        
                    if (entity) {
                        let entity_team_id = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iTeamNum, 'int'),
                            entity_glow = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iGlowIndex, 'int')
        
                        switch (entity_team_id) {
                            case 2: // Terrorist
                                this.drawOutline(glow_manager, entity_glow, 1, 0, 0, 1)
                            break;
                            case 3: //Counter Terrorist
                                this.drawOutline(glow_manager, entity_glow, 0, 0, 1, 1)
                            break;
                        }
                    }
                }
            }
        })
    }
    drawOutline (glow_manager, entity_glow, r, g, b, a) {
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x4), r, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x8), g, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0xC), b, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x10), a, 'float')
        Memory.writeMemory(this.processHandle, glow_manager + (entity_glow * 0x38 + 0x24), 1, 'int')
    }
    disable () {
        clearInterval(this.loopInterval)
        this.activated = false
        console.log('glow disabled...')
    }
}