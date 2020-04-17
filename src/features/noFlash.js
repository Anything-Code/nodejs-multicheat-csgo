const Memory = require('memoryjs')

module.exports = {
  active: false,

  enable ()
  {
    this.loopInterval = setInterval(() => {
      this.localPlayer = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwLocalPlayer, 'int')
      this.flashMaxAlpha = Memory.readMemory(process.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 'float')

      if (this.flashMaxAlpha > 0.0)
        Memory.writeMemory(process.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 0.0, 'float')
    })
    this.active = true
    process.cfg.visuals.noFlash = true

    console.log('NoFlash enabled...')
  },

  disable ()
  {
    clearInterval(this.loopInterval)
    Memory.writeMemory(process.processHandle, this.localPlayer + process.offsets.netvars.m_flFlashMaxAlpha, 255.0, 'float');
    this.active = false
    process.cfg.visuals.noFlash = false

    console.log('NoFlash disabled...')
  }
}