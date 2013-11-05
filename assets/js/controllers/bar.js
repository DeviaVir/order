'use strict';

orderApp.controller( 'BarCtrl', ['$scope', '$location', 'Socket', 'Order', function( $scope, $location, Socket, Order ) {
	// Do stuff
	Socket.listenForOrders( 'bar', function( product ) {
		console.log( product );
	});
}])