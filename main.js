const memoryjs = require('memoryjs')

const offsets = {
    m_iGlowIndex: 0x0000A344,
    m_iTeamNum: 0x000000F0,
    dwEntityList: 0x4C41704,
    dwGlowObjectManager: 0x51809B0
}

const   processObject = memoryjs.openProcess("csgo.exe"),
        processHandle = processObject.handle,
        clientModule = memoryjs.findModule("client_panorama.dll", processObject.th32ProcessID),
        client = clientModule.modBaseAddr

setInterval(() => {
    if (memoryjs.readMemory(processHandle, client + offsets.dwEntityList, 'dword') > 0) {
        let glow_manager = memoryjs.readMemory(processHandle, client + offsets.dwGlowObjectManager, 'int')

        for (let i = 1; i < 32; i++) {
            let entity = memoryjs.readMemory(processHandle, client + offsets.dwEntityList + i * 0x10, 'int')
            
            if (entity) {
                let entity_team_id = memoryjs.readMemory(processHandle, entity + offsets.m_iTeamNum, 'int'),
                    entity_glow = memoryjs.readMemory(processHandle, entity + offsets.m_iGlowIndex, 'int')

                switch (entity_team_id) {
                    case 2: // Terrorist
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x4), 1, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x8), 0, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0xC), 0, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x10), 1, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x24), 1, 'int')
                    break;
                    case 3: //Counter Terrorist
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x4), 0, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x8), 0, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0xC), 1, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x10), 1, 'float')
                        memoryjs.writeMemory(processHandle, glow_manager + (entity_glow * 0x38 + 0x24), 1, 'int')
                    break;
                }
            }
        }
    }
})