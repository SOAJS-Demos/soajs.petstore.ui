"use strict";
var homepageApp = petStoreApp.components;

homepageApp.controller('homepageCtrl', ['$scope', 'ngDataApi', '$localStorage', 'isUserLoggedIn', function ($scope, ngDataApi, $localStorage, isUserLoggedIn) {
	$scope.$parent.$emit("loadUserInterface", {});
	
	/**
	 * list all the pets in the store
	 */
	$scope.list = function () {
		getSendDataFromServer($scope, ngDataApi, {
			"method": "get",
			"routeName": "/petstore/pets"
		}, function (error, response) {
			if (error) {
				$scope.$parent.displayFixedAlert('danger', error.message);
			}
			else {
				$scope.pets = response;
				delete $scope.pets.soajsauth;
			}
		});
	};
	$scope.list();
	
	/**
	 * add item to a user/guest cart and checks if the quantity is available
	 * @param pet
	 * @param id
	 */
	$scope.addToCart = function (pet, id) {
		var formData = {};
		var cartQty = 0;
		formData.pet = pet.pet;
		var userId;
		if ($localStorage.soajs_user && $localStorage.soajs_user._id) {
			userId = $localStorage.soajs_user._id;
		}
		else {
			userId = 'guest';
		}
		for (var i=0; i<$localStorage.cart.length; i++){
			if(pet._id === $localStorage.cart[i].petId){
				cartQty = $localStorage.cart[i].pet.quantity;
				break;
			}
		}
		var qty = parseInt(document.getElementById("quantity" + id).value);
		if (pet.pet.quantity >= qty + cartQty) {
			formData.pet.quantity = qty;
			getSendDataFromServer($scope, ngDataApi, {
				"method": "post",
				"routeName": "/orders/cart",
				"data": formData,
				"params": {
					petId: pet._id,
					userId: userId
				}
			}, function (error) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					$scope.list();
					$scope.$parent.$emit("loadUserInterface", {});
					
				}
			});
		} else {
			$scope.$parent.displayFixedAlert('danger', "Quantity unavailable in stock");
		}
	};
}]);
