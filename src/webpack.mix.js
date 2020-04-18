const Mix = require('laravel-mix')

Mix
  .setPublicPath('./')
  .js('ui/js/app.js', 'static')
  // .js('main.js', 'build')
  .sass('ui/sass/app.scss', 'static')