const express = require('express')
const App = express()
const Http = require('http').Server(App)
const SocketIo = require('socket.io')(Http)
const Port = process.env.PORT || 80
App.use(express.static(__dirname + '/public'))

module.exports = class WebServer {
    constructor () {
        this.socketIo = SocketIo
        App.get('/', function(req, res){
            res.sendFile(__dirname + '/public/index.html')
        })
        Http.listen(Port, () => {
            console.log('type "localhost" in your steam-overlay-browser')
        })
    }
}
