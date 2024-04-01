const description = 'Gets weather info in any city.';
const usage = '(city)';
const type = '0';

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var city = msg.substring(msg.indexOf(" ") + 1);

const weather = require('weather-js');

weather.find({search: city, degreeType: 'F'}, function(err, weatherData) {
    if(err) console.error(err);
  
    if (weatherData.length > 0) {
        const currentWeather = weatherData[0].current;
        const firstLocation = currentWeather.observationpoint;
        const forecast = weatherData[0].forecast;
      
        let forecastOutput = '';
        for (let i = 0; i < Math.min(forecast.length, 5); i++) {
          forecastOutput += `- ${forecast[i].day}: ${forecast[i].skytextday}\n`;
        }
      
        const output = `Location: ${firstLocation}\n\n- Current: ${currentWeather.skytext}\n${forecastOutput}`;
        console.log(output);
      } else {
        console.log("No weather data available.");
      }
  });