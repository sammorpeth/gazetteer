
// declare map
const mymap = L.map('mapid').setView([55, 1.5], 6);
let border;
let wikiMarker;

// add tile layers
var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const buildWikiMarker = (selectedCountryWiki) => {

  selectedCountryWiki.forEach(country => {
    let markerHTML = `
      <div class='wiki-popup'>
      <h5 style='text-decoration: underline'>${country['title']}<h5>
      <p>${country['summary']}<p>
      <a href='${country['wikipediaUrl']}'></a>
      </div>
      `
      const marker = L.marker([country['lat'],country['lng']]).addTo(mymap);
      marker.bindPopup(markerHTML);
  });
    
}


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

$('#weather-sbmt').click(function() {
  $.ajax({
    url: "libs/php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: $('#mouseLat').val(),
      lng: $('#mouseLng').val(),
    },
    success: function(result) {
      
     console.log(result['data']);
  
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

 
      
      const selectedCountryWiki = result['data']['geonames']
      console.log(selectedCountryWiki)
      buildWikiMarker(selectedCountryWiki);


      // TODO: format all of the info in an attractive way
      

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
    
  }); 
  
  
});


  mymap.on('click', function(e) {
   let lat = e.latlng.lat;
   let lng = e.latlng.lng;
  
   console.log( lat);
   console.log( lng);

   L.popup({'className': 'custom-popup'})
            .setLatLng([lat, lng])
            .setContent(`<ul>
                         <li id='mouseLat'>Latitude: ${lat}</li><br>
                         <li id='mouseLng'>Longitude: ${lng}<br></li>
                         </ul>
                         <button type='submit' value='weather' id='weather-sbmt'>Weather</button>
                         <input type='submit' value='wikipedia' id='weather-sbmt'></input>
            `)
            .openOn(mymap);
  
  })



