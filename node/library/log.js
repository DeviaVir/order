
/**
 * Module dependencies.
 */

var lastError = null, toArray = function (enu) {
  var arr = [];

  for (var i = 0, l = enu.length; i < l; i++)
    arr.push(enu[i]);

  return arr;
};

/**
 * Log levels.
 */

var levels = [
    'error' // 0
  , 'pass' // 1
  , 'warn' // 2 
  , 'info' // 3
  , 'debug' // 4
];

/**
 * Colors for log levels.
 */

var colors = [
    31
  , 32
  , 33
  , 36
  , 90
];

/**
 * Pads the nice output to the longest log level.
 */

function pad (str) {
  var max = 0;

  for (var i = 0, l = levels.length; i < l; i++)
    max = Math.max(max, levels[i].length);

  if (str.length < max)
    return str + new Array(max - str.length + 1).join(' ');

  return str;
};

/**
 * Logger (console).
 *
 * @api public
 */

var Logger = module.exports = function (opts) {
  opts = opts || {}
  this.colors = false !== opts.colors;
  this.level = 4;
  this.enabled = true;
};

/**
 * Log method.
 *
 * @api public
 */

Logger.prototype.log = function (type) {
  var index = levels.indexOf(type);

  if (index > this.level || !this.enabled)
    return this;

  console.log.apply(
      console
    , [( this.colors
        ? '   \033[' + colors[index] + 'm' + pad(type) + ' -\033[39m'
        : type + ':' ), ( new Date().getDate() <= 9 ? '0' + new Date().getDate() : new Date().getDate() ) + '/' + ( new Date().getMonth() <= 9 ? '0' + new Date(). getMonth() : new Date().getMonth() ) + ' - ' + ( new Date().getHours() <= 9 ? '0' + new Date().getHours() : new Date().getHours() ) + ':' + ( new Date().getMinutes() <= 9 ? '0' + new Date().getMinutes() : new Date().getMinutes() )
      ].concat(toArray(arguments).slice(1))
  );

  return this;
};

/**
 * Generate methods.
 */

levels.forEach(function (name) {
  Logger.prototype[name] = function () {
    this.log.apply(this, [name].concat(toArray(arguments)));
  };
});