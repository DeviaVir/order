'use strict';

orderApp.controller( 'WaiterCtrl', ['$scope', '$location', 'Socket', 'Order', function( $scope, $location, Socket, Order ) {
	Order.getProducts( 'all', function( result, data ) {
		if( true === result ) {
			$scope.products = data.data;
			$scope.$apply();
		}
	});

	$scope.add = function addToQueue( product ) {
		Order.queue( product, function( result, response ) {
			$scope.alert( 'Added to production!', 'success' );
		});
	};
}])