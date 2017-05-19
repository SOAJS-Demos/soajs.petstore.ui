"use strict";
var petStoreNav = [
	{
		'id': 'petStore',
		'checkPermission': {
			'service': 'petstore',
			'route': '/pets',
			'method': 'get'
		},
		'label': 'Pet Store',
		'url': '#/petStore',
		'tplPath': 'modules/dev/petStore/directives/petStore.tmpl',
		'icon': 'home',
		'pillar': {
			'name': 'operate',
			'label': translation.operate[LANG],
			'position': 4
		},
		'mainMenu': true,
		'tracker': true,
		'order': 3,
		'scripts': ['modules/dev/petStore/controller.js', 'modules/dev/petStore/config.js', 'modules/dev/petStore/service.js'],
		'ancestor': [translation.home[LANG]]
	}
];
navigation = navigation.concat(petStoreNav);
	