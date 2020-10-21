
// declare map
const mymap = L.map('mapid').setView([55, 1.5], 6);
let border;

// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


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
      console.log(border);

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
            .setContent(`Name:${result['data']['name']}<br>`)
            .openOn(mymap);

      // TODO: format all of the info in an attractive way


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});



