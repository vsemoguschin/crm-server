function getPaginationData(data, page, limit, fieldName) {
  const { count: totalItems, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, [fieldName]: rows, totalPages, currentPage };
}

module.exports = getPaginationData;
