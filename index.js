/**
 * Validate object content for a form fields and its value types
 * 
 * @param {Object} fieldTypes	An object which regroups a pair of fieldName/fieldType (fieldType must be a function)
 */
const assertFieldTypes = fieldTypes => {
	if (!fieldTypes) {
		throw new Error("[formDataToObject] 'fieldTypes' parameter must be a valid type");
	}

	for (const key in fieldTypes) {
		if (!(fieldTypes[key] instanceof Function)) {
			throw new Error(`[formDataToObject] Key '${key}' has not a valid function, value: ${fieldTypes[key]} | type: ${(typeof fieldTypes[key])}`);
		}
	}
}

/**
 * Transforms a `fieldValue` by given `convertToTypeFunction` and affects it to `formObject[fieldName]`
 * Array, Number, Boolean are reserved types (specific transformation)
 *
 * @param {Function} convertToTypeFunction 	The transformation function
 * @param {Object} formObject 		The formObject
 * @param {String} fieldName 		formObject's field name
 * @param {String} fieldValue 		Value to be transformed
 */
const setObjectAttributeWithGivenFunction = (convertToTypeFunction, formObject, fieldName, fieldValue) => {
	if (convertToTypeFunction === Number) {
		const numberValue = fieldValue.replace(",", ".");
		if (!isNaN(numberValue)) {
			formObject[fieldName] = Number(numberValue);
		}
	} else if (convertToTypeFunction === Array) {
		if (formObject[fieldName]) {
			formObject[fieldName].push(fieldValue);
		} else {
			formObject[fieldName] = [fieldValue];
		}
	} else if (convertToTypeFunction === Boolean) {
		// Check developper's mistake
		if (fieldValue !== "true" && fieldValue !== "false") {
			throw new Error(`[formDataToObject] The field '${fieldName}' has a boolean type but its value is not 'true' or 'false': ${fieldValue}`);
		}

		formObject[fieldName] = Boolean(fieldValue);
	} else if (convertToTypeFunction) {
		// Developer defined behaviour
		formObject[fieldName] = convertToTypeFunction(fieldValue);
	} else {
		// Default: String value
		formObject[fieldName] = fieldValue;
	}
}

/**
 * Convert a FormData to a literal object
 * 
 * @param {FormData} formData   A FormData
 * @param {Object}   fieldTypes An objet of fieldName/convertToTypeFunction
 * @return {Object}             An objet which represent the literal object format of the FormData
 */
export default function formDataToObject(formData, fieldTypes) {
	// Checks
	if (!(formData instanceof FormData)) {
		throw new Error("[formDataToObject] 'formData' parameter must be 'FormData' type");
	}
	assertFieldTypes(fieldTypes);
	

	// Implementation
	const formObject = {};
	for (const keyValue of formData.entries()) {
		const fieldValue = keyValue[1].trim();
		if (!fieldValue) {
			continue;
		}

		const fieldName = keyValue[0];
		const convertToTypeFunction = fieldTypes[fieldName];
		const fieldNameParts = fieldName.split(".");

		let intermediateObject = formObject;
		for (let i = 0, max = fieldNameParts.length - 1; i <= max; i++) {
			const fieldNamePart = fieldNameParts[i];
			if (i === max) {
				setObjectAttributeWithGivenFunction(convertToTypeFunction, intermediateObject, fieldNamePart, fieldValue);
			} else {
				// Create intermediate object if it does not already exist
				if (!intermediateObject[fieldNamePart]) {
					intermediateObject[fieldNamePart] = {};
				}

				intermediateObject = intermediateObject[fieldNamePart];
			}
		}
	}

	return formObject;
}
