const Memory = require('memoryjs')
const Keyboard = require('asynckeystate')

module.exports = class Bunnyhop {
  constructor(processHandle, client) {
    this.processHandle = processHandle
    this.client = client
    this.enable()
  }
  enable() {
    this.loopInterval = setInterval(() => {
      let localPlayer = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwLocalPlayer, 'int'),
        iFlags = Memory.readMemory(this.processHandle, localPlayer + process.offsets.netvars.m_fFlags, 'int');
      if (Keyboard.getAsyncKeyState(0x20))
        Memory.writeMemory(this.processHandle, this.client + process.offsets.signatures.dwForceJump, iFlags == 257 || iFlags == 263 ? 5 : 4, 'int')
    })
    this.activated = true
    process.cfg.misc.bunnyhop = true
    console.log('Bunnyhop enabled...')
  }
  disable() {
    clearInterval(this.loopInterval)
    this.activated = false
    process.cfg.misc.bunnyhop = false
    console.log('Bunnyhop disabled...')
  }
}