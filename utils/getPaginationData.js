function getPaginationData(data, page, limit, fieldName) {
  const { count: total, rows } = data;
  const current = page ? +page : 0;
  const totalPages = Math.ceil(total / limit);

  return { total, [fieldName]: rows, totalPages, current };
}

module.exports = getPaginationData;
