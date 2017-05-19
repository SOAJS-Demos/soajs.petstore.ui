"use strict";

var orderDevConfig = {
	apiEndLimit: 100,
	
	permissions: {
		'order': {
			'list': ['orders', '/admin/orders','get'],
			'confirm': ['orders', '/order/:id','post'],
			'reject': ['orders', '/order/:id','delete']
		}
	},
	
	orders: {
		grid: {
			recordsPerPageArray: [10, 50, 100],
			'columns': [
				{'label': 'Pet Name', 'field': 'name'},
				{'label': 'Quantity', 'field': 'quantity'},
				{'label': 'Price', 'field': 'price'},
				{'label': 'Client First Name', 'field': 'firstName'},
				{'label': 'Client Last Name', 'field': 'lastName'},
				{'label': 'Client Email', 'field': 'email'},
				{'label': 'Client Phone', 'field': 'phone'},
				{'label': 'Status', 'field': 'status'},
				{'label': 'Pickup Date', 'field': 'pickupDate'}
			],
			'leftActions': [],
			'topActions': [],
			'defaultSortField': '',
			'defaultLimit': 50
		},
		form: {
			'name': '',
			'label': 'Confirm order',
			'actions': {},
			'entries': [
				{
					'name': 'pickupDate',
					'label': 'Pickup Date',
					'type': 'date-picker',
					'placeholder': 'Order pick up date',
					'value': '',
					'tooltip': 'Enter the date of the order pickup',
					'fieldMsg': 'This date will be send by mail to the client so he can pick up the pet.',
					'required': true
				}
			]
		}
	}
};
