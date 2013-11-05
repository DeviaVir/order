'use strict';

orderApp.controller( 'SiteCtrl', ['$scope', '$location', 'Socket', function( $scope, $location, Socket ) {
	// Set location and host for ease
	$scope.location = $location;
	$scope.host     = $location.$$host;	

	$scope.alert = function( msg, extra ) {
		var box
		  , extra = ( extra ? extra : '' );

		// Clean up previous
		$( '#main-header div .alert-box' ).remove();

		// Give feedback to the user
		$( '#main-header div' ).append(
			box = $( '<div />' ).attr( 'data-alert', 'data-alert' ).addClass( 'alert-box' + ( extra ? ' ' + extra : '' ) ).append(
				msg
			).append(
				$( '<a />' ).attr({
					'href': '#'
				  , 'class': 'close'
				}).html( '&times;' )
			)
		);

		setTimeout( function() {
			box.remove();
		}, 5000 );
	};
}])