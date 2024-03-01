const checkRepeatedValues = (exemplar, body) => {
  const filteredFields = {};
  for (const key in body) {
    if (exemplar[key] && exemplar[key] !== body[key]) {
      filteredFields[key] = body[key];
    }
  }
  console.log(filteredFields);
  return filteredFields;
};

module.exports = checkRepeatedValues;
