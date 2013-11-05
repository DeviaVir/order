'use strict';

orderApp.controller( 'KitchenCtrl', ['$scope', '$location', 'Socket', 'Order', function( $scope, $location, Socket, Order ) {
	// Do stuff
	Socket.listenForOrders( 'kitchen', function( product ) {
		console.log( product );
	});
}])