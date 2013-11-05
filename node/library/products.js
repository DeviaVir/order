var db = require( './mysql' ).db
  , primus = require( './primus' ).primus
  , Organizations = require( './organizations' )
  , Products = exports = module.exports = {
  queue: function( client, data, cb ) {
  	if( !data || Object.prototype.toString.call(data) != '[object Object]' )
  		return cb( false, null, 500, 'Post data required (' + typeof data + ')' );


  	if( data.product.kitchen == '1' ) {
	  	var insert = {
	  		  pid: data.product.pid
	  		, oid: data.product.oid
	  		, production: 'kitchen'
	  		, state: 0
	  		, date: new Date().getTime()
	  	};
      if( data.product.bar == '0' )
  	  	add( insert, cb );
      else
        add( insert );
	  }

	  if( data.product.bar == '1' ) {
	  	var insert = {
	  		  pid: data.product.pid
	  		, oid: data.product.oid
	  		, production: 'bar'
	  		, state: 0
	  		, date: new Date().getTime()
	  	};
	  	add( insert, cb );
	  }


  	function add(insert, cb) {
	  	db.query( 'insert into queue set ?', insert, function( err, res ) {
	  		if( err ) {
	        log.error( err )
          if( cb && (typeof cb == 'function') )
  	        return cb( false, null, 500, ( err.message || err.code ) )
          return false;
	      }
	      else {
          // Emit to organization connected nodes
          primus.forEach( function (spark, id, connections) {
            Organizations.find( null, { host: spark.headers.origin.split('/')[2].split('.')[0] }, function(result, data) {
              if( false === result || !('oid' in data) || data.oid != insert.oid ) return;
              spark.write({
                  'method': 'queued'
                , 'data': insert
              });
            });
          });

	      	if( cb && (typeof cb == 'function') )
	      		return cb( true, data.product );
	      	return true;
	      }
	  	})
	  }
  },
  remove: function( client, data, cb ) {
  	if( !data || Object.prototype.toString.call(data) != '[object Object]' )
  		return cb( false, null, 500, 'Post data required (' + typeof data + ')' );

  	db.query( 'delete from products where oid = ? and pid = ?', [data.product.oid, data.product.pid], function( err, res ) {
  		if( err ) {
  			return cb( false, null, 500, ( err.message || err.code ) );
  		}
  		else {
  			return cb( true, res );
  		}
  	})
  },
  fetch: function( client, data, cb ) {
  	if( !data || Object.prototype.toString.call(data) != '[object Object]' )
  		return cb( false, null, 500, 'Post data required (' + typeof data + ')' );

  	db.query( 'select * from products where oid = ?' + ( ('id' in data) && data.id != 'all' ? ' and pid = ?' : '' ), ('id' in data  && data.id != 'all' ? [data.oid, data.id] : data.oid ), function( err, res ) {
  		if( err ) {
  			return cb( false, null, 500, ( err.message || err.code ) );
  		}
  		else if( !res.length ) {
  			return cb( false, null, 404, 'Not found' );
  		}
  		else if( res.length ) {
  			return cb( true, res );
  		}
  	});
  },
  edit: function( client, data, cb ) {
  	// Check for required post
    if( !data || Object.prototype.toString.call(data) != '[object Object]' )
      return cb( false, null, 500, 'Post data required (' + typeof data + ')' );
    if( !('product' in data) || Object.prototype.toString.call(data.product) != '[object Object]' )
      return cb( false, null, 500, 'Post data required (' + typeof data + ')' );
    if( !('name' in data.product) )
    	return cb( false, null, 500, 'Missing name in data' );
    if( !('price' in data.product) )
    	return cb( false, null, 500, 'Missing price in data' );
    if( !('pid' in data.product) )
    	return cb( false, null, 500, 'Missing id in data' );

    db.query( 'select * from products where pid = ? and oid = ?', [data.product.pid, data.product.oid], function( err, res ) {
    	if( err ) {
        return cb( false, null, 500, ( err.message || err.code ) );
      }
      else if( !res.length ) {
        return cb( false, null, 404, 'Not found' );
      }
      else if( res.length ) {
      	var product;
      	Object.keys( res[0] ).forEach( function( v, i ) {
      		if( !(v in data.product) )
      			data.product[(v)] = res[0][(v)];
      	})
      	Products.add( client, data, cb );
      }
    });
  },
  add: function( client, data, cb ) {
  	// Check for required post
    if( !data || Object.prototype.toString.call(data) != '[object Object]' )
      return cb( false, null, 500, 'Post data required (' + typeof data + ')' );
    if( !('product' in data) || Object.prototype.toString.call(data.product) != '[object Object]' )
      return cb( false, null, 500, 'Post data required (' + typeof data + ')' );
    if( !('name' in data.product) )
    	return cb( false, null, 500, 'Missing name in data' );
    if( !('price' in data.product) )
    	return cb( false, null, 500, 'Missing price in data' );

    var edit = false;
    if( ('pid' in data.product) ) {
    	edit = true;
    }

    var q = db.query( ( edit ? 'update' : 'insert into' ) + ' products set ?' + ( edit ? ' where pid = ? and oid = ?' : '' ), ( edit ? [data.product, data.product.pid, data.product.oid] : data.product ), function( err, res ) {
    	if( err ) {
        log.error( err )
        return cb( false, null, 500, ( err.message || err.code ) )
      }
      else {
      	if( !edit && res.insertId )
      		data.product.pid = res.insertId;

      	if( cb && (typeof cb == 'function') )
      		return cb( true, data.product );
      	return true;
      }
    });
	}
};