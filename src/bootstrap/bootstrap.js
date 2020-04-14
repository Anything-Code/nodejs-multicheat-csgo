const Memory = require('memoryjs')
const Keyboard = require('iohook')
const Keycode = require('keycode')

const Config = require('../data/config')
const Server = require('../server/server')

const Glow = require('../features/glow')
const Radar = require('../features/radar')
const NoFlash = require('../features/noFlash')
const Autopistol = require('../features/autopistol')
const Bunnyhop = require('../features/bunnyhop')

module.exports = class Bootstrap
{
  constructor ()
  {
    process.cfg = Config
    this.gameIsRunning = false
    this.gameClosedAtStart = true
    this.listenForGameState()
    this.server = new Server
  }

  listenForGameState ()
  {
    this.processStateInterval = setInterval(() => {
      this.processFound('csgo.exe').then(message => {
        if (!this.gameIsRunning) {
          this.gameIsRunning = true
          console.log(message)
          this.listenForKeyboardInput()
        }
      }).catch(error => {
        if (this.gameIsRunning) {
          this.gameIsRunning = false
          this.gameClosedAtStart = false
          console.log('"csgo.exe" was closed. Terminating Process...')
          process.exit()
        } else if (!this.gameIsRunning && this.gameClosedAtStart) {
          this.gameClosedAtStart = false
          console.log(error)
        }
      })
    }, 200)
  }

  processFound (processName)
  {
    return new Promise((resolve, reject) => {
      if (Memory.getProcesses().find(singleProcess => {
          return singleProcess.szExeFile === processName
        }) != undefined) {
        let csProcess = Memory.openProcess(processName),
          clientModule = Memory.findModule('client_panorama.dll', csProcess.th32ProcessID)
        this.processhandle = csProcess.handle
        this.client = clientModule.modBaseAddr
        resolve(processName + ' found')
      } else reject(processName + ' not found, please start ' + processName)
    })
  }

  listenForKeyboardInput ()
  {
    if (process.cfg.visuals.glow) this.toggleCheat('glow')
    if (process.cfg.visuals.noFlash) this.toggleCheat('noFlash')
    if (process.cfg.visuals.radar) this.toggleCheat('radar')
    if (process.cfg.misc.autopistol) this.toggleCheat('autopistol')
    if (process.cfg.misc.bunnyhop) this.toggleCheat('bunnyhop')

    console.log('Press F12 to toggle anything you have activated on/off')

    this.server.socketIo.on('connection', socket => {
      socket.on('config transmitted', config => {
        if (config.glow) this.toggleCheat('glow')
        else if (config.noFlash) this.toggleCheat('noFlash')
        else if (config.radar) this.toggleCheat('radar')
        else if (config.autopistol) this.toggleCheat('autopistol')
        else if (config.bunnyhop) this.toggleCheat('bunnyhop')
      })
      socket.on('route changed', data => {
        this.server.socketIo.emit('config transmitted', process.cfg)
      })
    })
    Keyboard.on('keydown', key => {
      if (Keycode(key.rawcode) === 'f12' && this.gameIsRunning) {
        if (this.panic) {
          if (this.glow !== undefined && this.cachedCfg.visuals.glow === true) {
            this.glow.enable()
          }
          if (this.noFlash !== undefined && this.cachedCfg.visuals.noFlash === true) {
            this.noFlash.enable()
          }
          if (this.radar !== undefined && this.cachedCfg.visuals.radar === true) {
            this.radar.enable()
          }
          if (this.autopistol !== undefined && this.cachedCfg.misc.autopistol === true) {
            this.autopistol.enable()
          }
          if (this.bunnyhop !== undefined && this.cachedCfg.misc.bunnyhop === true) {
            this.bunnyhop.enable()
          }

          this.panic = false
        } else {
          this.cachedCfg = JSON.parse(JSON.stringify(process.cfg))

          if (this.glow !== undefined && this.glow.activated) {
            this.glow.disable()
          }
          if (this.noFlash !== undefined && this.noFlash.activated) {
            this.noFlash.disable()
          }
          if (this.radar !== undefined && this.radar.activated) {
            this.radar.disable()
          }
          if (this.autopistol !== undefined && this.autopistol.activated) {
            this.autopistol.disable()
          }
          if (this.bunnyhop !== undefined && this.bunnyhop.activated) {
            this.bunnyhop.disable()
          }

          this.panic = true
        }

        this.server.socketIo.emit('config transmitted', process.cfg)
      }
    })
    Keyboard.start()
  }

  toggleCheat (type)
  {
    switch (type) {
      case 'glow':
        if (this.glow === undefined) {
          this.glow = new Glow(this.processhandle, this.client)
        } else if (this.glow.activated) {
          this.glow.disable()
        } else {
          this.glow.enable()
        }
        this.server.socketIo.emit('config transmitted', process.cfg)
        break;
      case 'radar':
        if (this.radar === undefined) {
          this.radar = new Radar(this.processhandle, this.client)
        } else if (this.radar.activated) {
          this.radar.disable()
        } else {
          this.radar.enable()
        }
        this.server.socketIo.emit('config transmitted', process.cfg)
        break;
      case 'noFlash':
        if (this.noFlash === undefined) {
          this.noFlash = new NoFlash(this.processhandle, this.client)
        } else if (this.noFlash.activated) {
          this.noFlash.disable()
        } else {
          this.noFlash.enable()
        }
        this.server.socketIo.emit('config transmitted', process.cfg)
        break;
      case 'autopistol':
        if (this.autopistol === undefined) {
          this.autopistol = new Autopistol(this.processhandle, this.client)
        } else if (this.autopistol.activated) {
          this.autopistol.disable()
        } else {
          this.autopistol.enable()
        }
        this.server.socketIo.emit('config transmitted', process.cfg)
        break;
      case 'bunnyhop':
        if (this.bunnyhop === undefined) {
          this.bunnyhop = new Bunnyhop(this.processhandle, this.client)
        } else if (this.bunnyhop.activated) {
          this.bunnyhop.disable()
        } else {
          this.bunnyhop.enable()
        }
        this.server.socketIo.emit('config transmitted', process.cfg)
        break;
    }
  }
}