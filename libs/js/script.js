
// let userLocation;

// const setUserPosition = (position) => {
//   userLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
// }

// function success(position) {
//   setUserPosition(position)
// }

// navigator.geolocation.getCurrentPosition(success);



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

      console.log(selectedCountry['geometry']['coordinates']);

      // const latlngs = selectedCountry['geometry']['coordinates'][0];
      // const latlngs = [
      //   [ // first polygon
      //     [selectedCountry['geometry']['coordinates'][0][0][0],selectedCountry['geometry']['coordinates'][0][0][1],selectedCountry['geometry']['coordinates'][0][0][2]
      //     ,selectedCountry['geometry']['coordinates'][0][0][3]], // outer ring
      //     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
      //   ],
      //   [ // second polygon
      //     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
      //   ]
      // ];
      const latlngs = selectedCountry['geometry']['coordinates'];

      // trying to pass the coordinates above here as a multiline polygon, but it doesn't seem to be working. 
      L.polygon(latlngs, {color: 'red'}).addTo(mymap);
      
      
  
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


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});

// 
// $('#submit').click(function() {
 
//   $.ajax({
//     url: "libs/php/countryBorderPolygons.php",
//     type: 'POST',
//     dataType: 'json',
//     data: {
//       countryCode: $('#selCountry').val()
//     },
//     success: function(result) {
     
//       console.log(result);

//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//       console.log(errorThrown);
//       console.log(jqXHR);
//     }
//   }); 
// });

