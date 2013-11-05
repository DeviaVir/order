var db = require( './mysql' ).db
  , Organizations = exports = module.exports = {
  find: function( client, data, cb ) {
  	// Check for required post
    if( !data || Object.prototype.toString.call(data) != '[object Object]' )
      return cb( false, null, 500, 'Post data required (' + typeof data + ')' );
    if( !('host' in data) )
    	return cb( false, null, 500, 'Missing host in data' );

	  db.query( 'select * from organizations where name = ?', [data.host], function( err, res ) {
	    if( err ) {
	      return cb( false, null, 404, ( err.message || err.code ) );
	    }
	    else if( res.length == 1 ) {
        return cb( true, res[0] );
	    }
	    else {
	    	// add it
	    	var insert = {
	    		'name': new String( data.host ).toLowerCase().replace( ' ', '' )
	    	}

	    	var q = db.query( 'insert into organizations set ?', insert, function( err, res ) {
	    		if( err ) {
            log.error( err )
            return cb( false, null, 404, ( err.message || err.code ) );
          }
          else {
            if( res.insertId )
            	return cb( true, {
				        	'name': data.host
				        , 'id': res.insertId
			        });
          }
	    	});
	    }
	  });
	}
};