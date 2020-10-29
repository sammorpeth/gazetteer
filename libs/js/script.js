let border;
let countryMarker;

// declare map
const mymap = L.map('mapid').setView([0, 0], 6);

// When doc has loaded set the view to the user's geolocation
$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userPosLat = position.coords.latitude;
      userPosLng = position.coords.longitude;
      mymap.setView([userPosLat, userPosLng]);
    })
  }
  
})


// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Remove default shadows for leaflet markers. 
L.Icon.Default.prototype.options.shadowSize = [0, 0];

// Construct HTML and add wikipedia marker to map
const buildWikiMarker = (selectedCountryWiki) => {
  selectedCountryWiki.forEach(country => {
    let markerHTML = `
                      
                      <h5>${country['title']}</h5>
                      <p>${country['summary']}<p>
                      <a href='https://${country['wikipediaUrl']}'>Read more...</a>
                      
                      `
      // add marker to map at relevant coords
      const marker = L.marker([country['lat'],country['lng']]).addTo(mymap);
      marker.bindPopup(markerHTML);
  });
    
};

// Construct HTML and add weather marker to map
const buildWeatherMarker = (weatherData) => {
  console.log(weatherData);
  let markerHTML = `
                      <h2>Weather</h2>
                      <ul>
                        <li>Station Name: ${weatherData['stationName']}</li>
                        <li>Last Report: ${weatherData['datetime']}</li>
                        <li>Temperature: ${weatherData['temperature']}</li>
                        <li>Clouds: ${weatherData['clouds']}</li>
                        <li>Humidity: ${weatherData['humidity']}</li>
                        <li>Elevation: ${weatherData['elevation']}</li>
                      </ul>
                  `
  // add marker to map at relevant coords
  const marker = L.marker([weatherData['lat'],weatherData['lng']]);
  const customPopup = L.popup();
  customPopup.setLatLng([weatherData['lat'],weatherData['lng']])
         .setContent(markerHTML)
         .openOn(mymap);
  
 marker.bindPopup(customPopup, {'className' : 'weather-marker'}).addTo(mymap);

}

// Make an alert box appear, then disappear and inform the user of possible issues.
const errorAlert = () => {

 $('.alert-box').removeClass('hidden');

 setTimeout(function() {
  $('.alert-box').addClass('hidden');
}, 6000);
  

}

//--------- AJAX Calls ---------
// Get country codes from decoded JSON 
$.ajax({
  url: "libs/php/ISOCode.php",
  type: 'POST',
  dataType: 'json',
  
  success: function(result) {

    // Look through each country in the array and append them to the select element
    result['data'].forEach(country => {
      $('#selCountry').append($('<option>', {
        value: country['properties']['iso_a2'],
        text: `${country['properties']['iso_a2']} - ${country['properties']['name']}`
      }))
    })

  },
  error: function(jqXHR, textStatus, errorThrown) {
    errorAlert();
    console.log(textStatus);
    console.log(errorThrown);
    console.log(jqXHR);
  }
}); 

// Add borders to relevant country
$('#submit').click(function() {
  $.ajax({
    url: "libs/php/ISOCode.php",
    type: 'POST',
    dataType: 'json',
    success: function(result) {
      
      // Find relevant country code which matches user selected country
      const selectedCountry = result['data'].find(country => {
        return country['properties']['iso_a2'] === $('#selCountry').val()
      });

      // Check to see if there is a current border on the map, if so remove it
      if(mymap.hasLayer(border)) {
        mymap.removeLayer(border);
      };

      // Set border variable to a geoJSON object with relevant country info
      border = L.geoJSON(selectedCountry);

      // add the geoJSON object to the map
      border.addTo(mymap);
      
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorAlert();
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
})

// Add wikipedia marker to map and zoom to relevant coords
$('#wiki-sbmt').click(function() {
  console.log('hi');
  console.log($('#mouseLat').val());
  console.log($('#mouseLng').val());
  $.ajax({
    url: "libs/php/geonamesWiki.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: $('#mouseLat').val(),
      lng: $('#mouseLng').val(),
    },
    success: function(result) {
      
     buildWikiMarker(result['data']);

     // Check if there's any data returned. If not then alert the user.
     if(result['data'].length < 1) {
      errorAlert();
     }
     // Fly to relevant coords
     mymap.flyTo([result['data'][0]['lat'], result['data'][0]['lng']], 10);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorAlert();
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
})

// Add weather marker to map and zoom to relevant coords
$('#weather-sbmt').click(function() {
  console.log('hi');
  console.log($('#mouseLat').val());
  console.log($('#mouseLng').val());
  $.ajax({
    url: "libs/php/geonamesWeather.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: $('#mouseLat').val(),
      lng: $('#mouseLng').val(),
    },
    success: function(result) {
      
     const weatherData = result['data'];
     const weatherDataLat = result['data']['lat'];
     const weatherDataLng = result['data']['lng'];

     mymap.flyTo([weatherDataLat, weatherDataLng], 10);

     console.log(weatherData);
     buildWeatherMarker(weatherData);
     const weatherHTML = `
                          <h2>Weather</h2>
                          <ul>
                            <li>Station Name: ${weatherData['stationName']}</li>
                            <li>Last Report: ${weatherData['datetime']}</li>
                            <li>Temperature: ${weatherData['temperature']}</li>
                            <li>Clouds: ${weatherData['clouds']}</li>
                            <li>Humidity: ${weatherData['humidity']}</li>
                            <li>Elevation: ${weatherData['elevation']}</li>
                          </ul>
     `
     $('#weather-box').html(weatherHTML);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorAlert();
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
})


// Get relevant country info, construct marker HTML and add it as a popup
$('#submit').click(function() {
  $.ajax({
    url: "libs/php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: $('#selCountry').val()
    },
    success: function(result) {

      
      const selectedCountry = result['data'];
      // set country's lat and lng
      countryLat = selectedCountry[0]['latlng'][0];
      countryLng = selectedCountry[0]['latlng'][1];
      
      const countryInfo = `<h2>${selectedCountry[0]['name']}</h2>
                            <ul class="country-info">
                              <li>Region: ${selectedCountry[0]['region']}</li>
                              <li>Subregion: ${selectedCountry[0]['subregion']}</li>
                              <li>Population: ${selectedCountry[0]['population']}</li>
                              <li>Capital City: ${selectedCountry[0]['capital']}</li>
                              <li>Currency: ${selectedCountry[0]['currencies'][0]['name']} - ${selectedCountry[0]['currencies'][0]['code']}</li>
                              <img class="national-flag" src='${selectedCountry[0]['flag']}' alt='${selectedCountry[0]['name']}'s national flag'>
                            <ul>`

      $('#country-box').html(countryInfo);
      
      // go to relevant lat and lng
      mymap.flyTo([countryLat, countryLng], 4);

      if(mymap.hasLayer(countryMarker)) {
        mymap.removeLayer(countryMarker);
      };
    

      countryMarker = L.marker([countryLat,countryLng],)
                                .addTo(mymap);
      

      L.DomUtil.addClass(countryMarker._icon, 'country-marker');
      countryMarker.bindPopup(countryInfo);

      

    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorAlert();
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
    
  }); 
});

// mymap functions
// Get coords of where the user clicked
mymap.on('click', function(e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  // Round to 4 decimal places
  let roundedLat = lat.toFixed(4);
  let roundedLng = lng.toFixed(4);

  // Set the value of the inputs to the current mouse position coords.
  $('#mouseLat').val(roundedLat);
  $('#mouseLng').val(roundedLng);

})

// Get coords of where the mouse is on the map
mymap.addEventListener('mousemove', function(e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  // Round to 4 decimal places
  let roundedLat = lat.toFixed(4);
  let roundedLng = lng.toFixed(4);

  // Set the current latlng in the info-box
  $('#current-lat').html(`Cursor latitude: ${roundedLat}`);
  $('#current-lng').html(`Cursor latitude: ${roundedLng}`);
})





