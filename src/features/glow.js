const Memory = require('memoryjs')
const Concentrate = require('concentrate')
const Dissolve = require('dissolve')

const Structs = require('../structs/structs')
const Helpers = require('../helpers/helpers')

module.exports = class Glow
{
  constructor (processHandle, client)
  {
    this.processHandle = processHandle
    this.client = client
    this.glowStruct = Structs.glowStruct
    this.clrRenderTeam = Structs.clrRenderTeam
    this.clrRenderEnemy = Structs.clrRenderEnemy
    this.enable()
  }

  enable ()
  {
    this.activated = true
    process.cfg.visuals.glow = true
    console.log('glow enabled...')
    this.loopInterval = setInterval(() => {
      let localPlayer = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwLocalPlayer, 'dword'),
          entityList = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList, 'dword')

      if (entityList > 0 && localPlayer) {
        let glow_object_manager = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwGlowObjectManager, 'int'),
            myTeamNum = Memory.readMemory(this.processHandle, localPlayer + process.offsets.netvars.m_iTeamNum, 'int')

        for (let i = 0; i < 64; i++) {
          let entity = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')

          if (entity) {
            let entityTeamNum = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iTeamNum, 'int'),
                entity_glow_index = Memory.readMemory(this.processHandle, entity + process.offsets.netvars.m_iGlowIndex, 'int')

            // console.log(Memory.readBuffer(this.processHandle, glow_object_manager + (entity_glow_index * 0x38), this.glowStruct.length))

            // console.log(this.glowStruct)
            
            if (myTeamNum === entityTeamNum) { // blue
              this.drawGlow(glow_object_manager, entity_glow_index, '#0011FF')

              // Memory.writeBuffer(this.processHandle, glow_object_manager + (entity_glow_index * 0x38), this.glowStruct)

              Memory.writeBuffer(this.processHandle, entity + process.offsets.netvars.m_clrRender, this.clrRenderTeam)
            } else { //red
              this.drawGlow(glow_object_manager, entity_glow_index, '#FF0000')

              // Memory.writeBuffer(this.processHandle, glow_object_manager + (entity_glow_index * 0x38), this.glowStruct)
              
              Memory.writeBuffer(this.processHandle, entity + process.offsets.netvars.m_clrRender, this.clrRenderEnemy)
            }
          }
        }
      }
    })
  }

  disable ()
  {
    clearInterval(this.loopInterval)
    this.activated = false
    process.cfg.visuals.glow = false
    console.log('glow disabled...')
  }

  drawGlow (glow_object_manager, entity_glow_index, hexColor)
  {
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x4), Helpers.hexToRgb(hexColor).r, 'float')  // r
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x8), Helpers.hexToRgb(hexColor).g, 'float')  // g
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0xC), Helpers.hexToRgb(hexColor).b, 'float')  // b
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x10), Helpers.hexToRgb(hexColor).a, 'float') // a
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x24), 1, 'int')                              // renderWhenOccluded
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x25), 1, 'int')                              // renderWhenUnoccluded
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x26), 1, 'int')                              // fullBloom
    Memory.writeMemory(this.processHandle, glow_object_manager + (entity_glow_index * 0x38 + 0x2C), 1, 'int')                              // glowStyle
  }
}