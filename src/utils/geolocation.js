const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const success = (position) => {
  const { latitude, longitude } = position.coords;
  console.log({ latitude, longitude });
  return { latitude, longitude };
};

const errors = (err) => {
  console.error(`ERROR(${err.code}): ${err.message}`);
};

const getCurrentCoords = () => {
  if (navigator.geolocation) {
    console.log("geolocation is available on this browser");
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      switch (result.state) {
        case "granted":
          navigator.geolocation.getCurrentPosition(success);
          break;
        case "prompt":
          navigator.geolocation.getCurrentPosition(success, errors, options);
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
};

export default getCurrentCoords;
