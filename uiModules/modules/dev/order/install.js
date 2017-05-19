"use strict";
var ordersDev = 'modules/dev/order';
var ordersNav = [
	{
		'id': 'order',
		'label': 'Order Management',
		'url': '#/orders',
		'tplPath': 'modules/dev/order/directives/order.tmpl',
		'icon': 'cart',
		'pillar': {
			'name': 'operate',
			'label': translation.operate[LANG],
			'position': 4
		},
		'mainMenu': true,
		'tracker': true,
		'order': 5,
		'scripts': ['modules/dev/order/controller.js', 'modules/dev/order/config.js', 'modules/dev/order/service'],
		'ancestor': [translation.home[LANG]]
	}
];
navigation = navigation.concat(ordersNav);
	