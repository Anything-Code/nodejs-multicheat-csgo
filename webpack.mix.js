const Mix = require('laravel-mix')

Mix
  .setPublicPath('./')
  .js('ui/js/app.js', 'static')
  .sass('ui/sass/app.scss', 'static')