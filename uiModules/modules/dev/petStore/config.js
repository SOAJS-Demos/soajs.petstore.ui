var petStoreConfig = {
	form: {
		entries: [
			{
				'name': 'breed',
				'label': "Breed",
				'type': 'text',
				'placeholder': "dog",
				'value': '',
				'tooltip': "Enter the pet breed",
				'required': true
			},
			{
				'name': 'name',
				'label': "Name",
				'type': 'text',
				'placeholder': "rex",
				'value': '',
				'tooltip': "Enter the pet name",
				'required': true
			},
			{
				'name': 'age',
				'label': "Age",
				'type': 'text',
				'placeholder': "x months",
				'value': '',
				'tooltip': "Enter the pet age",
				'required': true,
				"fieldMsg": "The pet age is a string for example: '2 years'"
			},
			{
				'name': 'gender',
				'label': "Gender",
				'type': 'select',
				'value': [
					{l: 'male', v: 'male'},
					{l: 'female', v: 'female'}
				],
				'tooltip': "Select the pet gender",
				'required': true
			},
			{
				'name': 'color',
				'label': "Color",
				'type': 'text',
				'placeholder': "white",
				'value': '',
				'tooltip': "Enter the pet color",
				'required': false
			},
			{
				'name': 'quantity',
				'label': "Quantity",
				'type': 'number',
				'min': 1,
				'placeholder': "1",
				'value': '',
				'tooltip': "Enter the number of pets that has the same info available in the shop",
				'required': true
			},
			{
				'name': 'price',
				'label': "Price",
				'type': 'text',
				'placeholder': "100 USD",
				'value': '',
				'tooltip': "Enter the pet price",
				'required': true,
				"fieldMsg": "The price is a string, it contains the price and the currency"
			},
			{
				'name': 'photoUrls',
				'label': "PhotoUrls",
				'type': 'text',
				'placeholder': "https://petImage.jpg",
				'value': '',
				'tooltip': "Enter the pet photo Url",
				'required': true
			},
			{
				'name': 'description',
				'label': "Description",
				'type': 'text',
				'placeholder': "white dog ...",
				'value': '',
				'tooltip': "Enter the pet description",
				'required': false
			}
		]
	},
	permissions: {
		'list': ['petstore', '/pets', 'get'],
		'add': ['petstore', '/pet', 'post'],
		'remove': ['petstore', '/pet/:id', 'delete'],
		'update': ['petstore', '/pet/:id', 'post']
	}
};
