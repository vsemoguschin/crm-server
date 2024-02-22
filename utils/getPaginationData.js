function getPaginationData(data, page, limit, fieldName) {
  const { count: total, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(total / limit);

  return { total, [fieldName]: rows, totalPages, currentPage };
}

module.exports = getPaginationData;
