const Memory = require('memoryjs')
const Keyboard = require('asynckeystate')
const Weapons = require('./weaponItemIndices')

module.exports = class Autopistol {
    constructor (processHandle, client) {
        this.processHandle = processHandle
        this.client = client
        this.enable()
    }
    currentWeapon () {
        let localPlayer = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwLocalPlayer, 'int'),
            localWeapon = Memory.readMemory(this.processHandle, localPlayer + process.offsets.netvars.m_hActiveWeapon, 'int'),
            duck = localWeapon & 0xFFF,
            horse = Memory.readMemory(this.processHandle, this.client + process.offsets.signatures.dwEntityList + (duck - 1) * 16, 'int'),
            cock = Memory.readMemory(this.processHandle, horse + process.offsets.netvars.m_iItemDefinitionIndex, 'int')
        return cock
    }
    isPistol (weaponIndex) {
        return weaponIndex == Weapons.WEAPON_DEAGLE || weaponIndex == Weapons.WEAPON_FIVESEVEN || weaponIndex == Weapons.WEAPON_GLOCK || weaponIndex == Weapons.WEAPON_P250 || weaponIndex == Weapons.WEAPON_USP_SILENCER || weaponIndex == Weapons.WEAPON_HKP2000 || weaponIndex == Weapons.WEAPON_TEC9 || weaponIndex == Weapons.WEAPON_ELITE
    }
    enable () {
        this.activated = true
        process.cfg.misc.autopistol = true
        console.log('autopistol enabled...')
        this.loopInterval = setInterval(() => {
            if (Keyboard.getAsyncKeyState(0x1) && this.isPistol(this.currentWeapon())) {
                Memory.writeMemory(this.processHandle, this.client + process.offsets.signatures.dwForceAttack, 5, 'int')
                setTimeout(() => Memory.writeMemory(this.processHandle, this.client + process.offsets.signatures.dwForceAttack, 4, 'int'), 15)
            }
        })
    }
    disable () {
        clearInterval(this.loopInterval)
        this.activated = false
        process.cfg.misc.autopistol = false
        console.log('autopistol disabled...')
    }
}