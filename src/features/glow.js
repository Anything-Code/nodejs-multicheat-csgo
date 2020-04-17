const Memory = require('memoryjs')

const Structs = require('../structs/structs')
const Helpers = require('../helpers/helpers')

module.exports = {
  active: false,
  loopInterval: null,

  enable (payload)
  {
    if (!this.active) console.log('glow enabled...')

    this.active = true

    payload.active = this.active
    process.cfg.visuals.glow = payload

    if (this.loopInterval) clearInterval(this.loopInterval)

    this.loopInterval = setInterval(() => this.entityLoop(payload, true))
  },

  disable ()
  {
    this.entityLoop(process.cfg.visuals.glow, false, { r: 255, g: 255, b: 255, a: 1 })
    clearInterval(this.loopInterval)

    this.active = false
    process.cfg.visuals.glow.active = false

    console.log('glow disabled...')
  },

  entityLoop (payload, drawGlow, rgba)
  {
    let localPlayer = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwLocalPlayer, 'dword'),
        entityList = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwEntityList, 'dword')

    if (entityList > 0 && localPlayer) {
      let glow_object_manager = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwGlowObjectManager, 'int'),
          myTeamNum = Memory.readMemory(process.processHandle, localPlayer + process.offsets.netvars.m_iTeamNum, 'int')

      for (let i = 0; i < 64; i++) {
        let entity = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')

        if (entity) {
          let entityTeamNum = Memory.readMemory(process.processHandle, entity + process.offsets.netvars.m_iTeamNum, 'int'),
              entity_glow_index = Memory.readMemory(process.processHandle, entity + process.offsets.netvars.m_iGlowIndex, 'int')

          // console.log(Memory.readBuffer(process.processHandle, glow_object_manager + (entity_glow_index * 0x38), Structs.glowStruct.length))
  
          // console.log(Structs.glowStruct)

          if (myTeamNum === entityTeamNum) { // blue
            payload.rgba = rgba ? rgba : payload.teamColor

            if (drawGlow) this.drawGlow(glow_object_manager, entity_glow_index, payload)

            // Memory.writeBuffer(process.processHandle, glow_object_manager + (entity_glow_index * 0x38), Structs.glowStruct)

            Memory.writeBuffer(process.processHandle, entity + process.offsets.netvars.m_clrRender, Structs.clrRenderTeam(payload.rgba))
          } else { //red
            payload.rgba = rgba ? rgba : payload.enemyColor

            if (drawGlow) this.drawGlow(glow_object_manager, entity_glow_index, payload)

            // Memory.writeBuffer(process.processHandle, glow_object_manager + (entity_glow_index * 0x38), Structs.glowStruct)

            Memory.writeBuffer(process.processHandle, entity + process.offsets.netvars.m_clrRender, Structs.clrRenderEnemy(payload.rgba))
          }
        }
      }
    }
  },

  drawGlow (glow_object_manager, entity_glow_index, payload)
  {
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x4), Helpers.roundDown(payload.rgba.r / 255, 3), 'float')           // r
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x8), Helpers.roundDown(payload.rgba.g / 255, 3), 'float')           // g
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0xC), Helpers.roundDown(payload.rgba.b / 255, 3), 'float')           // b
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x10), payload.rgba.a, 'float')          // a
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x24), payload.active ? 1 : 0, 'int')    // renderWhenOccluded
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x25), 1, 'int')                         // renderWhenUnoccluded
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x26), payload.fullBloom ? 1 : 0, 'int') // fullBloom
    Memory.writeMemory(process.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x2C), payload.style, 'int')             // glowStyle
  }
}