import React, { use, useEffect, useState, useRef } from "react";
import "./Weather.css";
import search_Icon from "../assets/search.png";
import clear_Icon from "../assets/clear.png";
import cloudy_Icon from "../assets/cloud.png";
import rain_Icon from "../assets/rain.png";
import snow_Icon from "../assets/snow.png";
import drizzle_Icon from "../assets/drizzle.png";
import humidity_Icon from "../assets/humidity.png";
import wind_Icon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "clear-day": clear_Icon,
    cloudy: cloudy_Icon,
    rain: rain_Icon,
    snow: snow_Icon,
    "partly-cloudy-day": drizzle_Icon,
  };

  const search = async (city) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const icon = allIcons[data.currentConditions.icon] || clear_Icon;
      const windSpeedKmh = data.windspeed;
      const windSpeedMph = (windSpeedKmh * 0.621371).toFixed(1);

      // Trim resolvedAddress at first comma
      const trimmedLocation = data.resolvedAddress.split(",")[0];

      setWeatherData({
        humidity: Math.floor(Number(data.currentConditions.humidity)),
        windspeed: Math.floor(Number(windSpeedMph)),
        temperature: Math.floor(Number(data.currentConditions.temp)),
        icon: icon,
        location: trimmedLocation,
      });
    } catch (error) {
      setWeatherData(false);
      alert("Error fetching weather data. Please try again.");
      inputRef.current.value = "";
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    search("Lagos");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="search"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(inputRef.current.value);
            }
          }}
        />
        <img
          src={search_Icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData && (
        <>
          <div className="weather-info">
            <img
              src={weatherData.icon}
              alt="Weather Icon"
              className="weather-icon"
            />
            <p className="temperature">{weatherData.temperature}°F</p>
            <p className="location">{weatherData.location}</p>
          </div>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_Icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_Icon} alt="Wind Icon" />
              <div>
                <p>{weatherData.windspeed} miles/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
