const Memory = require('memoryjs')
const Keyboard = require('asynckeystate')
const Weapons = require('../data/weaponItemIndices')

module.exports = {
  active: false,

  currentWeapon ()
  {
    let localPlayer = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwLocalPlayer, 'int'),
      localWeapon = Memory.readMemory(process.processHandle, localPlayer + process.offsets.netvars.m_hActiveWeapon, 'int'),
      duck = localWeapon & 0xFFF,
      horse = Memory.readMemory(process.processHandle, process.client + process.offsets.signatures.dwEntityList + (duck - 1) * 16, 'int'),
      cock = Memory.readMemory(process.processHandle, horse + process.offsets.netvars.m_iItemDefinitionIndex, 'int')
    return cock
  },

  isPistol(weaponIndex)
  {
    return weaponIndex == Weapons.WEAPON_DEAGLE || weaponIndex == Weapons.WEAPON_FIVESEVEN || weaponIndex == Weapons.WEAPON_GLOCK || weaponIndex == Weapons.WEAPON_P250 || weaponIndex == Weapons.WEAPON_USP_SILENCER || weaponIndex == Weapons.WEAPON_HKP2000 || weaponIndex == Weapons.WEAPON_TEC9 || weaponIndex == Weapons.WEAPON_ELITE
  },

  enable ()
  {
    this.active = true
    process.cfg.misc.autopistol = true
    this.loopInterval = setInterval(() => {
      if (Keyboard.getAsyncKeyState(0x1) && this.isPistol(this.currentWeapon())) {
        Memory.writeMemory(process.processHandle, process.client + process.offsets.signatures.dwForceAttack, 5, 'int')
        setTimeout(() => Memory.writeMemory(process.processHandle, process.client + process.offsets.signatures.dwForceAttack, 4, 'int'), 15)
      }
    })

    console.log('autopistol enabled...')
  },
  
  disable ()
  {
    clearInterval(this.loopInterval)
    this.active = false
    process.cfg.misc.autopistol = false

    console.log('autopistol disabled...')
  }
}