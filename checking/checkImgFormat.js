const checkImgFormat = (file) => {
  const imgFormats = ["jpeg", "jpg", "png"];
  const currentFormat = file.split('.')[file.split('.').length - 1];
  if (imgFormats.some((format) => format == currentFormat)) {
    return "." + currentFormat;
  }
  return false;
};

module.exports = checkImgFormat;
