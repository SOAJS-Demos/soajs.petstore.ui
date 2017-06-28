"use strict";
var cartApp = petStoreApp.components;

cartApp.controller('cartOrdersCtrl', ['$scope', '$cookieStore', '$timeout', '$location', 'ngDataApi', '$modal', '$localStorage', 'isUserLoggedIn', function ($scope, $cookieStore, $timeout, $location, ngDataApi, $modal, $localStorage, isUserLoggedIn) {
	/**
	 * get the pets in a user/guest cart
	 */
	$scope.listCart = function () {
		var userId;
		
		if ($localStorage.soajs_user && $localStorage.soajs_user._id) {
			userId = $localStorage.soajs_user._id;
		}
		else {
			userId = 'guest'
		}
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/orders/cart",
			"params": {"userId": userId}
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayFixedAlert('danger', error.message);
			}
			else {
				$scope.orders = response.items;
				$scope.count = response.count;
			}
		});
	};
	$scope.listCart();
	
	/**
	 * remove a pet from a cart
	 * @param order
	 */
	$scope.remove = function (order) {
		var userId;
		if ($localStorage.soajs_user && $localStorage.soajs_user._id) {
			userId = $localStorage.soajs_user._id;
		}
		else {
			order.userId = 'guest';
			order._id = order.petId;
		}
		getSendDataFromServer($scope, ngDataApi, {
			"method": "delete",
			"routeName": "/orders/cart/" + order._id,
			"params": {"userId": order.userId}
		}, function (error) {
			if (error) {
				$scope.$parent.displayFixedAlert('danger', error.message);
			}
			else {
				$scope.$parent.displayFixedAlert('success', "Removed successfully");
				$scope.$parent.$emit("loadUserInterface", {});
				$scope.listCart();
			}
		});
	};
	
	/**
	 * check out all the items in a user cart, in case of a guest it will redirect him to the login page
	 * @param orders
	 */
	$scope.checkout = function (orders) {
		if (!isUserLoggedIn()) {
			$scope.$parent.displayFixedAlert('danger', "You need to be logged in to checkout your cart!!");
			$scope.$parent.go('/login');
		} else {
			var config = angular.copy(confirmConfig.cart.form);
			
			var options = {
				timeout: $timeout,
				form: config,
				name: 'checkout',
				label: 'Checkout Order',
				actions: [
					{
						'type': 'submit',
						'label': 'save',
						'btn': 'primary',
						'action': function (formData) {
							overlayLoading.show();
							
							processOrders(0, formData, function(){
								$scope.modalInstance.close();
								$scope.listCart();
								$scope.$parent.$emit("loadUserInterface", {});
							});
								
							
							$scope.form.formData = {};
							$scope.$parent.displayFixedAlert('success', "Confirmed successfully");
						}
					},
					{
						'type': 'reset',
						'label': 'cancel',
						'btn': 'danger',
						'action': function () {
							$scope.modalInstance.dismiss('cancel');
							$scope.form.formData = {};
						}
					}
				]
			};
			buildFormWithModal($scope, $modal, options);
		}
		
		function processOrders(i,formData,  mCb){
			var quantity = orders[i].pet.quantity;
			var petId = orders[i].petId;
			var id = orders[i]._id;
			var opts = {
				"method": "post",
				"routeName": "/orders/cart/checkout/" + id,
				"params": {
					"petId": petId,
					"quantity": quantity,
					"userId": $localStorage.soajs_user._id
				},
				"data": {
					"infos": {
						"firstName": $localStorage.soajs_user.firstName,
						"lastName": $localStorage.soajs_user.lastName,
						"email": $localStorage.soajs_user.email,
						'phone': formData.phone
					}
				}
			};
			getSendDataFromServer($scope, ngDataApi, opts, function (error) {
				i++;
				overlayLoading.hide();
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					if(i === orders.length){
						return mCb();
					}
					else{
						processOrders(i, formData, mCb);
					}
				}
			});
		}
	};
}]);