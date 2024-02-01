const directories = {
  ['previews']: ['jpeg', 'jpg', 'png'],
  ['photos']: ['jpeg', 'jpg', 'png'],
  ['documents']: ['pdf'],
  ['drafts']: ['cdr']
};

const checkFileFormat = (file, directory) => {
  const currentFormat = file.split('.')[file.split('.').length - 1];
  if (!directories[directory].includes(currentFormat)) {
    return false;
  }
  return currentFormat
};

module.exports = checkFileFormat;
