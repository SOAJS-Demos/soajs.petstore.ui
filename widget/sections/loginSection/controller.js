"use strict";

loadJs('sections/loginSection/config.js', function () {
});

var myAccountApp = petStoreApp.components;

myAccountApp.controller('myAccountCtrl', ['$scope', '$timeout', 'ngDataApi', '$cookies', 'isUserLoggedIn', '$localStorage', '$modal',
	function ($scope, $timeout, ngDataApi, $cookies, isUserLoggedIn, $localStorage, $modal) {
		
		/**
		 * edit user profile in my account section
		 */
		$scope.editProfile = function () {
			$scope.user = $localStorage.soajs_user;
			var config = angular.copy(formConf.profileConfig);
			var options = {
				timeout: $timeout,
				size: 'sm',
				form: config,
				id: 'profileForm',
				name: 'profile',
				label: 'Edit Profile',
				data: {
					email: $scope.user.email,
					firstName: $scope.user.firstName,
					lastName: $scope.user.lastName,
					username: $scope.user.username
				},
				actions: [
					{
						'type': 'submit',
						'label': 'Save',
						'btn': 'orangeBorderLink',
						'action': function (formData) {
							var postData = {
								email: formData.email,
								firstName: formData.firstName,
								lastName: formData.lastName,
								username: formData.username
							};

							getSendDataFromServer($scope, ngDataApi, {
								"method": "send",
								"routeName": "/urac/account/editProfile",
								"data": postData,
								"params": {
									"uId": $scope.user._id
								}
							}, function (error) {
								if (error) {
									$scope.$parent.displayFixedAlert('danger', error.message);
								}
								else {
									$scope.$parent.displayFixedAlert('success', "Profile edited successfully");
									$scope.user.firstName = formData.firstName;
									$scope.user.username = formData.username;
									$scope.user.lastName = formData.lastName;
									$scope.$parent.$emit('refreshWelcome', {});
									$scope.modalInstance.close();
								}
							});
						}
					}
				]
			};
			buildFormWithModal($scope, $modal, options);
		};
		
		/**
		 * change email in my account section
		 */
		$scope.changeEmail = function () {
			var config = angular.copy(formConf.changeEmailConfig);
			var options = {
				timeout: $timeout,
				size: 'sm',
				form: config,
				'id': 'changeEmailForm',
				'name': 'changeEmail',
				label:'Change Email',
				data: {email: $scope.user.email},
				actions: [
					{
						'type': 'submit',
						'label': 'Change',
						'btn': 'orangeBorderLink',
						'action': function (formData) {
							var postData = {
								email: formData.newEmail
							};
							getSendDataFromServer($scope, ngDataApi, {
								"method": "post",
								"routeName": "/urac/account/changeEmail",
								"data": postData,
								"params": {
									"uId": $scope.user._id
								}
							}, function (error,response) {
								if (error) {
									$scope.$parent.displayFixedAlert('danger', error.message);
								}
								else {
									$scope.$parent.displayFixedAlert('success', 'A link will be sent to your new email address to validate the change.');
									$scope.modalInstance.close();
									$scope.form.formData = {};
								}
							});

						}
					}
				]
			};
			buildFormWithModal($scope, $modal, options);
		};
		
		/**
		 * change password in my account section
		 */
		$scope.changePassword = function () {
			var config = angular.copy(formConf.changePasswordConfig);
			var options = {
				timeout: $timeout,
				size: 'sm',
				form: config,
				'id': 'changePasswordForm',
				'name': 'changePassword',
				label: 'Change Password',
				actions: [
					{
						'type': 'submit',
						'label': 'Save',
						'btn': 'orangeBorderLink',
						'action': function (formData) {
							var postData = {
								password: formData.password,
								oldPassword: formData.oldPassword,
								confirmation: formData.confirmation
							};
							if (formData.password != formData.confirmation) {
								$scope.$parent.displayFixedAlert('danger', 'Your password and confirm password fields do not match!');
								return;
							}
							getSendDataFromServer($scope, ngDataApi, {
								"method": "send",
								"routeName": "/urac/account/changePassword",
								"data": postData,
								"params": {
									"uId": $scope.user._id
								}
							}, function (error) {
								if (error) {
									$scope.$parent.displayFixedAlert('danger', error.message);
								}
								else {
									$scope.$parent.displayFixedAlert('success', 'Password Updated Successfully.');
									$scope.modalInstance.close();
									$scope.form.formData = {};
								}
							});

						}
					}
				]
			};
			buildFormWithModal($scope, $modal, options);
		};
		if (isUserLoggedIn()) {
			$scope.user = $localStorage.soajs_user;
		}
		else {
			$scope.$parent.go("/login");
		}
	}]);
