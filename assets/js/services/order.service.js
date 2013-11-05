function Order (Socket) {

  // Privates
  var privates = {
        host: ''
      , id: ''
  };

  // Getters
  function getOid (cb) {
    if( cb && (typeof cb == 'function' ) )
      return cb( privates.id );
    return privates.id;
  }

  function getProducts (id, cb) {
    Socket.emit( 'products', {id: id, oid: getOid()}, function( response ) {
      if( response && ('result' in response) && response.result == 'success' ) {
        if( cb && typeof cb == 'function' )
          return cb( true, response );
        return true;
      }
      else {
        if( cb && typeof cb == 'function' )
          return cb( false );
        return false;
      }
    });
  }

  // Functions
  function load ( host, cb ) {
    // Set the host
    privates.host = host;

    Socket.emit( 'find host', { host: host }, function( response ) {
      if( response && ('result' in response) && response.result == 'success' && ('data' in response) && ('oid' in response.data) ) {
        privates.id = response.data.oid;
      }
      else {
        if( cb && typeof cb == 'function' )
          return cb( false );
        return false;
      }

      if( cb && (typeof cb == 'function') )
        return cb( true, {
            host: privates.host
          , oid : privates.id
        } );
      return true; 
    });
  };


  // Queue
  function queue (product, cb) {
    if( !('oid' in product) )
      product.oid = getOid();

    Socket.emit( 'queue', {product: product}, function( response ) {
      if( response && ('result' in response) && response.result == 'success' ) {
        if( cb && typeof cb == 'function' )
          return cb( true, response );
        return true;
      }
      else {
        if( cb && typeof cb == 'function' )
          return cb( false );
        return false;
      }
    })
  }

  // Product functions
  function addProduct (product, cb) {
    if( !('oid' in product) )
      product.oid = getOid();

    Socket.emit( 'product ' + ( product.pid ? 'edit' : 'add' ), { product: product }, function( response ) {
      if( response && ('result' in response) && response.result == 'success' ) {
        if( cb && typeof cb == 'function' )
          return cb( true, response );
        return true;
      }
      else {
        if( cb && typeof cb == 'function' )
          return cb( false );
        return false;
      }
    });
  }

  function removeProduct (product, cb) {
    if( !('oid' in product) )
      product.oid = getOid();

    Socket.emit( 'product remove', {product: product}, function( response ) {
      if( response && ('result' in response) && response.result == 'success' ) {
        if( cb && typeof cb == 'function' )
          return cb( true, response );
        return true;
      }
      else {
        if( cb && typeof cb == 'function' )
          return cb( false );
        return false;
      }
    })
  }

  // Return functions
  return {
      load: load
    , getOid: getOid
    , getProducts: getProducts
    , addProduct: addProduct
    , removeProduct: removeProduct
    , queue: queue
  };
};