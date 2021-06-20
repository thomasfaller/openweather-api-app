import { Button, Card, Container, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { queryCityWeather, queryLatLongWeather } from "./api/ApiCall";
import { fromFarenheitToCelsius } from "./utils/tempConvert";
import theme from "./styles/theme";
const {
  colors: { level0, level1, level2, level3, brand1, brand2 },
  fontSizes: { xl, lg, md },
} = theme;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const errors = (err) => {
  console.error(`ERROR(${err.code}): ${err.message}`);
};

const App = () => {
  const [coords, setCoords] = useState({});
  const [userTemp, setUserTemp] = useState("");
  const [appError, setAppError] = useState("");
  const [city, setCity] = useState("");
  const [cityTemp, setCityTemp] = useState("");
  const [tempDifference, setTempDifference] = useState("");

  useEffect(() => {
    document.body.style.backgroundColor = level2;
    if (navigator.geolocation) {
      console.log("geolocation is available on this browser");
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        switch (result.state) {
          case "granted":
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              setCoords({ latitude, longitude });
              queryLatLongWeather(latitude, longitude)
                .then((response) => {
                  console.log(response);
                  const {
                    data: {
                      main: { temp },
                    },
                  } = response;
                  setUserTemp(temp);
                })
                .catch((error) => {
                  const {
                    response: {
                      data: { message },
                    },
                  } = error;
                  alert(message);
                });
            });
            break;
          case "prompt":
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ latitude, longitude });
              },
              errors,
              options
            );
            break;
          case "denied":
            alert(
              "You must enable geolocation in your browser in order to use this service"
            );
            break;
          default:
        }
        result.onchange = () => {
          console.log("Res changed");
        };
      });
    } else {
      alert("Error");
    }
  }, []);

  const calculateDiff = (a, b) => {
    const diff = a > b ? a - b : b - a;
    return diff.toFixed(1);
  };

  const handleClick = (e) => {
    queryCityWeather(city)
      .then((response) => {
        const {
          data: {
            main: { temp },
          },
        } = response;
        setCityTemp(temp);
        const t1 = parseFloat(temp);
        const t2 = parseFloat(userTemp);
        const diff = t1 > t2 ? t1 - t2 : t2 - t1;
        setTempDifference(diff.toFixed(2));
      })
      .catch((error) => {
        const {
          response: {
            data: { message },
          },
        } = error;
        alert(message);
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCity(value);
  };

  return (
    <Container style={{ backgroundColor: level1 }} maxWidth="md">
      <Card>
        <h1 style={{ fontSize: xl }}>My App</h1>
        <h3 style={{ fontSize: lg }}>Your current temperature :</h3>
        {userTemp !== "" ? (
          <p>{`${userTemp} °C`}</p>
        ) : (
          <p>loading current temperature</p>
        )}
        <h3>Type in a city name...</h3>
        <TextField
          required
          id="standard-basic"
          label="City"
          onChange={handleChange}
          value={city}
        />
        <Button
          style={{ color: level0, backgroundColor: brand1 }}
          onClick={() => handleClick()}
          variant="contained"
        >
          Search
        </Button>
        {appError !== "" && <p>{appError}</p>}

        {city !== "" && (
          <>
            <h3>{`Current temperature in ${city}:`}</h3>
            <p>{`${cityTemp} °C`}</p>
          </>
        )}
        {tempDifference !== "" && (
          <p>{`Temp difference: ${tempDifference} °C`}</p>
        )}
      </Card>
    </Container>
  );
};

export default App;
