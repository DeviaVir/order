//
// Order node
//

global.debug = function( type ) {
  log[( arguments.length == 1 ? 'debug' : type )](arguments[1] || type);
};

var Utils = require( './library/utils' )
  , Log = require( './library/log' )
  , Fs = require( 'fs' );

global.log = new Log();
// Define our killLogic. This used for development kill commands
function killLogic(){
  log.info( '[Kill] Shutting down' )
  process.exit(0);
};

// Clean shutdown
process.on('SIGINT', killLogic);
process.on('SIGHUP', killLogic);
process.on('uncaughtException', function uncaughtException( err ){
  log.error( 'Caught exception: ' + err );
  log.error( err.stack );
});

var MySQL = require( './library/mysql' );

MySQL.connect( function MySQLReady() {
	var Order = require( './library/order' );
	// Create socket
	require( './library/primus' );
});