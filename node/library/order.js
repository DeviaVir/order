//
// Order system
//

var events        = require( 'events' )
  , util          = require( 'util' )
  , Organizations = require( './organizations' )
  , Products      = require( './products' )
  , Order = function Order( socket, ip ) {

  events.EventEmitter.call(this);
  socket.instance         = this; 
  this.connection         = socket;
  this.id                 = socket.id;
  this.ip                 = ( ip ? ip : socket.address.ip );
  this.data               = {};

  var instance = this;
  socket.on( 'data', function receivedSocketData(data) {
    if( Object.prototype.toString.call(data) == '[object Object]'
     && 'string' == typeof data.method ) {
      var eventName = data.method.replace( / /g, '_' ).replace( ':', '' );
      if( instance[( '__' + eventName )] == undefined )
        log.warn( '[Order] Method ' + eventName + ' not found' );
      else
        instance[ '__' + eventName ](data.data, data);
    }	
  });
  socket.__instance_disconnect = function() {
    instance.__disconnect();
  };
};

util.inherits(Order, events.EventEmitter);

Order.prototype.__helo = function( data, requestData ) {
  var instance = this
    , dataBuffer = instance.buffer(arguments[1])
    , req = instance.normalize(data, dataBuffer);

  instance.response.apply( instance, [ 'helo', dataBuffer, req.internal, true, {
      'msg': 'Order ' + require( 'os' ).hostname() + ' Server'
    , 'version': 1
  }] );
};

Order.prototype.__find_host = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Organizations.find( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'find host', dataBuffer, req.internal ].concat( toArray(arguments) ))
  });
};

Order.prototype.__product_add = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Products.add( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'product add', dataBuffer, req.internal ].concat( toArray(arguments) ))
  });
};

Order.prototype.__product_edit = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Products.edit( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'product edit', dataBuffer, req.internal ].concat( toArray(arguments) ))
  });
};

Order.prototype.__product_remove = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Products.remove( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'product remove', dataBuffer, req.internal ].concat( toArray(arguments) ))
  });
};

Order.prototype.__products = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Products.fetch( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'products', dataBuffer, req.internal ].concat( toArray(arguments) ))
  });
};

Order.prototype.__queue = function( data, requestData ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  Products.queue( instance, req.data, function( ok, response, code, msg, field ) {
    instance.response.apply(instance, [ 'queue', dataBuffer, req.internal ].concat( toArray(arguments) ))
  })
};

Order.prototype.response = function( method, verifyData, internalData, success, result, code, msg, field ) {
  if( success === false ) {
    log.warn( '[Order] ' + method + ' failed on error ' + code + ' with ' + msg );
    if( field )
      log.warn( '[Order] ' + field );
  }

  var response = {
      'result': ( success === true ? 'success' : 'error' )
    , 'method': method
  };

  if( success === true ) {
    response.data = result;
  }
  else {
    response.data = {
        code: code
      , message: msg
      , field: field 
    };
  }

  if( Object.prototype.toString.call(verifyData) != '[object Object]' )
    verifyData = {};

  this.connection.write({
    'method': method,
    'data': response,
    'uniqueHash': ( 'uniqueHash' in verifyData ? verifyData[ 'uniqueHash' ] : '' )
  });
};

Order.prototype.__reconnect = function( data ) {
  var instance = this, dataBuffer = instance.buffer(arguments[1]), req = instance.normalize(data, dataBuffer);
  // Update ID
  if( data && ( 'id' in data ) )
    instance.id = data[ 'id' ];

  instance.response.apply(instance, [ 'reconnect', dataBuffer, req.internal ].concat( [true, {}] ));
};

Order.prototype.__disconnect = function disconnect() {
  var instance = this;
  instance.onDisconnect();
};
Order.prototype.__end = Order.prototype.__disconnect;

Order.prototype.buffer = function buffer( data ) {
  if( data == null || Object.prototype.toString.call(data) != '[object Object]' )
    return data;
  return JSON.parse(JSON.stringify(data));
};

Order.prototype.normalize = function normalize( data, dataBuffer ) {
  if( data == null || !dataBuffer )
    return { 'data': data, 'internal': {} };

  // Split packets base on there protocol
  if( ('__internal protocol' in dataBuffer) && dataBuffer[ '__internal protocol' ] ) {
    delete data[ '__internal protocol' ];
    return {
        'data': data
      , 'internal': dataBuffer[ '__internal protocol' ] 
    };
  }
  else {
    return {
        'data': data
      , 'internal': {} 
    };
  }
};

Order.prototype.onConnect = function connect() {
  log.debug( 'Order "' + this.getIP() + '" connected' );
  this.__helo(true);
};
Order.prototype.onDisconnect = function disconnect() {
  log.debug( 'order "' + this.getIP() + '" disconnected' );
};

Order.prototype.getIP = function() {
  return this.ip || null;
};
Order.prototype.getOrganizationId = function() {
  return parseInt(this.data[ 'oid' ]) || false;
};


// Exports
exports = module.exports = {
  'order': Order,
};