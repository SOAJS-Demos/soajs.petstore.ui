"use strict";

petStoreApp.service('ngDataApi', ['$http', '$cookies', '$cookieStore', '$localStorage', function ($http, $cookies, $cookieStore, $localStorage) {
	
	function returnErrorOutput(opts, status, headers, config, cb) {
		console.log(status, headers, config);
		return cb(new Error("Unable Fetching data from " + config.url));
	}
	
	function revalidateTokens(scope, config, cb) {
		//create a copy of old config
		var myDomain = config.url.replace(/http(s)?:\/\//, '');
		myDomain = myDomain.split("/")[0];
		myDomain = protocol + "//" + myDomain;
		
		//first authorize
		var reAuthorizeConfig = angular.copy(config);
		reAuthorizeConfig.method = 'GET';
		reAuthorizeConfig.url = myDomain + "/oauth/authorization";
		reAuthorizeConfig.headers.key = apiConfiguration.key;
		reAuthorizeConfig.headers.accept = "*/*";
		delete reAuthorizeConfig.headers.Authorization;
		delete reAuthorizeConfig.params;
		
		$http(reAuthorizeConfig).success(function (response) {
			
			//second get new tokens.
			var authValue = response.data;
			var getNewAccessToken = angular.copy(config);
			getNewAccessToken.method = 'POST';
			getNewAccessToken.url = myDomain + "/oauth/token";
			getNewAccessToken.headers.Authorization = authValue;
			delete getNewAccessToken.params;
			getNewAccessToken.data = {
				'refresh_token': $cookies.get('refresh_token'),
				'grant_type': "refresh_token"
			};
			
			$http(getNewAccessToken).success(function (response) {
				$cookies.put('access_token', response.access_token);
				$cookies.put('refresh_token', response.refresh_token);
				
				//repeat the main call
				var MainAPIConfig = angular.copy(config);
				MainAPIConfig.params.access_token = $cookies.get('access_token');
				$http(MainAPIConfig).success(function (response, status, headers, config) {
					returnAPIResponse(scope, response, config, cb)
				}).error(function (errData, status, headers, config) {
					//logout the user
					returnErrorOutput(config, status, headers, config, cb)
				});
			}).error(function (errData, status, headers, config) {
				//logout the user
				returnErrorOutput(config, status, headers, config, cb)
			});
		}).error(function (errData, status, headers, config) {
			//logout the user
			returnErrorOutput(config, status, headers, config, cb)
		});
	}
	
	function returnAPIError(scope, opts, status, headers, errData, config, cb) {
		//try to get a new access token from the refresh
		if (errData && errData.errors.details[0].code === 401 && errData.errors.details[0].message === "The access token provided has expired.") {
			revalidateTokens(scope, config, cb);
		}
		else {
			returnErrorOutput(opts, status, headers, config, cb)
		}
	}
	
	function returnAPIResponse(scope, response, config, cb) {
		if (config.responseType === 'arraybuffer' && response) {
			try {
				var res = String.fromCharCode.apply(null, new Uint8Array(response));
				if (typeof res !== 'object') {
					res = JSON.parse(res);
				}
				if (res.result === false) {
					var str = '';
					for (var i = 0; i < res.errors.details.length; i++) {
						str += "Error[" + res.errors.details[i].code + "]: " + res.errors.details[i].message;
					}
					var errorObj = {
						message: str,
						codes: res.errors.codes,
						details: res.errors.details
					};
					if (res.errors.codes && res.errors.codes[0]) {
						errorObj.code = res.errors.codes[0];
					}
					return cb(errorObj);
				}
				else {
					return cb(null, response);
				}
			}
			catch (e) {
				console.log("Unable to parse arraybuffer response. Possible reason: response is a stream and too large.");
				return cb(null, response);
			}
		}
		else if (response && !Object.hasOwnProperty.call(response, "result")) {
			return cb(null, response);
		}
		else if (response && response.result === true) {
			if (response.soajsauth) {
				$cookies.put("soajs_auth", response.soajsauth);
			}
			var resp = {};
			for (var i in response) {
				resp[i] = response[i];
			}
			
			if (typeof(resp.data) !== 'object') {
				if (typeof(resp.data) === 'string') {
					resp.data = {
						data: resp.data
					};
				}
				else {
					resp.data = {};
				}
			}
			resp.data.soajsauth = resp.soajsauth;
			return cb(null, resp.data);
		}
		else {
			//try to refresh the access token before logging out the user
			if (response.errors.details[0].code === 401 && response.errors.details[0].message === 'The access token provided has expired.') {
				revalidateTokens(scope, config, cb);
			}
			else {
				var str = '';
				for (var i = 0; i < response.errors.details.length; i++) {
					str += "Error[" + response.errors.details[i].code + "]: " + response.errors.details[i].message;
				}
				var errorObj = {
					message: str,
					codes: response.errors.codes,
					details: response.errors.details
				};
				if (response.errors.codes && response.errors.codes[0]) {
					errorObj.code = response.errors.codes[0];
				}
				return cb(errorObj);
			}
		}
	}
	
	function executeRequest(scope, opts, cb) {
		var config = {
			token: opts.token,
			url: opts.url,
			method: opts.method,
			params: opts.params || {},
			xsrfCookieName: opts.cookie || "",
			cache: opts.cache || false,
			timeout: opts.timeout || 60000,
			responseType: opts.responseType || 'json',
			headers: opts.headers || {},
			data: opts.data || {},
			json: true
		};
		var soajsAuthCookie = $cookies.get('soajs_auth');
		if (soajsAuthCookie && soajsAuthCookie.indexOf("Basic ") !== -1) {
			config.headers.soajsauth = soajsAuthCookie.replace(/\"/g, '');
		}
		
		if (opts.headers.key && config.token) {
			config.headers.key = opts.headers.key;
		}
		else {
			config.headers.key = apiConfiguration.key;
		}
		
		var access_token = $cookies.get('access_token');
		if (access_token && config.token) {
			if (config.params) {
				config.params.access_token = access_token;
			}
		}
		
		if (opts.jsonp === true) {
			config.url += (config.url.indexOf('?') === -1) ? '?' : '&';
			config.url += "callback=JSON_CALLBACK";
			config.method = (config.method.toLowerCase() === 'get') ? 'jsonp' : config.method;
		}
		
		if (opts.upload) {
			config.progress = {
				value: 0
			};
			if (opts.file) {
				config.file = opts.file;
			}
			else {
				console.log('Missing File for Upload');
			}
			Upload.upload(config).progress(function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				config.progress.value = progressPercentage;
			}).success(function (response, status, headers, config) {
				returnAPIResponse(scope, response, config, cb);
			}).error(function (data, status, header, config) {
				returnAPIError(scope, opts, status, headers, data, config, cb);
			});
		}
		else {
			$http(config).success(function (response, status, headers, config) {
				returnAPIResponse(scope, response, config, cb);
			}).error(function (errData, status, headers, config) {
				returnAPIError(scope, opts, status, headers, errData, config, cb);
			});
		}
		
	}
	
	function getData(scope, opts, cb) {
		opts.method = 'GET';
		opts.api = 'getData';
		executeRequest(scope, opts, cb);
	}
	
	function sendData(scope, opts, cb) {
		opts.method = 'POST';
		opts.api = 'sendData';
		executeRequest(scope, opts, cb);
	}
	
	function putData(scope, opts, cb) {
		opts.method = 'PUT';
		opts.api = 'putData';
		executeRequest(scope, opts, cb);
	}
	
	function delData(scope, opts, cb) {
		opts.method = 'DELETE';
		opts.api = 'delData';
		executeRequest(scope, opts, cb);
	}
	
	return {
		'get': getData,
		'send': sendData,
		'post': sendData,
		'put': putData,
		'del': delData,
		'delete': delData
	};
}]);


petStoreApp.service("injectFiles", function () {

	function injectCss(filePath) {
		var csstag = "<link rel='stylesheet' type='text/css' href='" + filePath + "' />";
		jQuery("head").append(csstag);
	}

	return {
		'injectCss': injectCss
	}
});

petStoreApp.service('miniCartService', ['ngDataApi', '$localStorage', 'isUserLoggedIn', function (ngDataApi, $localStorage, isUserLoggedIn) {
	
	function listInitCart(cartScope, cb) {
		var userId;
		if(isUserLoggedIn()) {
			if ($localStorage.soajs_user && $localStorage.soajs_user._id) {
				userId = $localStorage.soajs_user._id;
			} }
		else {
				userId = 'guest'
			}
			getSendDataFromServer(cartScope, ngDataApi, {
				"method": "get",
				"routeName": "/orders/cart",
				"params": {"userId": userId}
			}, cb);
	}
	return {
		'listInitCart': listInitCart
	}
}]);

petStoreApp.service('isUserLoggedIn', ['$cookies', '$localStorage', function ($cookies, $localStorage) {
	return function () {
		if ($localStorage.soajs_user && $cookies.get('access_token')) {
			return true;
		}
		else {
			$cookies.remove('access_token');
			$cookies.remove('refresh_token');
			$localStorage.soajs_user = null;
			return false;
		}
	}
}]);