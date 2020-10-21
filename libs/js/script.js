
let userLocation;

const setUserPosition = (position) => {
  userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
}

function success(position) {
  setUserPosition(position)
}

navigator.geolocation.getCurrentPosition(success);



// declare map
const mymap = L.map('mapid').setView([55, 1.5], 6);


// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// var polygon = L.polygon([
//   [51.509, -0.08],
//   [51.503, -0.06],
//   [51.51, -0.047]
// ]).addTo(mymap);
// var marker = L.marker([51.5, -0.09]).addTo(mymap);

// AJAX Calls

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

// 
$('#submit').click(function() {
 
  $.ajax({
    url: "libs/php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: $('#selCountry').val()
    },
    success: function(result) {
      // set country's lat and lng
      countryLat = result['data']['latlng'][0];
      countryLng = result['data']['latlng'][1];
      
      // go to relevant lat and lng
      mymap.flyTo([countryLat, countryLng], 6);
      const popup = L.popup()
            .setLatLng([countryLat, countryLng])
            .setContent(`<div class="country-card">
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         Name:${result['data']['name']}<br>
                         </div>`)
            .openOn(mymap);
      
      // Should I make a function which builds up a template literal to construct the html for the country or just build it up
      // within the AJAX call? 


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});


