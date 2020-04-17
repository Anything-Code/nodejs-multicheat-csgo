const path = require('path')
const fs = require('fs')

const featuresPath = '../features/'
const directoryPath = path.join(__dirname, featuresPath)

let features = new Object,
    files = fs.readdirSync(directoryPath)

files.forEach(file => {
  features[capitalizeFirstLetter(file.split('.').shift())] = require(featuresPath + file)
})

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = features