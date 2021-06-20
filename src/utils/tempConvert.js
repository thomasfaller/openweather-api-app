const fromFarenheitToCelsius = (farenheit) => {
  const celsius = ((farenheit - 32) * 5) / 9;
  return celsius;
};

module.exports = { fromFarenheitToCelsius };
