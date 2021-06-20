const axios = require("axios");
const { REACT_APP_API_KEY } = process.env;
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather?";

const queryCityWeather = (city) => {
  const url = `${BASE_URL}q=${city}&units=metric&appid=${REACT_APP_API_KEY}`;
  return callOpenWeaterMap(url);
};

const queryLatLongWeather = (latitude, longitude) => {
  const url = `${BASE_URL}lat=${latitude}&lon=${longitude}&units=metric&appid=${REACT_APP_API_KEY}`;
  return callOpenWeaterMap(url);
};

const callOpenWeaterMap = (url) => axios.get(url);
//   axios
//     .get(url)
//     .then((response) => {
//       const {
//         data: {
//           main: { temp },
//         },
//       } = response;
//       return { temp };
//     })
//     .catch((error) => {
//       return error;
//     });

module.exports = { queryCityWeather, queryLatLongWeather };
