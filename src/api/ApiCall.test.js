import axios from "axios";
import { queryCityWeather, queryLatLongWeather } from "./ApiCall";

jest.mock("axios");

describe("queryCityWeather", () => {
  it("fetches successfully data from OpenWeatherAPI", async () => {
    const data = {
      data: {
        name: "Dublin",
        main: {},
        cod: 200,
      },
    };
    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(queryCityWeather("Dublin")).resolves.toEqual(data);
  });

  it("fetches erroneously data from OpenWeatherAPI", async () => {
    const errorMessage = "Network Error";

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );
    await expect(queryCityWeather("Dublin")).rejects.toThrow(errorMessage);
  });
});
