<?php

  $executionStartTime = microtime(true) / 1000;
  
  // Rest Countries - Country Info
  $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=' . $_REQUEST['countryCode'];
  // $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=BS';
  

	$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$infoUrl);

  $resultCountryInfo = curl_exec($ch1);
  $decode = json_decode($resultCountryInfo,true);
  

  curl_close($ch1);

  // Geonames - Nearby Wikipedia
  $wikiUrl='http://api.geonames.org/findNearbyWikipediaJSON?lat='. $decode[0]["latlng"][0]  .'&lng=' .  $decode[0]["latlng"][1] . '&username=sammorpeth';

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

  header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 

?>
