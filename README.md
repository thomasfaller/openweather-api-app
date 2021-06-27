# 'Ediflo' WebApp

## OpenWeather API

Using the API https://openweathermap.org/api - create an interface that periodically displays at least the difference between the temperature in the users current location and a city
supplied by the user.

---

The app uses ReactJs to render the interface and Axios to interact with the OpenWeather API.

Requirements:

- Node, NPM
- ReactJs > 17.0
- Axios > 0.21.1

---

## Install and Run locally:

### Install Dependencies :

```bash
yarn
# or npm install
```

### Run

```bash
# Make sure you have the correct API KEY to use OpenWeatherMap
# .env at root
REACT_APP_API_KEY=........
```

```bash
# Starting the development server on localhost:3000
yarn start
```

---

## Usage

### Interface

When loaded the app will require the geolocation to be enabled in the browser.

![App Screenshot](https://res.cloudinary.com/djr6sgsbd/image/upload/v1624817376/screenshot_webapp.png)

If the geolcation is not enabled you will need to allow it uing the alert displaed by your browser (note that you need to refresh the app once it's allowed)

![Allow](https://res.cloudinary.com/djr6sgsbd/image/upload/v1624817752/ezgif.com-gif-maker.gif)

The coordinates of the location are retrieved automatically on load thanks to the `useEffect()` hook.

The user can either:

- Search for a specific city by typing its name and clicking Search
- Click on the Sample Data button to load the following array of cities to populate the results table :

```json
// illustrative purposes
[
  {
    "name": "Paris",
    "temp": 24,
    "diff": 7,
    "colder": false,
    "weather": "sunny",
    "icon": "01d"
  },
  {
    "name": "Moscow",
    "temp": 14,
    "diff": 5,
    "colder": true,
    "weather": "few clouds",
    "icon": "02d"
  },
  {
    "name": "Oslo",
    "temp": 7,
    "diff": 12,
    "colder": true,
    "weather": "cloudy",
    "icon": "03d"
  }
]
```

The table and input field can be reset at any time using either the reset button in the top-right corner or the reset button at the bottom.

---

## Build

```bash
yarn build
# or npm run build
```

> This will create a production build of your app in the build/ folder of your project.

## Testing

### Run Tests

```bash
# Run Jest testing
yarn test
```

> note: The test units are targetting exclusively the Axios Library and the temp utilities at this time

---

## Development notes

- The app uses Cloudinary as a CDN to retrieve the logo. It doesn't provide any performance benefits for such small assets like this but I though it was a good usecase for testing.
- The app would benefit from having the App() component cut into smaller components and imported into the `App.js`. This would allow individual testing and simplify debugging.
