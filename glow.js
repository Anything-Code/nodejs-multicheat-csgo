const OFFSETS = require('./OFFSETS')
const MEMORY = require('memoryjs')

const PROCESS_OBJECT = MEMORY.openProcess("csgo.exe")
const PROCESS_HANDLE = PROCESS_OBJECT.handle
const CLIENT_MODULE = MEMORY.findModule("client_panorama.dll", PROCESS_OBJECT.th32ProcessID)
const CLIENT = CLIENT_MODULE.modBaseAddr

module.exports = class Glow {
    constructor () {
        this.activated = true
        this.mainLoop()
    }
    mainLoop () {
        this.loopInterval = setInterval(() => {
            if (MEMORY.readMemory(PROCESS_HANDLE, CLIENT + OFFSETS.dwEntityList, 'dword') > 0) {
                let glow_manager = MEMORY.readMemory(PROCESS_HANDLE, CLIENT + OFFSETS.dwGlowObjectManager, 'int')
        
                for (let i = 1; i < 32; i++) {
                    let entity = MEMORY.readMemory(PROCESS_HANDLE, CLIENT + OFFSETS.dwEntityList + i * 0x10, 'int')
        
                    if (entity) {
                        let entity_team_id = MEMORY.readMemory(PROCESS_HANDLE, entity + OFFSETS.m_iTeamNum, 'int'),
                            entity_glow = MEMORY.readMemory(PROCESS_HANDLE, entity + OFFSETS.m_iGlowIndex, 'int')
        
                        switch (entity_team_id) {
                            case 2: // Terrorist
                                this.enableGlow(glow_manager, entity_glow, 1, 0, 0, 1)
                            break;
                            case 3: //Counter Terrorist
                                this.enableGlow(glow_manager, entity_glow, 0, 0, 1, 1)
                            break;
                        }
                    }
                }
            }
        })
    }
    enableGlow (glow_manager, entity_glow, r, g, b, a) {
        MEMORY.writeMemory(PROCESS_HANDLE, glow_manager + (entity_glow * 0x38 + 0x4), r, 'float')
        MEMORY.writeMemory(PROCESS_HANDLE, glow_manager + (entity_glow * 0x38 + 0x8), g, 'float')
        MEMORY.writeMemory(PROCESS_HANDLE, glow_manager + (entity_glow * 0x38 + 0xC), b, 'float')
        MEMORY.writeMemory(PROCESS_HANDLE, glow_manager + (entity_glow * 0x38 + 0x10), a, 'float')
        MEMORY.writeMemory(PROCESS_HANDLE, glow_manager + (entity_glow * 0x38 + 0x24), 1, 'int')
    }
}