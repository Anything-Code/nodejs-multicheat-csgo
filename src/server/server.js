const express = require('express')
const history = require('connect-history-api-fallback')
const App = express()
const Http = require('http').Server(App)
const SocketIo = require('socket.io')(Http)
const Port = process.env.PORT || 80

App.use(history())
App.use('/', express.static('../src/static'))
App.use('/', express.static('build/static'))

module.exports = class WebServer
{
  constructor ()
  {
    this.socketIo = SocketIo
    Http.listen(Port, () => {
      console.log('type "localhost" in your steam-overlay-browser to open the menu')
    })
  }
}