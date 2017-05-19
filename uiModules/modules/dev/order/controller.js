"use strict";
var petStoreApp = soajsApp.components;

petStoreApp.controller('ordersDevCtrl', ['$scope', 'ngDataApi', 'orderDevHelper',
	function ($scope,ngDataApi, orderDevHelper) {
		
		$scope.$parent.isUserLoggedIn();
		
		$scope.access = {};
		constructModulePermissions($scope, $scope.access, orderDevConfig.permissions);
		$scope.orders = angular.extend($scope);
		$scope.orders.startLimit = 0;
		$scope.orders.totalCount = 0;
		$scope.endLimit = orderDevConfig.apiEndLimit;
		$scope.$parent.$on('reloadOrders', function (event) {
			$scope.orders.listOrders(true);
		});
		
		$scope.orders.getMore = function (startLimit) {
			$scope.orders.startLimit = startLimit;
			$scope.orders.listOrders(false);
		};
		
		$scope.orders.listOrders = function (firstCall) {
			if (firstCall) {
				$scope.orders.pageActive = 1;
				$scope.orders.totalPagesActive = Math.ceil($scope.orders.totalCount / $scope.endLimit);
				orderDevHelper.listOrders($scope.orders, orderDevConfig.orders, firstCall);
			}
			else {
				orderDevHelper.listOrders($scope.orders, orderDevConfig.orders, firstCall);
			}
		};
		
		$scope.orders.confirmOrder = function (data) {
			orderDevHelper.confirmOrder($scope.orders, orderDevConfig.orders, data, true);
		};
		
		$scope.orders.rejectOrder = function (data) {
			orderDevHelper.rejectOrder($scope.orders, data);
		};
		
		$scope.orders.refresh = function () {
			$scope.orders.startLimit = 0;
			$scope.orders.listOrders(true);
		};
		
		//call default method
		setTimeout(function () {
			if ($scope.access.order.list) {
				$scope.orders.listOrders(true);
			}
		}, 50);
		
	}]);
