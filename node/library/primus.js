/*
* primus
*/

var http   = require( 'http' )
  , https  = require( 'https' )
  , url    = require( 'url' )
  , utils  = require( './utils' )
  , Primus = require( 'primus' )
  , server;

// Create HTTPS server or not
server = http.createServer(function(){});

var primus = new Primus(server, { transformer: 'socket.io', parser: 'JSON' })
  , Socket = primus.Socket;

// Events
primus.on( 'connection', function( Socket ) {
  var Order    = require( './order' ).order
    , instance = new Order( Socket )
  instance.onConnect()
});
primus.on( 'disconnection', function( Socket ) {
  Socket.__instance_disconnect();
});

//new Socket('http' + ( process.env[ 'NODE_ENV' ] == 'production' ? 's' : '' ) + '://localhost:' + ( Settings.socket.port + ( global.isTestMode ? 1 : 0 ) ));
server.listen( 4000 );

log.info( 'Awaiting clients on port 4000' );

// Exports
exports = module.exports = {
  'Primus': Primus,
  'primus': primus
};