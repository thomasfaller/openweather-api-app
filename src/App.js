import {
    Button,
    Card,
    CardActionArea,
    CardHeader,
    CardActions,
    CardMedia,
    CardContent,
    Container,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core";
import { Image, Transformation } from "cloudinary-react";
import React, { useState, useEffect } from "react";
import { queryCityWeather, queryLatLongWeather } from "./api/ApiCall";
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
    const [cityColder, setCityColder] = useState(false);
    const [cityTemp, setCityTemp] = useState("");
    const [tempDifference, setTempDifference] = useState("");
    const [cityFetched, setCityFetched] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = level3;
        if (navigator.geolocation) {
            console.log("geolocation is available on this browser");
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    switch (result.state) {
                        case "granted":
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { latitude, longitude } =
                                        position.coords;
                                    localStorage.setItem(
                                        "userLatitude",
                                        latitude
                                    );
                                    localStorage.setItem(
                                        "userLongitude",
                                        longitude
                                    );
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
                                }
                            );
                            break;
                        case "prompt":
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { latitude, longitude } =
                                        position.coords;
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
                setCityColder(t1 > t2 ? false : true);
                console.log(diff);
                setTempDifference(diff.toFixed(1));
                setCityFetched(true);
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
        setCityFetched(false);
        const { value } = e.target;
        setCity(value);
    };

    const outputTemp = (type) => {
        if (type === "user") {
            return userTemp !== "" ? `${userTemp} °C` : "loading...";
        } else if (type === "city") {
            return cityTemp !== "" ? `${cityTemp} °C` : "loading...";
        }
    };

    const outputTempDiff = () => {
        const diffText = cityColder ? "colder" : "hotter";
        const spanColor = cityColder ? "blue" : "tomato";
        return (
            <span style={{ color: spanColor, fontWeight: "bold" }}>
                {tempDifference !== ""
                    ? `(${tempDifference} °C ${diffText})`
                    : "loading..."}
            </span>
        );
    };

    const useStyles = makeStyles({
        card: {
            maxWidth: 920,
            padding: 50,
        },
        center: {
            margin: "0 auto",
        },
        container: {
            padding: `65px 130px`,
            // backgroundColor: level1,
        },
        title: {
            fontSize: xl,
            color: brand1,
            marginTop: 20,
            marginBottom: 20,
        },
        header: {
            fontSize: lg,
            color: brand2,
        },
        main: {
            marginTop: 10,
            fontSize: md,
        },
        button: {},
    });

    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="md">
            <Card className={classes.card}>
                <Image cloudName="djr6sgsbd" publicId="branding_copy.png">
                    <Transformation
                        className={classes.center}
                        width="150"
                        crop="scale"
                    />
                </Image>
                <CardContent>
                    <Typography
                        className={classes.title}
                        variant="h1"
                        component="h1"
                    >
                        Temperature Checker
                    </Typography>
                    <Typography
                        className={classes.main}
                        variant="h1"
                        component="h3"
                    >
                        Your current temperature : {outputTemp("user")}
                    </Typography>
                    <Typography
                        className={classes.main}
                        variant="h1"
                        component="h3"
                    >
                        Type in a city name ...
                    </Typography>
                    <TextField
                        required
                        id="standard-basic"
                        label="City"
                        onChange={handleChange}
                        value={city}
                    />
                    {cityFetched && (
                        <Typography
                            className={classes.main}
                            variant="h1"
                            component="h3"
                        >
                            {`Current temperature in ${city} : ${outputTemp(
                                "city"
                            )} `}
                            {outputTempDiff()}
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button
                        className={classes.button}
                        onClick={() => handleClick()}
                        variant="contained"
                    >
                        Search
                    </Button>
                </CardActions>
                {appError !== "" && <p>{appError}</p>}
            </Card>
        </Container>
    );
};

export default App;
