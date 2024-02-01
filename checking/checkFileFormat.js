const directories = {
  ['imgs']: ['jpeg', 'jpg', 'png'],
  ['documents']: ['pdf'],
  ['drafts']: ['cdr']
};

const checkFileFormat = (file) => {
  const currentFormat = file.split('.')[file.split('.').length - 1];
  if (directories['imgs'].includes(currentFormat)) {
    return {
      directory: 'imgs',
      format: currentFormat
    }
  }
  if (directories['documents'].includes(currentFormat)) {
    return {
      directory: 'documents',
      format: currentFormat
    }
  }
  if (directories['drafts'].includes(currentFormat)) {
    return {
      directory: 'drafts',
      format: currentFormat
    }
  }
  return { format: false }
};

module.exports = checkFileFormat;
