 // APIkey obtianed from openweathermap
 const APIkey = "2eb739bb039aaa2d1662466cad18ef33";

// created function from html page  
function documentPage() {
    const input = document.querySelector("#city-input");
    const search = document.querySelector("#search-btn");
    const clearBtn = document.querySelector("#clear-history");
    const currentName = document.querySelector("#city-name");
    const currentPic = document.querySelector("#current-pic");
    const currentTemp = document.querySelector("#temperature");
    const currentHum = document.querySelector("#humidity");
    const currentWind = document.querySelector("#wind-speed");
    const currentUV = document.querySelector("#UV-index");
    const history = document.querySelector("#history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
        console.log(searchHistory);
    
       
    
        function getWeather(cityName) {
          let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
          axios.get(queryURL)
          .then(function(response){
              console.log(response);
    //  Parse response to display current weather conditions
          //  Used "date" objects got it from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
              const currentDate = new Date(response.data.dt*1000);
              console.log(currentDate);
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1;
              const year = currentDate.getFullYear();
              currentName.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
              let weatherPic = response.data.weather[0].icon;
              currentPic.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
              currentPic.setAttribute("alt",response.data.weather[0].description);
              currentTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
              currentHum.innerHTML = "Humidity: " + response.data.main.humidity + "%";
              currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
          let lat = response.data.coord.lat;
          let lon = response.data.coord.lon;
          let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey  + "&cnt=1";
          axios.get(UVQueryURL)
          .then(function(response){
              let UVIndex = document.createElement("span");
              UVIndex.setAttribute("class","badge badge-danger");
              UVIndex.innerHTML = response.data[0].value;
              currentUV.innerHTML = "UV Index: ";
              currentUV.append(UVIndex);
          });
    //  Using saved city name, execute a 5-day forecast get request from openweathermap API
          let cityID = response.data.id;
          let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIkey;
          axios.get(forecastQueryURL)
          .then(function(response){
    //  Parse response to display forecast for next 5 days underneath current conditions
              console.log(response);
              const forecastEls = document.querySelectorAll(".forecast");
              for (i=0; i<forecastEls.length; i++) {
                  forecastEls[i].innerHTML = "";
                  const forecastIndex = i*8 + 4;
                  const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                  const forecastDay = forecastDate.getDate();
                  const forecastMonth = forecastDate.getMonth() + 1;
                  const forecastYear = forecastDate.getFullYear();
                  const forecastDateEl = document.createElement("p");
                  forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                  forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                  forecastEls[i].append(forecastDateEl);
                  const forecastWeatherEl = document.createElement("img");
                  forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                  forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                  forecastEls[i].append(forecastWeatherEl);
                  const forecastTempEl = document.createElement("p");
                  forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                  forecastEls[i].append(forecastTempEl);
                  const forecastHumidityEl = document.createElement("p");
                  forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                  forecastEls[i].append(forecastHumidityEl);
                  }
              })
          });  
      } 
    
    // function listener on click button
    search.addEventListener("click",function() {
      const searchValue = input.value;
      getWeather(searchValue);
      searchHistory.push(searchValue);
      localStorage.setItem("search",JSON.stringify(searchHistory));
      displaySearchHistory();
    })
    
    clearBtn.addEventListener("click",function() {
      searchHistory = [];
      displaySearchHistory();
    })
    
    function k2f(K) {
      return Math.floor((K - 273.15) *1.8 +32);
    }
    
    function displaySearchHistory() {
      history.innerHTML = "";
      for (let i=0; i<searchHistory.length; i++) {
          const historyItem = document.createElement("input");
          historyItem.setAttribute("type","text");
          historyItem.setAttribute("readonly",true);
          historyItem.setAttribute("class", "form-control d-block bg-white");
          historyItem.setAttribute("value", searchHistory[i]);
          historyItem.addEventListener("click",function() {
              getWeather(historyItem.value);
          })
          history.append(historyItem);
      }
    }
    
    displaySearchHistory();
    if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
    }
    
    
    
    
}
 documentPage();
    