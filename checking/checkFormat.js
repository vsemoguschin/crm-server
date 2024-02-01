const checkFormat = (file, allowFormats = ['jpeg', 'jpg', 'png']) => {
  const currentFormat = file.split('.')[file.split('.').length - 1];
  if (allowFormats.some((format) => format == currentFormat)) {
    return '.' + currentFormat;
  }
  return false;
};

module.exports = checkFormat;
