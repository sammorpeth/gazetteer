
let userLocation;

const setUserPosition = (position) => {
  userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
}

function success(position) {
  setUserPosition(position)
}

navigator.geolocation.getCurrentPosition(success);



// declare map
const mymap = L.map('mapid').setView([55.0006, 1.5], 6);

// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// AJAX Calls
 
$.ajax({
  url: "libs/php/ISOCode.php",
  type: 'POST',
  dataType: 'json',
  data: {
   
  },
  success: function(result) {

    
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

$('#submit').click(function() {
 
  $.ajax({
    url: "libs/php/ISOCode.php",
    type: 'POST',
    dataType: 'json',
    data: {
      
    },
    success: function(result) {

      const matchedCountry = result['data'].find(country => {
        return country['properties']['iso_a2'] === $('#selCountry').val();
      });
      
      
      
      
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});



