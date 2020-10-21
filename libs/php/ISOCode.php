<?php
  // get relevant JSON data
  $jsondata = file_get_contents('../json/countryBorders.geo.json');
  // convert the JSON into PHP variable
  $decode = json_decode($jsondata, true);
  
	$output['data'] = $decode['features'];

  echo json_encode($output);

?>