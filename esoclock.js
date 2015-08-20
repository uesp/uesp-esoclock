var outputFormat = 'dddd, MMMM DD YYYY - HH:mm:ss';

var GAMETIME_REALSECONDS_OFFSET = 6471;
var GAMETIME_DAY_OFFSET = 0.37;
var DEFAULT_GAMETIME_OFFSET = 1396083600;
var DEFAULT_GAMETIME_YEAROFFSET = 582;
var DEFAULT_REALSECONDSPERGAMEDAY = 20955;
var DEFAULT_REALSECONDSPERGAMEYEAR = DEFAULT_REALSECONDSPERGAMEDAY * 365;
var DEFAULT_REALSECONDSPERGAMEHOUR = DEFAULT_REALSECONDSPERGAMEDAY / 24;
var DEFAULT_REALSECONDSPERGAMEMINUTE = DEFAULT_REALSECONDSPERGAMEHOUR / 60;
var DEFAULT_REALSECONDSPERGAMESECOND = DEFAULT_REALSECONDSPERGAMEMINUTE / 60;
var DEFAULT_MOONPHASESTARTTIME = 1396083600 - 207360 - 180000;
var DEFAULT_MOONPHASETIME = 100 * 3600;

var TES_MONTHS = [
		"Morning Star",
		"Sun's Dawn", 
		"First Seed",
		"Rain's Hand",
		"Second Seed",
		"Midyear",
		"Sun's Height",
		"Last Seed",
		"Hearthfire",
		"Frostfall",
		"Sun's Dusk",
		"Evening Star"
	];

var TES_WEEKS = [
		"Sundas",
		"Morndas",
		"Tirdas",
		"Middas",
		"Turdas",
		"Fredas",
		"Loredas" 
	];


function computeGameTimeFromUTC(inputTime)
{
	if (inputTime == null) inputTime = estTime;
	timeStamp = parseFloat(inputTime.format("X"));
	
	offsetTime = timeStamp - (DEFAULT_GAMETIME_OFFSET - GAMETIME_REALSECONDS_OFFSET) - GAMETIME_DAY_OFFSET * DEFAULT_REALSECONDSPERGAMEDAY;
	gameDayTime = offsetTime % DEFAULT_REALSECONDSPERGAMEDAY;
	year = Math.floor(offsetTime / DEFAULT_REALSECONDSPERGAMEYEAR) + DEFAULT_GAMETIME_YEAROFFSET;
	yearDay = Math.floor((offsetTime % DEFAULT_REALSECONDSPERGAMEYEAR) / DEFAULT_REALSECONDSPERGAMEDAY);
	day= 0;
	month = 0;
	
	if (yearDay < 30) {
		day = yearDay + 1;
		month = 0;
	} else if (yearDay < 58) {
		day = yearDay - 29;
		month = 1;
	} else if (yearDay < 89) {
		day = yearDay - 57;
		month = 2;
	} else if (yearDay < 119) {
		day = yearDay - 88;
		month = 3;
	} else if (yearDay < 150) {
		day = yearDay - 118;
		month = 4;
	} else if (yearDay < 180) {
		day = yearDay - 149;
		month = 5;
	} else if (yearDay < 211) {
		day = yearDay - 179;
		month = 6;
	} else if (yearDay < 242) {
		day = yearDay - 210;
		month = 7;
	} else if (yearDay < 272) {
		day = yearDay - 241;
		month = 8;
	} else if (yearDay < 303) {
		day = yearDay - 271;
		month = 9;
	} else if (yearDay < 333) {
		day = yearDay - 302;
		month = 10;
	} else {
		day = yearDay - 333;
		month = 11;
	}

	weekDay = Math.floor((offsetTime / DEFAULT_REALSECONDSPERGAMEDAY) % 7);
	monthStr = TES_MONTHS[month];
	weekDayStr = TES_WEEKS[weekDay];
	hour = Math.floor((gameDayTime / DEFAULT_REALSECONDSPERGAMEHOUR) % 24);
	minute = Math.floor((gameDayTime / DEFAULT_REALSECONDSPERGAMEMINUTE) % 60);
	second = Math.floor((gameDayTime / DEFAULT_REALSECONDSPERGAMESECOND) % 60);
	
	hourStr = hour.toFixed(0);
	minuteStr = minute.toFixed(0);
	secondStr = second.toFixed(0);
	if (hourStr.length == 1) hourStr = "0" + hourStr;
	if (minuteStr.length == 1) minuteStr = "0" + minuteStr;
	if (secondStr.length == 1) secondStr = "0" + secondStr;
	
		// "2E 582 Hearth's Fire, Morndas 08:12:11" 
	//timeStr = "2E " + year + " " + monthStr + "(" + month + "), " + weekDayStr + "(" + weekDay + "), " + hourStr + ":" + minuteStr + ":" + secondStr;
	//timeStr = "2E " + year + " " + monthStr + ", " + weekDayStr + ", " + hourStr + ":" + minuteStr + ":" + secondStr;
	timeStr = weekDayStr + ", " + monthStr + " " + day + " 2E " + year + " - " + hourStr + ":" + minuteStr + ":" + secondStr;
	
	return timeStr;
}


function computeMoonPhase(inputTime)
{
	if (inputTime == null) inputTime = estTime;
	timeStamp = parseFloat(inputTime.format("X"));
	
	moonOffsetTime = timeStamp - DEFAULT_MOONPHASESTARTTIME;
	moonPhase = moonOffsetTime / DEFAULT_MOONPHASETIME;
	moonPhaseNorm = moonPhase % 1;
	phaseStr = "Unknown";
	
	if (moonPhaseNorm <= 0.06) {
		phaseStr = "New";
	} else if (moonPhaseNorm <= 0.185) {
		phaseStr = "Waxing Crescent";
	} else if (moonPhaseNorm <= 0.31) {
		phaseStr = "First Quarter";
	} else if (moonPhaseNorm <= 0.435) {
		phaseStr = "Waxing Gibbous";
	} else if (moonPhaseNorm <= 0.56) {
		phaseStr = "Full";
	} else if (moonPhaseNorm <= 0.685) {
		phaseStr = "Waning Gibbous";
	} else if (moonPhaseNorm <= 0.81) {
		phaseStr = "Third Quarter";
	} else if (moonPhaseNorm <= 0.935) {
		phaseStr = "Waning Crescent";
	} else {
		phaseStr = "New";
	}
	
	relMoonPhase = (100 - Math.abs((moonPhase % 1)- 0.5)*200).toFixed(0);
	phaseStr += ", " + relMoonPhase + "% full";
	
	return phaseStr;
}


function onTick()
{
	utcTime.add(1, 's');
	estTime.add(1, 's');
	cenTime.add(1, 's');
	mntTime.add(1, 's');
	pstTime.add(1, 's');
	alkTime.add(1, 's');
	cetTime.add(1, 's');
	astTime.add(1, 's');
	
	drawClock();
}


function onUpdate()
{
	$.get('esoclock.php?json', function( data ) {
		utcTime = moment(data.utcTime);
		pstTime = moment(data.pstTime);
		cenTime = moment(data.cenTime);
		mntTime = moment(data.mntTime);
		estTime = moment(data.estTime);
		alkTime = moment(data.alkTime);
		cetTime = moment(data.cetTime);
		astTime = moment(data.astTime);
		cetTime.add(1, 'h');
	});
	
	drawClock();
}


function drawClock()
{
	$('#gameTime').html(computeGameTimeFromUTC(estTime) + "<br /><font size='-0.5'>Moons are " + computeMoonPhase(estTime) + "</font>");
	$('#utcTime').text(utcTime.format(outputFormat) +" UTC");
	$('#estTime').text(estTime.format(outputFormat) + " EST");
	$('#cenTime').text(cenTime.format(outputFormat) + " Central");
	$('#mntTime').text(mntTime.format(outputFormat) + " Mountain");
	$('#pstTime').text(pstTime.format(outputFormat) + " PST");
	$('#alkTime').text(alkTime.format(outputFormat) + " Alaska");
	$('#astTime').text(astTime.format(outputFormat) + " AEST");
	$('#cetTime').text(cetTime.format(outputFormat) + " CET");
}


function onDocumentReady(event)
{
	cetTime.add(1, 'h');
	
	setInterval(onTick, 1000);
	setInterval(onUpdate, 1000 * 60);
	
	onUpdate();
}


$(document).ready(onDocumentReady);
