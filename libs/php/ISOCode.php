<?php


  // get relevant JSON data
  $jsondata = file_get_contents('../json/countryBorders.geo.json');
  // convert the JSON into PHP variable
  $decode = json_decode($jsondata, true);

  // for each country in the array check the iso_a2 code
  // if it matches the provided country code return the matching country


	$output['data'] = $decode['features'];

  echo json_encode($output);

?>