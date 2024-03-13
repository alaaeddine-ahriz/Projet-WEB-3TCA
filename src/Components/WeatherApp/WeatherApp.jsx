import React, { useState } from 'react'
import './WeatherApp.css'

import search_icon from "../Assets/search.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
import clear_sky from "../Assets/01d@2x.png";
// import clear_sky from "../Assets/sun.gif";
import few_clouds from "../Assets/02d@2x.png";
import scattered_clouds from "../Assets/03d@2x.png";
import broken_clouds from "../Assets/04d@2x.png";
import shower_rain from "../Assets/09d@2x.png";
import rain from "../Assets/10d@2x.png";
import thunderstorm from "../Assets/11d@2x.png";
import snow from "../Assets/13d@2x.png";
import mist from "../Assets/50d@2x.png";

export const WeatherApp = () => {

    let api_key = "41ad9850d25b95de0ec5b350ddd03b16";

    const [wicon,setWicon] = useState(few_clouds);
    const [minMaxTemp, setMinMaxTemp] = useState({ min: 0, max: 0 }); // New state variable for min and max temperatures

    const search = async ( ) => {
        const element = document.getElementsByClassName("cityInput");
        if(element[0].value==="")
        {
            return 0;
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;


        let response = await fetch(url);
        let data = await response.json();

        setMinMaxTemp({ min: Math.floor(data.main.temp_min), max: Math.floor(data.main.temp_max) });

        const humidity = document.getElementsByClassName("humidity-percent");
        const wind = document.getElementsByClassName("wind-speed");
        const temperature = document.getElementsByClassName("weather-temp");
        const location = document.getElementsByClassName("weather-location");

        humidity[0].innerHTML = Math.floor(data.main.humidity)+" %";
        wind[0].innerHTML = Math.floor(data.wind.speed)+" km/h";
        temperature[0].innerHTML = Math.floor(data.main.temp)+"°";
        location[0].innerHTML = data.name;

        if(data.weather[0].icon==="01d" || data.weather[0].icon==="01n")
        {
            setWicon(clear_sky);
        }
        
        else if(data.weather[0].icon==="02d" || data.weather[0].icon==="02n")
        {
            setWicon(few_clouds);
        }

        else if(data.weather[0].icon==="03d" || data.weather[0].icon==="03n")
        {
            setWicon(scattered_clouds);
        }

        else if(data.weather[0].icon==="04d" || data.weather[0].icon==="04n")
        {
            setWicon(broken_clouds);
        }

        else if(data.weather[0].icon==="09d" || data.weather[0].icon==="09n")
        {
            setWicon(shower_rain);
        }

        else if(data.weather[0].icon==="10d" || data.weather[0].icon==="10n")
        {
            setWicon(rain);
        }

        else if(data.weather[0].icon==="11d" || data.weather[0].icon==="11n")
        {
            setWicon(thunderstorm);
        }

        else if(data.weather[0].icon==="13d" || data.weather[0].icon==="13n")
        {
            setWicon(snow);
        }

        else if(data.weather[0].icon==="50d" || data.weather[0].icon==="50n")
        {
            setWicon(mist);
        }

        else
        {
            setWicon(clear_sky);
        }
    }

  return (
    <div className='container'>
        <div className="top-bar">
            <input type="text" className="cityInput" placeholder='Search'/>
            <div className="search-icon" onClick={()=>{search()}}>
                <img src={search_icon} alt="" />
            </div>
        </div>
        <di className="weather-image">
            <img src={wicon} alt="" />
        </di>
        <div className="weather-temp">20°</div>
        <div className="weather-location">Villeurbanne</div>
        <div className="min-max-temp">H:{minMaxTemp.min}° | L:{minMaxTemp.max}°</div>
        <div className="data-container">
            <div className="element">
                <img src={humidity_icon} alt="" className='icon'/>
                <div className="data">
                    <div className="humidity-percent">50%</div>
                    <div className="text">Humidité</div>
                </div>
            </div>
            <div className="element">
                <img src={wind_icon} alt="" className='icon'/>
                <div className="data">
                    <div className="wind-speed">15 km/h</div>
                    <div className="text">Vents</div>
                </div>
            </div>
        </div>
    </div>
  )
}
