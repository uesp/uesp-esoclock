<?php
	$OUTPUT_DATE_FORMAT = "Y-m-d\TH:i:s";
	$currentDate = new DateTime;
	
	$dateTimes = array(
		"UTC" => array(
			"name" => "utc",
			"timezone" => "UTC",
			"date" => null,
		),
		"EST" => array(
			"name" => "est",
			"timezone" => "America/New_York",
			"date" => null,
		),
		"PST" => array(
			"name" => "pst",
			"timezone" => "America/Los_Angeles",
			"date" => null,
		),
	);
	
	foreach($dateTimes as $key => $dateTime)
	{
		$dateTimes[$key]['date'] = new DateTime(null, new DateTimeZone($dateTime['timezone']));
	}
	
	
	function getDateValue($name)
	{
		global $dateTimes, $OUTPUT_DATE_FORMAT;
		
		if ($dateTimes[$name] == null) $name = "utc";
		return $dateTimes[$name]['date']->format($OUTPUT_DATE_FORMAT);
	}
	
	
	function printDates()
	{
		global $dateTimes, $OUTPUT_DATE_FORMAT;
		
		foreach($dateTimes as $dateTime)
		{
			print "\t\tvar ". $dateTime['name'] ."Time = moment('" . $dateTime['date']->format($OUTPUT_DATE_FORMAT) . "');\n";
		}
	}
	
	
	function printJsonDates()
	{
		global $dateTimes, $OUTPUT_DATE_FORMAT;
		$outputData = array();
		
		foreach($dateTimes as $dateTime)
		{
			$outputData[$dateTime['name'] . 'Time'] = $dateTime['date']->format($OUTPUT_DATE_FORMAT);
		}
		
		echo json_encode($outputData);
	}
	
	
	if (array_key_exists('json', $_REQUEST))
	{
		header('Content-Type: application/json');
		printJsonDates();
		exit(1);
	}
	
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<title>UESP:ESO Clock</title>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="esoclock.css" />
	<script type="text/javascript" src="jquery-1.10.2.js"></script>
	<script type="text/javascript" src="moment.min.js"></script>
	<script type="text/javascript" src="esoclock.js"></script>
	<script type="text/javascript">
<?php
	printDates();
?>
	</script>
</head>
<body>
	<h1>Unofficial Elder Scrolls Online Game Clocks</h1>
	<hr />
	<div id="gameTimeBlock">
		<div class="timeTitle">Game Time</div><br />
		<div id="gameTime" class="time"></div>
	</div>
	<hr />
	<div id="utcTimeBlock">
		<div class="timeTitle">UTC Time</div><br />
		<div id="utcTime" class="time"></div>
	</div>
	<hr />
	<div id="estTimeBlock">
		<div class="timeTitle">EST Time</div><br />
		<div id="estTime" class="time"></div>
	</div>
	<hr />
	<div id="pstTimeBlock">
		<div class="timeTitle">PST Time</div><br />
		<div id="pstTime" class="time"></div>
	</div>
	<hr />
	<div id="sitefooter">
		Hosted by the <a href="http://www.uesp.net">Unofficial Elder Scrolls Pages (uesp.net)</a>. Contact <a href="mailto:dave@uesp.net">Dave</a> for more information on this page.
	</div>
</body>
</html>
