<?php
  header('Content-Type: application/json; charset=UTF-8');

  // // Country Borders JSON
  // // get relevant JSON data
  // $jsondata = file_get_contents('../json/countryBorders.geo.json');
  // // convert the JSON into PHP variable
  // $decode = json_decode($jsondata, true);
  
  // $output['data']['borders'] += $decode['features'];

  $executionStartTime = microtime(true) / 1000;
  
  // Rest Countries - Country Info
  $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=CH';

	$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$infoUrl);

  $resultCountryInfo = curl_exec($ch1);
  $decode = json_decode($resultCountryInfo,true);
  // var_dump($decode[0]["latlng"][0]);

  

  curl_close($ch1);
  // $output['data'][0]['latlng'][0]

  // Geonames - Nearby Wikipedia
  $wikiUrl='http://api.geonames.org/findNearbyWikipediaJSON?lat='. $decode[0]["latlng"][0] .'&lng=' .  $decode[0]["latlng"][1]. '&username=sammorpeth';

	$ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$wikiUrl);

	$resultWiki = curl_exec($ch2);

	curl_close($ch2);

  $decode += json_decode($resultWiki,true);
  

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = $decode;

	
	echo json_encode($output); 

?>
