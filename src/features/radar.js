const Memory = require('memoryjs')

module.exports = {
  active: false,

  enable ()
  {
    this.loopInterval = setInterval(() => {
      for (let i = 0; i < 64; i++) {
        let entity = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwEntityList + i * 0x10, 'int')
        Memory.writeMemory(process.processHandle, entity + process.offsets.netvars.m_bSpotted, 1, 'int')
      }
    })
    this.active = true
    process.cfg.visuals.radar = true

    console.log('Radar enabled...')
  },

  disable ()
  {
    clearInterval(this.loopInterval)
    this.active = false
    process.cfg.visuals.radar = false

    console.log('Radar disabled...')
  }
}