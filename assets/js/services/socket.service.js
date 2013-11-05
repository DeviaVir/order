function Socket (Primus) {

  // Privates
  var privates = {
      connection: null
    , connected: false
    , offline_message: null
    , timeoutUnlock: null
    , events: {}
    , callbackEmittor: {}
  };

  // Functions
  function create ( callback ) {
    var url = 'ws://localhost:4000';
    //var url = 'ws://node.order.sillevis.net';

    debug( '[Socket] Created new connection for host ' + url );
    privates.connection = new Primus(url, { });

    //
    privates.connection.on( 'data', function receivedData(data) {
      if( ('method' in data) ) {
        var method = data.method.replace( / /g, '_' ).replace( ':', '' );

        //debug( '[Connection] Received: ' + method );
        if( '__' + method in privates.events ) {
          privates.events[( '__' + method )](data.data);
        }
      }

      // Callback emittor, anyway
      if( 'uniqueHash' in data )
        emitCallback( data.method, data.data, data.uniqueHash );
    });

    //
    privates.connection.on( 'open', function onOpenConnection() {
      debug( '[Connection] Opened' );
      connect();
    });

    //
    privates.connection.on( 'close', function onClosedConnection() {
      debug( '[Connection] Closed' );
      disconnect();
    });

    //
    privates.connection.on( 'offline', function onOfflineConnection() {
      debug( '[Connection] User went offline' );
    });

    //
    privates.connection.on( 'online', function onOnlineConnection() {
      debug( '[Connection] User got back online' );
    });

    //
    privates.connection.on( 'error', function onErrorConnection(err) {
      debug( '[Connection] [Error] ' + err.message );
    });

    // Required, used too many times
    privates.connection.$emit = function backCompEventEmittor(method, data) {
      privates.connection.emit( 'data', {
          'method': method
        , 'data': data
      });
    };

    if( 'function' == typeof callback )
      callback(this);

    // Listen on this
    return privates.connection;
  };

  function checkConnection( $scope ) {
    $scope.connection = 'live';
    privates.connection.on( 'open', function onOpenConnection() {
      $scope.connection = 'live';
      $scope.$apply();
    });
    privates.connection.on( 'close', function onClosedConnection() {
      $scope.connection = 'offline';
      $scope.$apply();
    });
  };

  function listenForOrders( type, cb ) {
    privates.connection.on( 'data', function onQueue(data) {
      if( ('method' in data) ) {
        var method = data.method.replace( / /g, '_' ).replace( ':', '' );
        
        if( 'queued' === method && ('data' in data) ) {
          if( cb && (typeof cb == 'function') && type == data.data.production )
            cb( data.data );
        }
      }
    })
  }

  function connect() {
    if( privates.connected === true )
      return debug( WARN, '[Socket] Already connected' );

    debug( '[Socket] Connected with server' );
    privates.connected = true;
  };

  function message( data ) {
    privates.connection.$emit( data.method, data.data || {} );
  };

  function disconnect() {
    if( privates.connected === false )
      return debug( '[connection] Already offline' );

    privates.connected = false;
    debug( '[Socket] Disconnected from server' );
  };

  function emitCallback( method, data, uniqueHash ) {
    if( ( uniqueHash in privates.callbackEmittor )
     &&  privates.callbackEmittor[( uniqueHash )]
     && 'function' == typeof privates.callbackEmittor[( uniqueHash )] ) {
      privates.callbackEmittor[( uniqueHash )].apply( Socket, [data] )
      delete privates.callbackEmittor[( uniqueHash )];
    }
    else {
      if( privates.callbackEmittor[( method )] && 'function' != typeof privates.callbackEmittor[( method )] )
        debug( '[Socket] Wrong callback type for method (' + method + ') please check if provided type is function' );
    }
  };

  function emit( method, data, cb, ignore, updateLocal, uniqueHash, givenTime ) {
    if( updateLocal )
      localStorage.setItem( 'lastEmitTime', ( new Date().getTime() / 1000 | 0 ) );

    if( 'string' == typeof data )
      data = JSON.parse(data);

    if( !data )
      data = {};

    // Reuse unique hash for valid sync response
    if( !uniqueHash )
      uniqueHash = ( Object.keys(privates.callbackEmittor).length + '' + new Date().getTime() + '' + method + '' + new String( Math.random()*10 ).replace( '.', '' ) );

    // Check for valid callback fucntions
    if( cb && 'function' == typeof cb )
      privates.callbackEmittor[( uniqueHash )] = cb;
    else if( cb && 'function' != typeof cb )
      return warn( '[Socket] [Emit] Provided callback type is not a function' )

    send( method, data, ignore, uniqueHash, givenTime );
  };

  function send( method, data, ignore, uniqueHash, givenTime ) { // legacy
    if( 'string' == typeof data )
      data = JSON.parse(data);

    method = method.toLowerCase().replace( /_/g, ' ' )
    data = data || {};

    // Build up our JSON
    var dataSet = JSON.stringify({
        'method': method
      , 'data': data
      , 'its': ( givenTime || new Date().getTime() )
      , 'uniqueHash': ( uniqueHash || empty )
    });

    // Send directly if connected, otherwise, queue it
    debug( '[Socket] Emit to server: ' + method );
    privates.connection.write(JSON.parse(dataSet));
    delete dataSet;
  };

  return {
      create: create
    , connect: connect
    , disconnect: disconnect
    , emit: emit
    , emitCallback: emitCallback
    , message: message
    , send: send
    , connected: privates.connected
    , checkConnection: checkConnection
    , listenForOrders: listenForOrders
  };
};