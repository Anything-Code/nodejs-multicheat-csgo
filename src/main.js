const Request = require('request')
const Colors = require('colors/safe');
const Bootstrap = require('./bootstrap')

Request.get('https://raw.githubusercontent.com/frk1/hazedumper/master/csgo.json', (error, response, body) => {
  if (error === null) {
    process.offsets = JSON.parse(body)
    console.log(Colors.green.bold('hazedumper\'s offsets were downloaded successfully'))
  } else {
    process.offsets = require('./offsets')
    console.log(Colors.yellow.bold('Appearently you are offline, hazedumper\'s offsets were loaded from a local dist'))
  }
  new Bootstrap
})