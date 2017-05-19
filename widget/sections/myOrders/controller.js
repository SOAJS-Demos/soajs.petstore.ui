"use strict";
var ordersApp = petStoreApp.components;

ordersApp.controller('ordersCtrl', ['$scope', 'ngDataApi', '$localStorage', function ($scope, ngDataApi, $localStorage) {
	/**
	 * list a user orders
	 */
	$scope.listOrders = function () {
		var userId;
		if ($localStorage.soajs_user && $localStorage.soajs_user._id) {
			userId = $localStorage.soajs_user._id;
		}
		else {
			userId = 'guest'
		}
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/orders/orders",
			"params": {"userId": userId}
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayFixedAlert('danger', error.message);
			}
			else {
				delete response.soajsoauth;
				$scope.orders = response;
				$scope.countOrders = response.length;
			}
		});
	};
	$scope.listOrders();
	
}]);