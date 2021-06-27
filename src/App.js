import {
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardHeader,
  CardActions,
  CardMedia,
  CardContent,
  Container,
  makeStyles,
  TextField,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  FormControl,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import DeleteIcon from "@material-ui/icons/Delete";
import { Image, Transformation } from "cloudinary-react";
import React, { useState, useEffect } from "react";
import { queryCityWeather, queryLatLongWeather } from "./api/ApiCall";
import { outputTemp, OutputTempDiff } from "./utils/tempUtils";
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
  const sampleCities = [
    {
      name: "Paris",
      temp: 24,
      diff: 7,
      colder: false,
      weather: "sunny",
      icon: "01d",
    },
    {
      name: "Moscow",
      temp: 14,
      diff: 5,
      colder: true,
      weather: "few clouds",
      icon: "02d",
    },
    {
      name: "Oslo",
      temp: 7,
      diff: 12,
      colder: true,
      weather: "cloudy",
      icon: "03d",
    },
  ];

  //   Using React Hooks to manage State
  const [userLocation, setUserLocation] = useState({});
  const [appError, setAppError] = useState("");
  const [cities, setCities] = useState([]);
  const [cityToSearch, setCityToSearch] = useState("");

  const getCurrentLocation = (latitude, longitude) => {
    queryLatLongWeather(latitude, longitude)
      .then((response) => {
        console.log(response);
        const {
          data: {
            name,
            main: { temp },
            weather,
          },
        } = response;
        const { description, icon } = weather[0];
        setUserLocation({ name, temp, weather: description, icon });
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

  //   The useEffect() hook handles the geolocation permissions on the client's browser making usre it's enabled
  useEffect(() => {
    document.body.style.backgroundColor = level3;
    if (
      localStorage.getItem("latitude") === null ||
      localStorage.getItem("longitude") === null
    ) {
      // On first load coords should be stored in localstorage so consecutive loadings wont require geolocation usage
      console.log("Checking if geolocation is available in the browser");
      if (navigator.geolocation) {
        // Geolocation feature is detected
        console.log("geolocation is available on this browser");
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          console.log("Checking geolocation permissions");
          switch (result.state) {
            case "granted":
              console.log("permitted");
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                localStorage.setItem("latitude", latitude);
                localStorage.setItem("longitude", longitude);
                getCurrentLocation(latitude, longitude);
              });
              break;
            case "prompt":
              console.log("asking user to allow geolocation");
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                },
                errors,
                options
              );
              break;
            case "denied":
              console.log("geolocation permission is denied");
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
        // Will display Aler if no geolocation feature is detected (unsupported browser for example)
        alert("Error");
      }
    } else {
      // if coords are already stored in the localStorage
      const latitude = localStorage.getItem("latitude");
      const longitude = localStorage.getItem("longitude");
      getCurrentLocation(latitude, longitude);
    }
  }, []);

  //   This is the function handling the search
  const handleClick = (e) => {
    queryCityWeather(cityToSearch)
      .then((response) => {
        console.log(response);
        const {
          data: {
            name,
            weather,
            main: { temp },
          },
        } = response;
        const { description, icon } = weather[0];
        const t1 = parseFloat(temp);
        const t2 = parseFloat(userLocation.temp);
        // To hanlde difference temperature scenarios
        const diff = t1 > t2 ? t1 - t2 : t2 - t1;
        const colder = t1 > t2 ? false : true;
        setCities((cities) => [
          ...cities,
          {
            name,
            temp,
            diff: diff.toFixed(1),
            colder,
            weather: description,
            icon,
          },
        ]);
        resetInput();
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

  //   Controlled input, managing value of input field through state
  const handleChange = (e) => {
    const { value } = e.target;
    setCityToSearch(value);
  };

  //   Different reset functions depending on what we want to reset
  const resetInput = () => setCityToSearch("");
  const resetCities = () => setCities([]);
  const resetAll = () => {
    resetInput();
    resetCities();
  };

  // Function loading sample data into the results table
  const loadSampleData = () => {
    sampleCities.forEach((city) => {
      const { name, temp, diff, colder, weather, icon } = city;
      setCities((cities) => [
        ...cities,
        { name, temp, diff, colder, weather, icon },
      ]);
    });
  };

  //   Handle the click on Delete for each row
  const handleRemoveCity = (name) =>
    setCities(cities.filter((city) => city.name !== name));

  //   Injecting CSS via the makeStyles method
  const useStyles = makeStyles({
    card: {
      maxWidth: 1280,
      padding: 50,
    },
    center: {
      margin: "0 auto",
    },
    container: {
      font: "Roboto",
      padding: `65px 130px`,
    },
    logoWrapper: {
      width: 200,
      margin: "0 auto 45px",
    },
    title: {
      fontWeight: "bold",
      fontSize: xl,
      color: brand1,
    },
    header: {
      fontSize: lg,
      color: brand2,
    },
    main: {
      marginTop: 10,
      fontSize: md,
    },
    button: {
      fontWeight: "bold",
      backgroundColor: brand1,
      color: level0,
      "&:hover": {
        backgroundColor: brand1,
      },
    },
    danger: {
      color: "tomato",
    },
    inputBox: {
      width: "100%",
      marginTop: 100,
    },
  });

  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="md">
      <Card elevation={5} className={classes.card}>
        <div className={classes.logoWrapper}>
          <Image cloudName="djr6sgsbd" publicId="branding_copy.png">
            <Transformation width="200" crop="scale" />
          </Image>
        </div>
        <Typography className={classes.title} variant="h1" component="h1">
          Temperature Comparator
        </Typography>
        <CardContent>
          <TableContainer>
            <Table aria-label="table of results" padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Temperature</TableCell>
                  <TableCell>Weather</TableCell>
                  <TableCell>
                    <Button onClick={resetCities}>reset</Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {/* Handling cases where the OpenWeather API does not return a specific 'name' for a given location*/}
                    {userLocation.name !== undefined
                      ? userLocation.name
                      : "Your location"}
                  </TableCell>
                  <TableCell>{outputTemp(userLocation.temp)}</TableCell>
                  <TableCell colSpan={2}>
                    <img
                      alt={userLocation.weather}
                      src={`http://openweathermap.org/img/wn/${userLocation.icon}.png`}
                    ></img>
                  </TableCell>
                </TableRow>
                {/* using map to iterate over our array of cities to generate the rows  */}
                {cities.map((city) => {
                  return (
                    <TableRow key={city.name}>
                      <TableCell>{city.name}</TableCell>
                      <TableCell>
                        <p>
                          {`${outputTemp(city.temp)}`}
                          <OutputTempDiff
                            colder={city.colder}
                            diff={city.diff}
                          />
                        </p>
                      </TableCell>
                      <TableCell>
                        <img
                          alt={city.weather}
                          src={`http://openweathermap.org/img/wn/${city.icon}.png`}
                        ></img>
                      </TableCell>
                      <TableCell>
                        <Button
                          disableRipple
                          onClick={() => handleRemoveCity(city.name)}
                          aria-label="delete"
                          startIcon={<DeleteIcon />}
                        ></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Container className={classes.inputBox}>
            <FormControl fullWidth focused margin="dense" required>
              <TextField
                variant="filled"
                autoCapitalize
                autoComplete
                label="type in a city name..."
                onChange={handleChange}
                value={cityToSearch}
              />
            </FormControl>

            <CardActions style={{ marginTop: 45 }}>
              <ButtonGroup className={classes.center}>
                <Button
                  size="large"
                  className={classes.button}
                  onClick={() => handleClick()}
                  disableElevation
                  endIcon={<SearchIcon />}
                >
                  Search
                </Button>
                <Button onClick={loadSampleData}>sample data</Button>
                <Button
                  onClick={resetAll}
                  color="secondary"
                  disableElevation
                  disabled={cities.length === 0}
                  endIcon={<ClearAllIcon />}
                >
                  Reset
                </Button>
              </ButtonGroup>
            </CardActions>
            {appError !== "" && <p>{appError}</p>}
          </Container>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;
