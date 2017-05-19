"use strict";
/*
 common function calls ngDataAPI angular service to connect and send/get data to api
 */
function getSendDataFromServer($scope, ngDataApi, options, callback) {
	var apiOptions = {
		url: (options.url) ? options.url + options.routeName : apiConfiguration.domain + options.routeName,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	var pathParams = options.routeName.split("/");
	var exclude = ['urac', 'dashboard', 'oauth'];
	
	if (Object.hasOwnProperty.call(options, 'token')) {
		apiOptions.token = options.token;
	}
	else {
		apiOptions.token = true;
	}
	
	if (options.jsonp) {
		apiOptions.jsonp = true;
	}
	
	if (options.params) {
		apiOptions.params = options.params;
	}
	
	if (options.data) {
		apiOptions.data = options.data;
	}
	
	if (options.method) {
		apiOptions.method = options.method;
	}
	
	if (options.responseType) {
		apiOptions.responseType = options.responseType;
	}
	
	if (options.upload) {
		apiOptions.upload = options.upload;
		if (options.file) {
			apiOptions.file = options.file;
		}
	}
	
	if (options.headers) {
		for (var i in options.headers) {
			if (options.headers.hasOwnProperty(i)) {
				if (options.headers[i] === null) {
					delete apiOptions.headers[i];
				}
				else {
					apiOptions.headers[i] = options.headers[i];
				}
			}
		}
	}
	
	ngDataApi[options.method]($scope, apiOptions, callback);
}

function loadJs(url, cb) {
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('type', 'text/javascript');
	
	var loaded = false;
	var loadFunction = function () {
		if (loaded) {
			return;
		}
		loaded = true;
		cb();
	};
	script.onload = loadFunction;
	script.onreadystatechange = loadFunction;
	document.getElementsByTagName("head")[0].appendChild(script);
}

