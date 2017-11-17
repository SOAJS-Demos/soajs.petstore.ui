"use strict";
/**
 * Custom configuration values
 */

var mydomain = "soajs.org";

//detect domain
if (location && location.host) {
	var customDomain = location.host;
	customDomain = customDomain.split(":")[0];
	customDomain = customDomain.split(".");
	customDomain.shift();
	customDomain = customDomain.join(".");
	mydomain = customDomain;
}

var protocol = window.location.protocol;

//detect port
var mydomainport = (protocol ==='https:') ? 443 : 80;
if (location && location.port && parseInt(location.port) !== 80) {
	mydomainport = location.port;
}
mydomain += ":" + mydomainport;

//set the api domain
var mydomainAPI = "portal-api";
if (customSettings && customSettings.api && customSettings.api !== '') {
	mydomainAPI = customSettings.api;
}

//set the key
var myKey = "cc9390e7b7bb0a360c899aa904382def97c642aa25bcbe98b1b737c683b97f7dcd421b510d6cd6f1656bdb0c730baa0cceb7b810e420abd444595c4175961746fd6d771085fd302df4b1055201804c17b3e1cda146fa6a02d3d9dcffbb841081";
if (customSettings && customSettings.key && customSettings.key !== '') {
	myKey = customSettings.key;
}

var titlePrefix = "SOAJS";
var themeToUse = "default";
var whitelistedDomain = ['localhost', '127.0.0.1', mydomainAPI + '.' + mydomain];
var apiConfiguration = {
	domain: window.location.protocol + '//' + mydomainAPI + '.' + mydomain,
	key: myKey
};

var SOAJSRMS = ['soajs.controller', 'soajs.urac', 'soajs.oauth', 'soajs.dashboard', 'soajs.prx', 'soajs.gcs'];
var soajsAppModules = ['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ui.select', 'luegg.directives', 'angular-sortable-view', 'ngRoute', 'ngCookies', 'ngStorage', 'ngSanitize', 'textAngular', "ngFileUpload", "swaggerUi", "ui.ace", "ngCkeditor"];
var uiModuleDev = 'modules/dev';
var uiModuleStg = 'modules/stg';
var uiModuleProd = 'modules/prod';
var uiModuleQa = 'modules/qa';
var uiModulePortal = 'modules/portal';
var uiModuleDash = 'modules/dashboard';

var modules = {
	"operate": {
		"portal": {
			urac: uiModulePortal + '/urac/install.js'
		},
		"dev": {
			urac: uiModuleDev + '/urac/install.js',
			petStore: 'modules/dev/petStore/install.js',
			order: 'modules/dev/order/install.js'
		},
		"qa": {
			urac: uiModuleQa + '/urac/install.js'
		},
		"stg": {
			urac: uiModuleStg + '/urac/install.js'
		},
		"prod": {
			urac: uiModuleProd + '/urac/install.js'
		}
	},
	"common": {
		"portal": {
			myAccount: uiModulePortal + '/myAccount/install.js'
		}
	}
};

var whitelistedRepos = [
	'soajs/soajs.examples',
	'soajs/soajs.jsconf',
	'soajs/soajs.artifact',
	'soajs/soajs.quick.demo',
	'soajs/soajs.nodejs.express',
	'soajs/soajs.nodejs.hapi',
	'soajs/soajs.java.jaxrs_jersey'
];
