"use strict";
var mydomain = 'soajs.org';
var mydomainport = location.port;
if (mydomainport && mydomainport !== 80) {
	mydomain += ":" + mydomainport;
}
var protocol = window.location.protocol;
/**
 * Custom configuration values
 */
var themeToUse = "theme1";
var whitelistedDomain = ['localhost', '127.0.0.1', 'petstore-api.' + mydomain];
var apiConfiguration = {
	domain: protocol + '//' + 'petstore-api.' + mydomain,
	key: 'd1bd89aa561d537fa292e4500aa0a4ecab0ba4941440194642b1fe9a8e177786fe864ce680afb2bb4115162fcfe0dd99a3449147dfec273f0bcb6f77ce666d42cc48edd94d703e1f997e3466cb0238ee8c9c6ccc22b0d9dd2ef2108eef8b63a3'
};