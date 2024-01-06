module.exports = function removeNotAllowedFields(obj, fields) {
  const newObj = {};
  fields.forEach((name) => {
    newObj[name] = obj[name];
  });

  return newObj;
};
