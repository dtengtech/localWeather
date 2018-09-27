let latitude;
let longitude;
let tempC;
let tempF;

function geoFindMe() {
  
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
    document.querySelector('#cel').classList.add('active');
    fetchCity();
    fetchWeather();
  }

  navigator.geolocation.getCurrentPosition(success);
}

function fetchCity(){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBac13YlJmxntt2gW-xw13Lj6YoOxbxLkU`)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data.results[0].address_components);
        let addressList = data.results[0].address_components;
        getCityName(addressList);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function getCityName(address){
    for(let i = 0; i<address.length; i++){
      if(address[i].types.includes('administrative_area_level_2')){
        console.log(address[i].short_name);
        const cityName = address[i].short_name;
        document.querySelector('.location').innerHTML = cityName;
      }
    }
}

function fetchWeather(){
    fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`)
    .then(function(response){
      response.json().then(function(data){
        tempC = data.main.temp.toFixed(1);
        const weather = data.weather[0].main;
        console.log(data.main.temp);
        document.querySelector('.temperature').innerHTML = tempC;
        document.querySelector('.weather').innerHTML = weather;
        document.querySelector('.image').src = data.weather[0].icon;
      })
    });
}

function changeF(temp){
    const newTemp = (temp*9/5+32).toFixed(1);
    tempF = newTemp;
    document.querySelector('.temperature').innerHTML = newTemp+'°F';
}

function changeC(temp){
  const newTemp = ((temp - 32)*5/9).toFixed(1);
  tempC = newTemp;
  document.querySelector('.temperature').innerHTML = newTemp+'°C';
}

window.onload = geoFindMe();

document.querySelector('#far').addEventListener('click', function(){
  if(!document.querySelector('#far').classList.contains('active')){
    document.querySelector('#far').classList.add('active');
    document.querySelector('#cel').classList.remove('active');
    const oldTemp = Number(tempC);
    console.log(oldTemp);
    changeF(oldTemp);
  }
})

document.querySelector('#cel').addEventListener('click', function(){
  if(!document.querySelector('#cel').classList.contains('active')){
    document.querySelector('#cel').classList.add('active');
    document.querySelector('#far').classList.remove('active');
    const oldTemp = Number(tempF);
    changeC(oldTemp);
  }
})

