'use strict';

orderApp.controller( 'ManagerCtrl', ['$scope', '$location', 'Socket', 'Order', function( $scope, $location, Socket, Order ) {
  // Do stuff
}]).config(function ($routeProvider) {
  $routeProvider
    .when('/manager/products', {
      templateUrl: 'views/manager/product-list.html',
      controller: 'ManagerProductsCtrl'
    })
    .when('/manager/products/:productId', {
      templateUrl: 'views/manager/product-details.html',
      controller: 'ManagerProductsDetailCtrl'
    })
    .when('/manager/products/remove/:productId', {
      templateUrl: 'views/manager/product-details.html',
      controller: 'ManagerProductsRemoveCtrl'
    })
}).controller( 'ManagerProductsCtrl', ['$scope', '$location', 'Socket', 'Order', function( $scope, $location, Socket, Order ) {
	$scope.products = [];

	Order.getProducts( 'all', function( result, data ) {
		if( true === result ) {
			$scope.products = data.data;
			$scope.$apply();
		}
	});

}]).controller( 'ManagerProductsRemoveCtrl', ['$scope', '$routeParams', '$location', 'Socket', 'Order', function( $scope, $routeParams, $location, Socket, Order ) {
	$scope.product = {
		name: '',
		price: ''
	};

	$scope.edit = false;
	$scope.pid  = $routeParams.productId;
	if( $scope.pid != 'add' )
		$scope.edit = true;

	Order.getProducts( $scope.pid, function( result, data ) {
		if( true === result && ('data' in data) && data.data.length ) {
			$scope.product = data.data[0];
			$scope.$apply();

			Order.removeProduct( data.data[0], function( result ) {
				if( true === result ) {
					$scope.$apply( $location.path( '/manager/products' ) );
				}
			});
		}
	});
}]).controller( 'ManagerProductsDetailCtrl', ['$scope', '$routeParams', '$location', 'Socket', 'Order', function( $scope, $routeParams, $location, Socket, Order ) {
	$scope.product = {
		name: '',
		price: ''
	};
	$scope.productions = ['kitchen', 'bar'];

	$scope.edit = false;
	$scope.pid  = $routeParams.productId;
	if( $scope.pid != 'add' )
		$scope.edit = true;

	if( true === $scope.edit ) {
		Order.getProducts( $scope.pid, function( result, data ) {
			if( true === result && ('data' in data) && data.data.length ) {
				$scope.product = data.data[0];

				$scope.$apply();
			}
		});
	}

	$scope.do = function( product ) {
		Order.addProduct( product, function(result, data) {
			if( true === result ) {
				$scope.$apply( $location.path( '/manager/products' ) );
			}
		});
	};
}]);