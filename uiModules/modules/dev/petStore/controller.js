"use strict";

var petStoreApp = soajsApp.components;
petStoreApp.controller('storeCtrl', ['$scope', 'storePets', function ($scope, storePets) {
	
	$scope.$parent.isUserLoggedIn();
	
	$scope.access = {};
	constructModulePermissions($scope, $scope.access, petStoreConfig.permissions);
	$scope.listPets = function () {
		storePets.listPets($scope);
	};
	
	$scope.addPet = function () {
		storePets.addPet($scope);
	};
	
	$scope.editPet = function (data) {
		storePets.editPet($scope, data);
	};
	
	$scope.removePet = function (data) {
		storePets.removePet($scope, data);
	};
	
	//default operation
	if ($scope.access.list) {
		$scope.listPets($scope);
	}
}]);