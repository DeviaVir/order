var Config = require( '../config' )
  , MySQL = require( 'mysql' );

exports = module.exports = mysql = {
  db: null,

  connect: function connect(cb, reconnect, username, password, name, host) {
    mysql.db = MySQL.createConnection({
        user: ( username || Config.username )
      , password: ( password || Config.password )
      , database: ( name || Config.name )
      , host: ( host || Config.host )
    });

    log.info( '[MySQL] Connecting..' );
    mysql.db.connect(function waitForConnection(){
      log.info( '[MySQL] Connection established' );
      if( 'function' == typeof cb )
        cb();
    });
    mysql.handleDisconnect();

    if( reconnect !== true ) {
      setInterval(function mysqlKeepalive(){
        mysql.db.query( 'SELECT 1', function( err, res ){ })
      }, ( 1000 * 14 ));
    }
  },

  handleDisconnect: function handleDisconnect() {
    mysql.db.on( 'error', function mysqlError(err) {
      if ( !err.fatal ) {
        log.error( '[MysQL] Error: ' + err );
        return;
      }

      debug( '[MySQL] Re-connecting lost connection: ' + err.stack );
      mysql.connect(null, true);
    });
  }
};