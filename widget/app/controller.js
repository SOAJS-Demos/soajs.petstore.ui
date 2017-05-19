'use strict';

var index = 0;
(function () {
	var link = document.createElement("script");
	link.type = "text/javascript";
	link.src = "themes/" + themeToUse + "/bootstrap.js";
	document.getElementsByTagName("head")[0].appendChild(link);
})();

/* App Module */
var petStoreApp = angular.module('petStoreApp', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'ngStorage']);
petStoreApp.config([
	'$routeProvider',
	'$controllerProvider',
	'$compileProvider',
	'$filterProvider',
	'$provide',
	'$locationProvider',
	'$sceDelegateProvider',
	function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider, $sceDelegateProvider) {
		petStoreApp.compileProvider = $compileProvider;
		
		var whitelisted = ['self'];
		whitelisted = whitelisted.concat(whitelistedDomain);
		$sceDelegateProvider.resourceUrlWhitelist(whitelisted);
		
		navigation.forEach(function (navigationEntry) {
			if (navigationEntry.scripts && navigationEntry.scripts.length > 0) {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath,
					resolve: {
						load: ['$q', '$rootScope', function ($q, $rootScope) {
							var deferred = $q.defer();
							require(navigationEntry.scripts, function () {
								$rootScope.$apply(function () {
									deferred.resolve();
								});
							});
							return deferred.promise;
						}]
					}
				});
			}
			else {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath
				});
			}
		});
		
		$routeProvider.otherwise({
			redirectTo: navigation[0].url.replace('#', '')
		});
		
		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		
		petStoreApp.components = {
			controller: $controllerProvider.register,
			service: $provide.service
		};
		
	}
]);

petStoreApp.controller('petStoreAppController', ['$scope', '$location', '$timeout', '$route', '$cookies', '$cookieStore', 'ngDataApi', '$localStorage', '$routeParams', 'miniCartService',
	function ($scope, $location, $timeout, $route, $cookies, $cookieStore, ngDataApi, $localStorage, $routeParams, miniCartService) {
		$scope.enableInterface = false;
		$scope.currentLocation = '';
		$scope.hideLogin=false;
		
		$scope.go = function (path) {
			$location.path(path);
		};
		$scope.alerts = [];
		$scope.themeToUse = themeToUse;
		
		$scope.displayFixedAlert = function (type, msg) {
			$scope.alerts = [];
			$scope.alerts.push({'type': type, 'msg': msg});
			overlayLoading.showMessage(msg, type);
		};
		
		$scope.clearAlert = function () {
			overlayLoading.hideMessage();
		};
		
		$scope.pushAlert = function (type, msg) {
			$scope.alerts.push({'type': type, 'msg': msg});
			$scope.closeAllAlerts();
		};
		
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 10000);
		};
		
		$scope.navigation = navigation;

		$scope.rebuildMenu = function () {
			$scope.mainMenu = [];
			$scope.userMenu = [];
			$scope.footerMenu = [];
			
			$scope.navigation.forEach(function (oneMenuEntry) {
				if (oneMenuEntry.mainMenu) {
					$scope.mainMenu.push(oneMenuEntry);
				}
				
				if (oneMenuEntry.footerMenu) {
					$scope.footerMenu.push(oneMenuEntry);
				}
				
				if (oneMenuEntry.userMenu) {
					if ($localStorage.soajs_user != null && oneMenuEntry.loggedIn) {
						$scope.userMenu.push(oneMenuEntry);
					}
					else if (!$localStorage.soajs_user && !oneMenuEntry.loggedIn) {
						$scope.userMenu.push(oneMenuEntry);
					}
				}
			});
		};
		$scope.rebuildMenu();
		
		/**
		 * get initial user/guest cart and fill it
		 */
		miniCartService.listInitCart($scope, function (error, response) {
			if (error) {
				$scope.displayFixedAlert('danger', error.message);
			}
			else if(response) {
				$scope.orders = response.items;
				$scope.count = response.count;
			}
		});
		
		/**
		 * load user/guest interface and fill his cart in case of changes
		 */
		$scope.$on('loadUserInterface', function () {
			miniCartService.listInitCart($scope, function (error, response) {
				if (error) {
					$scope.displayFixedAlert('danger', error.message);
				}
				else if(response) {
					$scope.orders = response.items;
					$scope.count = response.count;
					$localStorage.cart = $scope.orders;
				}
			});
			$scope.rebuildMenu();
		});
		
		$scope.$on('cart', function(event, args){
			$scope.count = args.clear;
		});
		
		$scope.$on('refreshWelcome', function (event, args) {
			// to be called if the user changed his profile
			$scope.setUser();
		});
		
		$scope.setUser = function () {
			var user = $localStorage.soajs_user;
			if (user) {
				getSendDataFromServer($scope, ngDataApi, {
					"method": "get",
					"routeName": "/urac/account/getUser",
					"params": {"username": user.username}
				}, function (error, response) {
					if (error) {
						$scope.$parent.displayFixedAlert("danger", error.message);
					}
					else {
						$localStorage.soajs_user = response;
						$scope.firstName = response.firstName;
						$scope.lastName = response.lastName;
					}
				});
			}
		};
		
		$scope.$on('$routeChangeSuccess', function () {
			$scope.currentLocation = $location.path();

			$scope.hideLogin = false;
			if ($scope.currentLocation.indexOf("successPassport") > -1) {
				$scope.hideLogin = true;
			}

			if ($routeParams) {
				for (var m in $routeParams) {
					$scope.currentLocation = $scope.currentLocation.replace('/' + $routeParams[m], '');
				}
			}
			var title = '';
			for (var entry = 0; entry < navigation.length; entry++) {
				var urlOnly = navigation[entry].url.replace('/:id', '');
				if (urlOnly === '#' + $scope.currentLocation) {
					if (navigation[entry].title && navigation[entry].title !== '') {
						title = navigation[entry].title;
						break;
					}
				}
			}
			
			jQuery('head title').html(title);
			
		});
		
	}]);

petStoreApp.directive('header', function () {
	return {
		restrict: 'E',
		templateUrl: 'themes/' + themeToUse + '/directives/header.tmpl'
	};
});

petStoreApp.directive('content', function () {
	return {
		restrict: 'E',
		templateUrl: 'themes/' + themeToUse + '/directives/content.tmpl'
	};
});

petStoreApp.directive('footer', function () {
	return {
		restrict: 'E',
		templateUrl: 'themes/' + themeToUse + '/directives/footer.tmpl'
	};
});

petStoreApp.directive('ngConfirmClick', [
	function () {
		return {
			priority: -1,
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function (e) {
					var message = attrs.ngConfirmClick;
					if (message && !confirm(message)) {
						e.stopImmediatePropagation();
						e.preventDefault();
					}
				});
			}
		}
	}
]);

var overlayLoading = {
	show: function () {
		var overlayHeight = jQuery(document).height();
		jQuery("#overlay").css('height', overlayHeight + 'px').show();
		jQuery("#overlay .bg").css('height', overlayHeight + 'px').show(100);
		jQuery("#overlay .content").show();
	},
	hide: function (cb) {
		jQuery("#overlay .content").hide();
		jQuery("#overlay").fadeOut(200);
		if (cb && typeof(cb) === 'function') {
			cb();
		}
	},
	showMessage: function (str) {
		var overlayHeight = jQuery(document).height();
		jQuery("#notificationMessages").css('height', overlayHeight + 'px').show();
		jQuery("#notificationMessages .bg").css('height', overlayHeight + 'px').show(100);
		jQuery('#notificationMessages .content .customMessage').html(str);
		jQuery("#notificationMessages .content").show();
		// customMessage
	},
	hideMessage: function (cb) {
		jQuery("#notificationMessages .content").hide();
		jQuery("#notificationMessages").fadeOut(200);
		if (cb && typeof(cb) === 'function') {
			cb();
		}
	}
};