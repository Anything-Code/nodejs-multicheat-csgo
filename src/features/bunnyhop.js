const Memory = require('memoryjs')
const Keyboard = require('asynckeystate')

module.exports = {
  active: false,

  enable ()
  {
    this.loopInterval = setInterval(() => {
      let localPlayer = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwLocalPlayer, 'int'),
        iFlags = Memory.readMemory(process.processHandle, localPlayer + process.offsets.netvars.m_fFlags, 'int');
      if (Keyboard.getAsyncKeyState(0x20))
        Memory.writeMemory(process.processHandle, process.client + process.offsets.signatures.dwForceJump, iFlags == 257 || iFlags == 263 ? 5 : 4, 'int')
    })
    this.active = true
    process.cfg.misc.bunnyhop = true

    console.log('Bunnyhop enabled...')
  },

  disable ()
  {
    clearInterval(this.loopInterval)
    this.active = false
    process.cfg.misc.bunnyhop = false

    console.log('Bunnyhop disabled...')
  }
}