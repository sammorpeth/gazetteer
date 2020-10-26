
// declare map
const mymap = L.map('mapid').setView([55, 1.5], 6);
let border;
let wikiMarker;

// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Construct HTML and add wikipedia marker to map
const buildWikiMarker = (selectedCountryWiki) => {
  selectedCountryWiki.forEach(country => {
    let markerHTML = `
                      <div class='wiki-popup'>
                      <h5 style='text-decoration: underline'>${country['title']}<h5>
                      <p>${country['summary']}<p>
                      <a href='${country['wikipediaUrl']}'></a>
                      </div>
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
                   <ul>
                    <li>${weatherData['stationName']}</li>
                   </ul>
                  `
  // add marker to map at relevant coords
  const marker = L.marker([weatherData['lat'],weatherData['lng']]).addTo(mymap);
  marker.bindPopup(markerHTML);
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
     // Fly to relevant coords
     mymap.flyTo([result['data'][0]['lat'], result['data'][0]['lng']], 10);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
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
     buildWeatherMarker(weatherData);
     const weatherHTML = `
                          <h2>Weather</h2>
                          <ul>
                            <li>Station Name: ${weatherData['stationName']}</li>
                            <li>Last Report: ${weatherData['datetime']}</li>
                            <li>Temperature: ${weatherData['stationName']}</li>
                            <li>Clouds: ${weatherData['clouds']}</li>
                            <li>Humidity: ${weatherData['humidity']}</li>
                            <li>Elevation: ${weatherData['elevation']}</li>
                          </ul>
     `
     $('#info-box').html(weatherHTML);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
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
      
      const countryInfo = `<ul class="country-info">
                            <li>Name: ${selectedCountry[0]['name']}</li>
                            <li>Region: ${selectedCountry[0]['region']}</li>
                            <li>Name: ${selectedCountry[0]['population']}</li>
                            <li>Capital City: ${selectedCountry[0]['capital']}</li>
                            <li>Currency: ${selectedCountry[0]['currencies'][0]['name']} - ${selectedCountry[0]['currencies'][0]['code']}</li>
                            <img class="national-flag" src='${selectedCountry[0]['flag']}' alt='${selectedCountry[0]['name']}'s national flag'>
                          <ul>`

      
      // go to relevant lat and lng
      mymap.flyTo([countryLat, countryLng], 5);
      L.popup({'className': 'custom-popup'})
            .setLatLng([countryLat, countryLng])
            .setContent(countryInfo)
            .openOn(mymap);

      

    },
    error: function(jqXHR, textStatus, errorThrown) {
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





