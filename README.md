# FormData to Object

A JS function which converts a FormData to a literal object

## Example

```js
import React from 'react';
import formDataToObject from 'formdata-to-object';

export default class MyForm extends React.Component {

	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.state = {}
	}

	submit(event) {
		event.preventDefault(); // Prevent you from refreshing the page when clicking on submit button

		const formData = new FormData(event.target);
		const formObj = formDataToObject(formData, {
			"development.hasDevops": Boolean,
			sectors: Array,
			"contract.cdiSalaryMin": Number,
			"contract.cdiSalaryMax": Number
		});

		// Send formObj to server
	}

	render() {
		return (
		<form onSubmit={this.submit}>
			{/* Your input fields */}
			<input type="submit" value="Envoyer" className="button" />
		</form>
		);
	}
}
```


## Types

* String by default (you don't need to define your key explicitely)
* `Number` for `<input type="number"` fields
* `Array` for `<select multiple` and `<input type="checkbox"`
* `Boolean` for fields with `"true"` and `"false"` values
* Your `customConverter(anyString): anyType` function which returns your custom object 
