/**
 * UI Navigation links
 */
var navigation = [
	{
		'id': 'home',
		'label': 'Home',
		'url': '/',
		'title': 'Home',
		'tplPath': 'sections/homepage/directives/list.tmpl',
		'scripts': ['sections/homepage/config.js', 'sections/homepage/controller.js'],
		'footerMenu': true
	},
	{
		'id': 'cart',
		'label': '',
		'title': 'Cart',
		'url': '/cart',
		'icon': '/themes/theme1/images/emptyCart.png',
		'tplPath': 'sections/cart/directives/cart.tmpl',
		'scripts': ['sections/cart/config.js','sections/cart/controller.js'],
		"mainMenu": true,
		"loggedIn": false
	},
	{
		'id': 'orders',
		'label': '',
		'title': 'Orders',
		'url': '/orders',
		'tplPath': 'sections/myOrders/directives/orders.tmpl',
		'scripts': ['sections/myOrders/controller.js'],
		"userMenu": true,
		"loggedIn": true
	},
	{
		'id': 'login',
		'label': '',
		'title': 'Login',
		'url': '/login',
		'tplPath': 'sections/loginSection/directives/urac/login.tmpl',
		'scripts': ['sections/loginSection/config.js', 'sections/loginSection/controller-urac.js'],
		"userMenu": true,
		"loggedIn": false
	},
	{
		'id': 'loginSuccess',
		'label': 'Login Success',
		'title': 'Sign In',
		'url': '/successPassport',
		'tplPath': 'sections/loginSection/directives/urac/result.tmpl',
		'scripts': ['sections/loginSection/config.js', 'sections/loginSection/controller-urac.js'],
		"userMenu": false,
		"loggedIn": false
	},
	{
		'id': 'myAccount',
		'label': '',
		'title': 'My Account',
		'url': '/account',
		'tplPath': 'sections/loginSection/directives/myAccount.tmpl',
		'scripts': ['sections/loginSection/config.js','sections/loginSection/controller.js'],
		"userMenu": true,
		"loggedIn": true
	},
	{
		'id': 'logout',
		'label': 'Logout',
		'title': 'Logout',
		'url': '/logout',
		'tplPath': 'sections/loginSection/directives/urac/login.tmpl',
		'scripts': ['sections/loginSection/config.js', 'sections/loginSection/controller-urac.js'],
		"userMenu": true,
		"loggedIn": true
	},
	{
		'id': 'forgotPassword',
		'label': '',
		'title': 'forgotPassword',
		'url': '/forgotPassword',
		'tplPath': 'sections/loginSection/directives/urac/forgotPassword.tmpl',
		'scripts': ['sections/loginSection/config.js','sections/loginSection/controller.js', 'sections/loginSection/controller-urac.js']
	},
	{
		'id': 'register',
		'label': '',
		'title': 'Register',
		'url': '/register',
		'tplPath': 'sections/loginSection/directives/urac/register.tmpl',
		'scripts': ['sections/loginSection/config.js', 'sections/loginSection/controller-urac.js']
	},
	{
		'id': 'validateJoin',
		'title': 'Validate',
		'url': '/joinValidate',
		'tplPath': 'sections/loginSection/directives/urac/validate.tmpl',
		'scripts': ['sections/loginSection/controller-urac.js']
	},
	{
		'id': 'validate',
		'label': '',
		'title': 'Validate Email',
		'url': '/changeEmailValidate',
		'tplPath': 'sections/loginSection/directives/urac/validate.tmpl',
		'scripts': ['sections/loginSection/controller-urac.js']
	},
	{
		'id': 'resetPassword',
		'label': 'Reset Password',
		'title': 'Reset Password',
		'url': '/resetPassword',
		'tplPath': 'sections/loginSection/directives/urac/resetPassword.tmpl',
		'scripts': ['sections/loginSection/config.js', 'sections/loginSection/controller-urac.js']
	}
	
];