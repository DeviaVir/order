
'use strict';

orderApp.factory('Primus', [function PrimusService() {
	return Primus;
}]);

orderApp.factory('Socket', ['Primus', function SocketService( Primus ) {
	return new Socket(Primus);
}]);

orderApp.factory('Order', ['Socket', function OrderService( Socket ) {
	return new Order(Socket);
}])