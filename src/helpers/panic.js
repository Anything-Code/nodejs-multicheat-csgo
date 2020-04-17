const Keyboard = require('iohook')
const Keycode = require('keycode')

module.exports = (gameIsRunning, Features) => {
  let panic = false,
      cachedCfg = new Object

  console.log('Press F12 to toggle anything you have active on/off')

  Keyboard.on('keydown', key => {
    if (Keycode(key.rawcode) === 'f12' && gameIsRunning) {
      if (panic) {
        if (cachedCfg.visuals.glow.active === true) {
          Features.Glow.enable(process.cfg.visuals.glow)
        }
        if (cachedCfg.visuals.noFlash === true) {
          Features.NoFlash.enable()
        }
        if (cachedCfg.visuals.radar === true) {
          Features.Radar.enable()
        }
        if (cachedCfg.misc.autopistol === true) {
          Features.Autopistol.enable()
        }
        if (cachedCfg.misc.bunnyhop === true) {
          Features.Bunnyhop.enable()
        }

        panic = false
      } else {
        cachedCfg = JSON.parse(JSON.stringify(process.cfg))

        if (Features.Glow.active) {
          Features.Glow.disable()
        }
        if (Features.NoFlash.active) {
          Features.NoFlash.disable()
        }
        if (Features.Radar.active) {
          Features.Radar.disable()
        }
        if (Features.Autopistol.active) {
          Features.Autopistol.disable()
        }
        if (Features.Bunnyhop.active) {
          Features.Bunnyhop.disable()
        }

        panic = true
      }

      process.server.socketIo.emit('config transmitted', process.cfg)
    }
  })

  Keyboard.start()
}