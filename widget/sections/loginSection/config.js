"use strict";

var formConf = {
	changePasswordConfig: {
		'entries': [
			{
				'name': 'oldPassword',
				'label': 'Old Password',
				'type': 'password',
				'placeholder': 'Old Password',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'password',
				'label': 'New Password',
				'type': 'password',
				'placeholder': 'New Password',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'confirmation',
				'label': 'Confirm Password',
				'type': 'password',
				'placeholder': 'Confirm Password',
				'value': '',
				'tooltip': '',
				'required': true
			}
		]
	},
	changeEmailConfig: {
		'id': 'changeEmailForm',
		'name': 'changeEmail',
		'label': '',
		'entries': [
			{
				'name': 'email',
				'label': 'Email',
				'type': 'readonly',
				'placeholder': 'Email',
				'value': '',
				'tooltip': ''
			},
			{
				'name': 'newEmail',
				'label': 'New Email',
				'type': 'email',
				'placeholder': 'New Email',
				'value': '',
				'tooltip': '',
				'required': true
			}
		]
	},
	profileConfig: {
		'id': 'profileForm',
		'name': 'profile',
		'entries': [
			{
				'name': 'firstName',
				'label': 'First Name',
				'type': 'text',
				'placeholder': 'First Name',
				'value': '',
				'tooltip': '',
				'class': "f-left",
				'required': true
			},
			{
				'name': 'lastName',
				'label': 'Last Name',
				'type': 'text',
				'placeholder': 'Last Name',
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'email',
				'label': 'Email',
				'type': 'readonly',
				'placeholder': 'Email',
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'username',
				'label': 'Username',
				'type': 'text',
				'placeholder': 'Username',
				'value': '',
				'tooltip': 'Usernames are alphanumeric and support _ character only',
				'required': true
			}
		]
	},
	registerConfig: {
		'id': 'registerForm',
		'name': 'register',
		'entries': [
			{
				'name': 'firstName',
				'label': 'First Name',
				'type': 'text',
				'placeholder': 'First Name',
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'lastName',
				'label': 'Last Name',
				'type': 'text',
				'placeholder': 'Last Name',
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'email',
				'label': 'Email',
				'type': 'text',
				'placeholder': 'Email',
				'value': '',
				'tooltip': '',
				'required': true
			},
			{
				'name': 'username',
				'label': 'Username',
				'type': 'text',
				'placeholder': 'Username',
				'value': '',
				'tooltip': 'Usernames are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'password',
				'label': 'Password',
				'type': 'password',
				'placeholder': 'Password',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'confirmPassword',
				'label': 'Confirm Password',
				'type': 'password',
				'placeholder': 'Passwords are alphanumeric and support _ character only',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			}
		]
	},
	loginConfig: {
		'id': 'loginForm',
		'name': 'login',
		'label': 'Login',
		'entries': [
			{
				'name': 'username',
				'label': 'Username',
				'type': 'text',
				'placeholder': 'Enter Username',
				'value': '',
				'tooltip': 'Usernames are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'password',
				'label': 'Password',
				'type': 'password',
				'placeholder': 'Your Password',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			}
		]
	},
	forgotPwConfig: {
		'id': 'forgotPwForm',
		'name': 'forgotPw',
		'label': '',
		'entries': [
			{
				'name': 'username',
				'label': 'Your Username or Email',
				'type': 'text',
				'placeholder': 'Your Username or Email',
				'value': '',
				'tooltip': 'Enter your Username or E-mail to ask for a password change',
				'required': true
			}
		]
	},
	resetPwConfig: {
		'id': 'resetPwForm',
		'name': 'resetPw',
		'label': '',
		'entries': [
			{
				'name': 'password',
				'label': 'New Password',
				'type': 'password',
				'placeholder': 'New Password',
				'value': '',
				'tooltip': 'Passwords are alphanumeric and support _ character only',
				'required': true
			},
			{
				'name': 'confirmation',
				'label': 'Confirm Password',
				'type': 'password',
				'placeholder': 'Enter Password again',
				'value': '',
				'tooltip': '',
				'required': true
			}
		]
	}
};