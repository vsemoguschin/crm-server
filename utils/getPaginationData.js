function getPaginationData(data, page, pageSize, fieldName) {
  const { count: total, rows } = data;
  const current = page ? +page : 0;
  const totalPages = Math.ceil(total / pageSize);

  return { total, [fieldName]: rows, totalPages, current };
}

module.exports = getPaginationData;
