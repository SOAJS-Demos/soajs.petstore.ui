"use strict";
var uracApp = petStoreApp.components;
var myWindow;

uracApp.controller('loginCtrl', [ '$scope', 'ngDataApi', '$cookies', 'isUserLoggedIn', '$localStorage', '$location', function ($scope, ngDataApi, $cookies, isUserLoggedIn, $localStorage, $location) {
	/**
	 * check if the url path is logout to clear all the data and rebuild the menu
	 */
	if ($location.$$path === "/logout") {
		var count = {
			clear: 0
		};
		$scope.$parent.$emit("cart", count);
		$cookies.remove('access_token');
		$cookies.remove('refresh_token');
		$cookies.remove('soajsID');
		$cookies.remove('soajs_auth');
		$cookies.remove('soajs_current_route');
		$cookies.remove('selectedInterval');
		$localStorage.soajs_user = null;
		$localStorage.acl_access = null;
		$scope.$parent.go("/login");
		$scope.$parent.rebuildMenu();
	}
	
	var formConfig = formConf.loginConfig;
	formConfig.actions = [ {
		'type': 'submit',
		'label': 'Login',
		'btn': 'primary',
		'action': function (formData) {
			var postData = {
				'username': formData.username,
				'password': formData.password,
				'grant_type': "password"
			};
			
			overlayLoading.show();
			var authValue;
			
			/**
			 * login using Oauth to generate the needed params
			 */
			function loginOauth () {
				var options1 = {
					"token": false,
					"method": "get",
					"routeName": "/oauth/authorization",
					"headers": {
						'key': apiConfiguration.key
					}
				};
				getSendDataFromServer($scope, ngDataApi, options1, function (error, response) {
					if (error) {
						overlayLoading.hide();
						$scope.$parent.displayFixedAlert('danger', error.message);
					}
					else {
						authValue = response.data;
						var options2 = {
							"method": "post",
							"routeName": "/oauth/token",
							"data": postData,
							"headers": {
								'accept': '*/*',
								"Authorization": authValue
							}
						};
						
						getSendDataFromServer($scope, ngDataApi, options2, function (error, response) {
							if (error) {
								overlayLoading.hide();
								$scope.$parent.displayFixedAlert('danger', "Wrong username or password");
							}
							else {
								if (Object.hasOwnProperty.call(response, "access_token")) {
									$cookies.put('access_token', response.access_token);
									$cookies.put('refresh_token', response.refresh_token);
								}
								uracLogin();
							}
						});
						
					}
				});
			}
			
			loginOauth();
			
			/**
			 * login using the access token generated from Oauth login
			 */
			function uracLogin () {
				var options = {
					"method": "get",
					"routeName": "/urac/account/getUser",
					"params": {
						'username': formData.username
					}
				};
				getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
					if (error) {
						overlayLoading.hide();
						$cookies.remove('access_token');
						$cookies.remove('refresh_token');
						$scope.$parent.displayFixedAlert('danger', error.message);
					}
					else {
						$localStorage.soajs_user = response;
						//get user keys
						mergeCart();
					}
				});
			}
			
			/**
			 * merge cart to the user cart in case of found records in the session
			 */
			function mergeCart () {
				getSendDataFromServer($scope, ngDataApi, {
					"method": "get",
					"routeName": "/orders/mergeCart",
					"params": { "userId": $localStorage.soajs_user._id }
				}, function (error, response) {
					if (error) {
						$scope.$parent.displayFixedAlert('danger', error.message);
					}

					$scope.$parent.$emit("loadUserInterface", {});
					$scope.$parent.go('/');
				});
			}
		}
	} ];
	if (!isUserLoggedIn()) {
		buildForm($scope, null, formConfig);
	}
	else {
		$scope.$parent.go('/');
	}
	
	function openWindow (path) {
		myWindow = window.open(path, "", "scrollbars=yes,resizable=yes,width=800,height=700");
	}
	
	/**
	 * set login with facebook passport path
	 */
	$scope.loginFacebook = function () {
		var path = apiConfiguration.domain + '/urac/passport/login/facebook?key=' + apiConfiguration.key;
		openWindow(path);
	};
	
	/**
	 * set login with twitter passport path
	 */
	$scope.loginTwitter = function () {
		var path = apiConfiguration.domain + '/urac/passport/login/twitter?key=' + apiConfiguration.key;
		openWindow(path);
	};
	
	/**
	 * set login with google passport path
	 */
	$scope.loginGoogle = function () {
		var path = apiConfiguration.domain + '/urac/passport/login/google?key=' + apiConfiguration.key;
		openWindow(path);
	};
	
} ]);

uracApp.controller('customLoginCntrl', [ '$scope', 'ngDataApi', '$cookies', '$routeParams', '$location', '$localStorage',
	function ($scope, ngDataApi, $cookies, $routeParams, $location, $localStorage) {
		var code = $location.search().code;
		var oauth_token = $location.search().oauth_token;
		$scope.strategy;
		$scope.successLogin = false;

		function mergeCart () {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/orders/mergeCart",
				"params": { "userId": $localStorage.soajs_user._id }
			}, function (error, response) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				$scope.$parent.$emit('loadUserInterface', {});
			});
		}
		
		/**
		 * close the new window after login and set the local storage needed values
		 * @param response
		 */
		function afterLogin (response) {
			var host = $location.host();
			$scope.successLogin = true;
			function closeWin () {
				window.opener.location.href = host;
				setTimeout(function () {
					window.close();
				}, 2000);
			}

			$localStorage.soajs_user = response;
			if (Object.hasOwnProperty.call(response, "accessTokens")) {
				$cookies.put('access_token', response.accessTokens.access_token);
				$cookies.put('refresh_token', response.accessTokens.refresh_token);
			}
			setTimeout(function () {
				mergeCart();
				closeWin();
			}, 300);
		}
		
		/**
		 * login with facebook passport
		 */
		$scope.loginFacebook = function () {
			$scope.strategy = 'facebook';
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/passport/validate/facebook?code=" + code
			}, function (error, response) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					afterLogin(response);
				}
			});
		};
		
		/**
		 * login with twitter passport
		 */
		$scope.loginTwitter = function () {
			$scope.strategy = 'twitter';
			var oauth_verifier = $location.search().oauth_verifier;
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/passport/validate/twitter?oauth_token=" + oauth_token + "&oauth_verifier=" + oauth_verifier
			}, function (error, response) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					afterLogin(response);
				}
			});
		};
		
		/**
		 * login with google passport
		 */
		$scope.loginGoogle = function () {
			$scope.strategy = 'google';
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/passport/validate/google?code=" + code
			}, function (error, response) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					afterLogin(response);
				}
			});
		};
		
		if (oauth_token) {
			$scope.loginTwitter();
		}
		else if (code) {
			var mode = $location.search().mode;
			if (mode === "facebook") {
						$scope.loginFacebook();
				} else {
				$scope.loginGoogle();
			}
		}
		
	} ]);

uracApp.controller('registerCntrl', [ '$scope', '$timeout', 'ngDataApi', '$cookies', 'isUserLoggedIn', '$localStorage', '$location',
	function ($scope, $timeout, ngDataApi, $cookies, isUserLoggedIn, $localStorage, $location) {
		$scope.$parent.$emit("loadUserInterface", {});
		
		/**
		 * register form where the user create a new account
		 */
		function openForm () {
			var formConfig = formConf.registerConfig;
			formConfig.actions = [ {
				'type': 'submit',
				'label': 'Create Account',
				'btn': 'orangeBorderLink',
				'action': function (formData) {
					if (formData.confirmPassword === formData.password) {
						var postData = {
							'email': formData.email,
							'lastName': formData.lastName,
							'firstName': formData.firstName,
							'username': formData.username,
							'password': formData.password
						};
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"routeName": "/urac/join",
							"data": postData,
							"headers": {
								key: apiConfiguration.key
							}
						}, function (error, response) {
							if (error) {
								$scope.$parent.displayFixedAlert('danger', error.message);
							}
							else {
								$scope.$parent.displayFixedAlert('success', 'Please check your email for a validation link.');
								$scope.$parent.go("/");
							}
						});
					}
					else {
						$scope.$parent.displayFixedAlert('danger', 'Password and Confirm password do not match!');
					}
					
				}
			} ];
			buildForm($scope, null, formConfig);
		}
		
		if (!isUserLoggedIn()) {
			openForm();
			setTimeout(function () {
				//openForm();
			}, 20);
		}
		else {
			$scope.$parent.displayFixedAlert('danger', 'You are already logged in');
			$scope.$parent.go("/");
		}
		
	} ]);

uracApp.controller('validateCtrl', [ '$scope', '$timeout', 'ngDataApi', 'isUserLoggedIn', '$route',
	function ($scope, $timeout, ngDataApi, isUserLoggedIn, $route) {
		
		/**
		 * validate a user account
		 */
		$scope.validateJoin = function () {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/join/validate",
				"params": { "token": $route.current.params.token }
			}, function (error) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					$scope.$parent.displayFixedAlert('success', 'Your email was validated. You can login now');
					$scope.$parent.go("/login");
				}
			});
		};
		
		/**
		 * validate a changed user email
		 */
		$scope.validateChangeEmail = function () {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/changeEmail/validate",
				"params": { "token": $route.current.params.token }
			}, function (error) {
				if (error) {
					$scope.$parent.displayFixedAlert('danger', error.message);
				}
				else {
					$scope.$parent.displayFixedAlert('success', 'Your email was validated and changed successfully.');
					$scope.$parent.$emit('refreshWelcome', {});
					setTimeout(function () {
						$scope.$parent.go("/account");
					}, 1000);
				}
			});
		};
		
		if ($route.current.originalPath === "/joinValidate") {
			$scope.validateJoin();
		}
		else if ($route.current.originalPath === "/changeEmailValidate") {
			$scope.validateChangeEmail();
		}
	} ]);

uracApp.controller('forgotPwCntrl', [ '$scope', 'ngDataApi', '$cookies', 'isUserLoggedIn',
	function ($scope, ngDataApi, $cookies, isUserLoggedIn) {
		
		/**
		 * forgot password form that will send you an email to validate your request
		 */
		function openForm () {
			var formConfig = formConf.forgotPwConfig;
			formConfig.actions = [ {
				'type': 'submit',
				'label': 'Submit',
				'btn': 'orangeBorderLink',
				'action': function (formData) {
					var postData = {
						'username': formData.username
					};
					getSendDataFromServer($scope, ngDataApi, {
						"method": "get",
						"routeName": "/urac/forgotPassword",
						"params": postData
					}, function (error, response) {
						if (error) {
							$scope.$parent.displayFixedAlert('danger', error.message);
						}
						else {
							$scope.$parent.displayFixedAlert('success', 'A reset link has been sent to your email address.');
							$scope.$parent.go("/login");
						}
					});
				}
			} ];
			
			buildForm($scope, null, formConfig);
		}
		
		if (!isUserLoggedIn()) {
			openForm();
			setTimeout(function () {
				//openForm();
			}, 20);
		}
		else {
			$scope.$parent.displayFixedAlert('danger', 'You are already logged in');
			$scope.$parent.go("/");
		}
		
	} ]);

uracApp.controller('resetPwCntrl', [ '$scope', 'ngDataApi', '$cookies', 'isUserLoggedIn', '$route',
	function ($scope, ngDataApi, $cookies, isUserLoggedIn, $route) {
		
		/**
		 * form that will validate your password reset
		 */
		function openForm () {
			var formConfig = formConf.resetPwConfig;
			formConfig.actions = [ {
				'type': 'submit',
				'label': 'Submit',
				'btn': 'orangeBorderLink',
				'action': function (formData) {
					var postData = {
						'password': formData.password,
						'confirmation': formData.confirmation
					};
					getSendDataFromServer($scope, ngDataApi, {
						"method": "send",
						"routeName": "/urac/resetPassword",
						"data": postData,
						"params": { "token": $route.current.params.token }
					}, function (error) {
						if (error) {
							$scope.$parent.displayFixedAlert('danger', error.message);
						}
						else {
							$scope.$parent.displayFixedAlert('success', 'Your password was reset. You can login now');
							$scope.$parent.go("/login");
						}
					});
				}
			} ];
			buildForm($scope, null, formConfig);
		}
		
		if (!isUserLoggedIn()) {
			openForm();
			setTimeout(function () {
				//openForm();
			}, 20);
		}
		else {
			$scope.$parent.displayFixedAlert('danger', 'You are already logged in.');
			$scope.$parent.go("/");
		}
		
	} ]);