import "./WeatherCard.css";
import sunny from "../../assets/sunny.png";
import { useContext } from "react";
import currentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function WeatherCard({ weatherData }) {
  const { currentTemperatureUnit } = useContext(currentTemperatureUnitContext);
  return (
    <section className="weather-card">
      <div className="weather-card__info">
        {weatherData.temp[currentTemperatureUnit]}
        &deg; {currentTemperatureUnit}
      </div>
      <img src={sunny} alt="sunny" className="weather-card__image" />
    </section>
  );
}

export default WeatherCard;
