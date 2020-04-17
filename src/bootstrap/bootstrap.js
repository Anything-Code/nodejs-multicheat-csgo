const Memory = require('memoryjs')

const Config = require('../data/config')
const Server = require('../server/server')

const listenForF12 = require('../helpers/panic')

const Features = require('../helpers/features')

module.exports = class Bootstrap
{
  constructor ()
  {
    process.cfg = Config
    this.cachedCfg = new Object

    this.gameIsRunning = false
    this.gameClosedAtStart = true
    process.server = new Server

    this.listenForGameState()
  }

  listenForGameState ()
  {
    this.processStateInterval = setInterval(() => {
      this.processFound('csgo.exe').then(message => {
        if (!this.gameIsRunning) {
          this.gameIsRunning = true
          console.log(message)
          this.listenForEvents()
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
    }, 600)
  }

  processFound (processName)
  {
    return new Promise((resolve, reject) => {
      if (Memory.getProcesses().find(singleProcess => {
          return singleProcess.szExeFile === processName
        }) !== undefined) {

        let csProcess = Memory.openProcess(processName),
          clientModule = Memory.findModule('client_panorama.dll', csProcess.th32ProcessID)

        process.processHandle = csProcess.handle
        process.client = clientModule.modBaseAddr

        resolve(processName + ' found')
      } else reject(processName + ' not found, please start ' + processName)
    })
  }

  listenForEvents ()
  {
    if (process.cfg.visuals.glow.active) this.toggleCheat('glow', process.cfg.visuals.glow)
    if (process.cfg.visuals.noFlash) this.toggleCheat('noFlash')
    if (process.cfg.visuals.radar) this.toggleCheat('radar')
    if (process.cfg.misc.autopistol) this.toggleCheat('autopistol')
    if (process.cfg.misc.bunnyhop) this.toggleCheat('bunnyhop')

    listenForF12(this.gameIsRunning, Features)

    process.server.socketIo.on('connection', socket => {
      socket.on('config transmitted', config => {
        if (config.glow) this.toggleCheat('glow', config.glow)
        else if (config.noFlash) this.toggleCheat('noFlash')
        else if (config.radar) this.toggleCheat('radar')
        else if (config.autopistol) this.toggleCheat('autopistol')
        else if (config.bunnyhop) this.toggleCheat('bunnyhop')
      })
      socket.on('route changed', data => {
        process.server.socketIo.emit('config transmitted', process.cfg)
      })
    })
  }

  toggleCheat (type, payload)
  {
    switch (type) {
      case 'glow':
        Features.Glow.active && !payload.active ? Features.Glow.disable() : Features.Glow.enable(payload)
        break
      case 'radar':
        Features.Radar.active ? Features.Radar.disable() : Features.Radar.enable()
        break
      case 'noFlash':
        Features.NoFlash.active ? Features.NoFlash.disable() : Features.NoFlash.enable()
        break
      case 'autopistol':
        Features.Autopistol.active ? Features.Autopistol.disable() : Features.Autopistol.enable()
        break
      case 'bunnyhop':
        Features.Bunnyhop.active ? Features.Bunnyhop.disable() : Features.Bunnyhop.enable()
        break
      default:
        process.server.socketIo.emit('config transmitted', process.cfg)
        break
    }
  }
}