module.exports = function getEmptyFieldsForError(obj, checkedFields = []) {
	const array = []
	checkedFields.forEach(name => {
		if (!obj[name]) {
			array.push(name)
		}
	})
	return array;
}