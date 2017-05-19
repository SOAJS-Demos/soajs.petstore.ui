"use strict";
var storeService = soajsApp.components;
storeService.service('storePets', ['ngDataApi', '$timeout', '$modal', function (ngDataApi, $timeout, $modal) {
	function listPets(currentScope) {
		if (currentScope.access.list) {
			getSendDataFromServer(currentScope, ngDataApi, {
				"method": "get",
				"routeName": "/petstore/pets"
			}, function (error, response) {
				if (error) {
					currentScope.$parent.displayAlert('danger', error.message);
				}
				else {
					if (response) {
						delete response.soajsauth;
						currentScope.pets = response;
					}
					else {
						currentScope.$parent.displayAlert('danger', 'unable fetching pets from db');
					}
				}
			});
		}
	}
	
	function addPet(currentScope) {
		if (currentScope.access.add) {
			var formConf;
			formConf = petStoreConfig.form;
			var options = {
				timeout: $timeout,
				form: formConf,
				name: 'addPet',
				label: 'Add New Pet',
				actions: [
					{
						'type': 'submit',
						'label': translation.submit[LANG],
						'btn': 'primary',
						'action': function (formData) {
							
							var breed = formData.breed;
							var name = formData.name;
							var age = formData.age;
							var gender = formData.gender;
							var color = (formData.color) ? formData.color : "";
							var quantity = formData.quantity;
							var price = formData.price;
							var photoUrls = (formData.photoUrls) ? formData.photoUrls : "";
							var description = (formData.description) ? formData.description : "";
							
							var postData = {
								'pet': {
									'breed': breed,
									'name': name,
									'age': age,
									'gender': gender,
									'color': color,
									'quantity': quantity,
									'photoUrls': photoUrls,
									'price': price,
									'description': description
								}
							};
							
							getSendDataFromServer(currentScope, ngDataApi, {
								"method": "post",
								"routeName": "/petstore/pet",
								"data": postData
							}, function (error) {
								if (error) {
									currentScope.form.displayAlert('danger', error.message);
								}
								else {
									currentScope.$parent.displayAlert('success', "Added pet successfully");
									currentScope.modalInstance.close();
									currentScope.form.formData = {};
									currentScope.listPets();
								}
							});
						}
					},
					{
						'type': 'reset',
						'label': translation.cancel[LANG],
						'btn': 'danger',
						'action': function () {
							currentScope.modalInstance.dismiss('cancel');
							currentScope.form.formData = {};
						}
					}
				]
			};
			buildFormWithModal(currentScope, $modal, options);
		}
	}
	
	function editPet(currentScope, data) {
		if (currentScope.access.update) {
			var formConfig = angular.copy(petStoreConfig.form);
			formConfig.entries.forEach(function (entry) {
				if (entry.name === 'breed') {
					entry.type = 'readonly';
				}
			});
			var dataForm = {
				'breed': angular.copy(data.pet.breed),
				'name': angular.copy(data.pet.name),
				'age': angular.copy(data.pet.age),
				'gender': angular.copy(data.pet.gender),
				'color': angular.copy(data.pet.color),
				'quantity': angular.copy(data.pet.quantity),
				'price': angular.copy(data.pet.price),
				'photoUrls': angular.copy(data.pet.photoUrls),
				'description': angular.copy(data.pet.description)
			};
			
			var options = {
				timeout: $timeout,
				form: formConfig,
				name: 'editPet',
				label: 'Edit Pet',
				'data': dataForm,
				actions: [
					{
						'type': 'submit',
						'label': translation.submit[LANG],
						'btn': 'primary',
						'action': function (formData) {
							
							var breed = formData.breed;
							var name = formData.name;
							var age = formData.age;
							var gender = formData.gender;
							var color = (formData.color) ? formData.color : "";
							var quantity = formData.quantity;
							var price = formData.price;
							var photoUrls = (formData.photoUrls) ? formData.photoUrls : "";
							var description = (formData.description) ? formData.description : "";
							
							var postData = {
								'pet': {
									'breed': breed,
									'name': name,
									'age': age,
									'gender': gender,
									'color': color,
									'quantity': quantity,
									'photoUrls': photoUrls,
									'price': price,
									'description': description
								}
							};
							getSendDataFromServer(currentScope, ngDataApi, {
								"method": "put",
								"routeName": "/petstore/pet/" + data._id,
								"data": postData
							}, function (error) {
								if (error) {
									currentScope.form.displayAlert('danger', error.message);
								}
								else {
									currentScope.$parent.displayAlert('success', "Pet updated successfully");
									currentScope.modalInstance.close();
									currentScope.form.formData = {};
									currentScope.listPets();
								}
							});
						}
					},
					{
						'type': 'reset',
						'label': translation.cancel[LANG],
						'btn': 'danger',
						'action': function () {
							currentScope.modalInstance.dismiss('cancel');
							currentScope.form.formData = {};
						}
					}
				]
			};
			buildFormWithModal(currentScope, $modal, options);
		}
	}
	
	function removePet(currentScope, data) {
		if (currentScope.access.remove) {
			getSendDataFromServer(currentScope, ngDataApi, {
				"method": "delete",
				"routeName": "/petstore/pet/" + data._id
			}, function (error, response) {
				if (error) {
					currentScope.$parent.displayAlert('danger', error.message);
				}
				else {
					if (response) {
						currentScope.$parent.displayAlert('success', 'Pet deleted');
						currentScope.listPets();
					}
					else {
						currentScope.$parent.displayAlert('danger', 'Error while deleting');
					}
				}
			});
		}
	}
	
	return {
		'listPets': listPets,
		'addPet': addPet,
		'editPet': editPet,
		'removePet': removePet
	}
}]);
