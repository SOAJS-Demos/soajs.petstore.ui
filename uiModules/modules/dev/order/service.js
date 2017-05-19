"use strict";
var serviceUracApp = soajsApp.components;

serviceUracApp.service('orderDevHelper', ['ngDataApi', '$timeout', '$modal', function (ngDataApi, $timeout, $modal) {
	
	function listOrders(currentScope, moduleConfig, firstCall, callback) {
		var opts = {
			"method": "get",
			"routeName": "/orders/admin/orders",
			"params": {
				"start": currentScope.startLimit,
				"limit": currentScope.endLimit
			}
		};
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error, response) {
			if (error) {
				currentScope.$parent.displayAlert("danger", error.code, true, 'order', error.message);
			}
			else {
				currentScope.totalCount = response.count;
				currentScope.totalPagesActive = Math.ceil(currentScope.totalCount / currentScope.endLimit);
				if (callback && typeof(callback) === 'function') {
					return callback(response);
				}
				else {
					delete response.soajsauth;
					printOrders(currentScope, moduleConfig, response.records, firstCall);
				}
			}
		});
	}
	
	function printOrders(currentScope, moduleConfig, response, firsCall) {
		for (var x = response.length-1; x >= 0; x--) {
			if(response[x].infos) {
				response[x].name = response[x].pet.name;
				response[x].quantity = response[x].pet.quantity;
				response[x].price = response[x].pet.price;
				response[x].status = response[x].pet.status;
				response[x].firstName = response[x].infos ? response[x].infos.firstName : '';
				response[x].lastName = response[x].infos ? response[x].infos.lastName : '';
				response[x].email = response[x].infos ? response[x].infos.email : '';
				response[x].phone = response[x].infos ? response[x].infos.phone : '';
				response[x].pickupDate = response[x].pickupDate ? new Date(response[x].pickupDate).toDateString() : '';
			} else {
				response.splice(x,1);
			}
		}
		
		var options = {
			grid: moduleConfig.grid,
			data: response,
			defaultSortField: 'status',
			left: [],
			top: [],
			apiNavigation: {
				previous: {
					'label': 'Prev',
					'handler': 'getMore'
				},
				next: {
					'label': 'Next',
					'handler': 'getMore'
				},
				last: {
					'label': 'Last',
					'handler': 'getMore'
				}
			}
		};
		
		options.grid.navigation = {
			firsCall: firsCall,
			startLimit: currentScope.startLimit,
			totalCount: currentScope.totalCount,
			endLimit: currentScope.endLimit,
			totalPagesActive: currentScope.totalPagesActive
		};
		if (currentScope.access.order.confirm) {
			options.left.push({
				'label': 'Confirm Order',
				'icon': 'checkmark',
				'handler': 'confirmOrder'
			});
		}
		if (currentScope.access.order.reject) {
			options.left.push({
				'label': 'Reject Order',
				'icon': 'cross',
				'msg': 'Are you sure you want to reject this order?',
				'handler': 'rejectOrder'
			});
		}
		buildGrid(currentScope, options);
	}
	
	function confirmOrder(currentScope, moduleConfig, data) {
		if (data.status === 'pending') {
			var config = angular.copy(moduleConfig.form);
			
			var options = {
				timeout: $timeout,
				form: config,
				name: 'confirm',
				label: 'Confirm Order',
				actions: [
					{
						'type': 'submit',
						'label': 'save',
						'btn': 'primary',
						'action': function (formData) {
							overlayLoading.show();
							var opts = {
								"method": "post",
								"routeName": "/orders/order/" + data._id,
								"data": {
									'pickupDate': formData.pickupDate
								}
							};
							
							getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
								overlayLoading.hide();
								if (error) {
									currentScope.form.displayAlert('danger', error.code, true, 'order', error.message);
								}
								else {
									currentScope.$parent.displayAlert('success', 'Pickup Date added successfully');
									currentScope.modalInstance.close();
									currentScope.form.formData = {};
									currentScope.listOrders();
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
		} else {
			currentScope.$parent.displayAlert('danger', 'Order already confirmed');
		}
	}
	
	function rejectOrder(currentScope, data) {
		if (data.status !== 'ready') {
			getSendDataFromServer(currentScope, ngDataApi, {
				"method": "delete",
				"routeName": "/orders/order/" + data._id,
				"params": {"petId": data.petId}
			}, function (error, response) {
				if (error) {
					currentScope.$parent.displayAlert('danger', error.message);
				}
				else {
					if (response) {
						currentScope.$parent.displayAlert('success', 'Order rejected');
						currentScope.listOrders();
					}
					else {
						currentScope.$parent.displayAlert('danger', 'Error while rejecting');
					}
				}
			});
		} else {
			currentScope.$parent.displayAlert('danger', 'Cannot reject order because it is already confirmed');
		}
		
	}
	
	return {
		'listOrders': listOrders,
		'printOrders': printOrders,
		'confirmOrder': confirmOrder,
		'rejectOrder': rejectOrder
	};
}]);