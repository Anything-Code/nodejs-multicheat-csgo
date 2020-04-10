const Memory = require('memoryjs')

module.exports = class Radar {
  constructor(processHandle, client) {
    this.processHandle = processHandle
    this.client = client
    this.enable()
  }
  enable() {
    this.loopInterval = setInterval(() => {
      for (let i = 0; i < 64; i++) {
        let entity = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')
        Memory.writeMemory(this.processHandle, entity + process.offsets.netvars.m_bSpotted, 1, 'int')
      }
    })
    this.activated = true
    process.cfg.visuals.radar = true
    console.log('Radar enabled...')
  }
  disable() {
    clearInterval(this.loopInterval)
    this.activated = false
    process.cfg.visuals.radar = false
    console.log('Radar disabled...')
  }
}