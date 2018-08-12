var version = "2.1";
var changeLog = [
	["2.1", [
		"Added user-friendly tooltips.",
		"Added calculator adjudant, M249 SAW-chan",
		"Tweaked calculation loop. Now 2-6x faster than before.",
		"Other minor changes and tweaking."
	]],
	["2.0", [
		"Complete CSS Redesign",
		"Main Table and Console are now in one group",
		"Added icon and changed title"
	]],
	["1.3", [
		"Added Combat Simulations (EXP) and Sim Energy",
		"EXP results now show a percentage value that represents how much EXP it is until next level",
		"Some minor changes and tweaking"
	]],
	["1.2", [
		"Tweaked manpower consumption"
	]],
	["1.1", [
		"Added manpower to resource calculation",
		"Changed leader rules: Now you can assign only 1 leader on Corpse Drag Mode",
		"Tweaked console size",
		"Added changelogs"
	]],
	["1.0", [
		"Initial launch"
	]]
];

var combatReportEXP = 3000;
var batteryPerReport = 3;

var expPenalty = 0.2;
var expBoost = 1.5;
var minimumBaseEXP = 3;

/*Source: https://www.reddit.com/r/girlsfrontline/comments/8w16g0/in_case_you_didnt_know_being_mvp_gives_tdolls_30/ */
var leaderBonus = 0.2;
var mvpBonus = 0.3;
var leaderAndMvpBonus = 0.06;

//EXP by level
var levelEXP = [100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2800,3100,3400,4200,4600,5000,5400,5800,6300,6700,7200,7700,8200,8800,9300,9900,10500,11100,11800,12500,13100,13900,14600,15400,16100,16900,17700,18600,19500,20400,21300,22300,23300,24300,25300,26300,27400,28500,29600,30800,32000,33200,34400,45100,46800,48600,50400,52200,54000,55900,57900,59800,61800,63900,66000,68100,70300,72600,74800,77100,79500,81900,84300,112600,116100,119500,123100,126700,130400,134100,137900,141800,145700];
var totalLevelEXP = [0,100,300,600,1000,1500,2100,2800,3600,4500,5500,6600,7800,9100,10500,12000,13600,15300,17100,19000,21000,23100,25300,27600,30000,32500,35100,37900,41000,44400,48600,53200,58200,63600,69400,75700,82400,89600,97300,105500,114300,123600,133500,144000,155100,166900,179400,192500,206400,221000,236400,252500,269400,287100,305700,325200,345600,366900,389200,412500,436800,462100,488400,515800,544300,573900,604700,636700,669900,704300,749400,796200,844800,895200,947400,1001400,1057300,1115200,1175000,1236800,1300700,1366700,1434800,1505100,1577700,1652500,1729600,1809100,1891000,1975300,2087900,2204000,2323500,2446600,2573300,2703700,2837800,2975700,3117500,3263200];

// [0] Stage Name [1] Penalty Level [2] Base EXP [3] Amount of Enemies [4] Turns to Finish [5] Is Combat Sim [6] Energy Consumption
var stageEXP = [
	["1-2", 14, 150, 4, 2],
	["2-3", 29, 220, 4, 0],
	["2-1E", 35, 250, 4, 0],
	["3-5", 50, 290, 4, 0],
	["4-3E", 74, 370, 4, 0],
	["5-4", 79, 380, 5, 0],
	["5-2E", 87, 410, 5, 0],
	["0-2", 100, 490, 5, 1],
	["Basic Training", 100, 20000, 1, 1, true, 1],
	["Intermediate Training", 100, 80000, 1, 1, true, 2],
	["Advanced Training", 100, 240000, 1, 1, true, 3]
];
var combatSimMultiplier = 2;

//Percentage to Decimal
var regSurplusEXP = [0.03, 0.045, 0.06, 0.075, 0.09, 0.105, 0.12, 0.14, 0.16, 0.18, 0.2];
var maxSurplusEXP = [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

var expStorage = [15, 30, 45, 60, 75, 90, 120, 150, 180, 210, 240]; //Simplified, divided by 1000
var crDuration = [12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var crPerBatch = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80];

// [0] Ammo [1] Rations
var HGconsumption = [[10, 10], [15, 15], [20, 20], [25, 25], [30, 30]];
var SMGconsumption = [[25, 20], [40, 30], [55, 40], [70, 50], [85, 60]];
var ARconsumption = [[20, 20], [30, 30], [40, 40], [50, 50], [60, 60]];
var RFconsumption = [[15, 30], [25, 45], [35, 60], [45, 75], [55, 90]];
var MGconsumption = [[40, 30], [65, 45], [90, 60], [115, 75], [140, 90]];
var SGconsumption = [[30, 40], [45, 65], [60, 90], [75, 115], [90, 140]];

var manpowerConsumption = 2;
var ammoConsumption = 0.2;
var rationConsumption = 0.1;

var linkLevels = [1, 10, 30, 70, 90];
var linkMultiplier = [1, 1.5, 2, 2.5, 3];

var amountOfDolls = 6;
var currentLeaders = [];

var mainTableGenerated = false;
var stagesLoaded = false;

var consoleNumber = 0;
var numberDigits = 3;

var idleGif = "assets/M249SAW_wait.gif";
var movingGif = "assets/M249SAW_move.gif";

function generateCalculator()
{
	//Main Table
	if(!mainTableGenerated)
	{
		var mainTable = document.getElementById("mainTable").innerHTML;

		for(i = 1; i < amountOfDolls; i++) 
			document.getElementById("mainTable").innerHTML += mainTable;
			
		var dollType = document.getElementsByName("dollType");
		dollType[0].value = "carry1";
		dollType[1].value = "carry2";

		var isLeader = document.getElementsByName("isLeader");
		var isSupplied = document.getElementsByName("isSupplied");

		isSupplied[0].checked = true;

		if(document.getElementById("corpseDrag").checked)
			isSupplied[0].disabled = true;
	
		isSupplied[1].disabled = true;
		isSupplied[1].checked = true;

		var leaderCB = document.getElementsByClassName("leaderCB");
		var suppliedCB = document.getElementsByClassName("suppliedCB");

		for(i = 0; i < amountOfDolls; i++)
		{ 
			if(i > 1)
				suppliedCB[i].innerHTML = '<input class="checkbox" type="checkbox" name="isSupplied">';

			isLeader[i].id = "isLeader" + i;
			isSupplied[i].id = "isSupplied" + i;

			leaderCB[i].innerHTML += '<label for="' + isLeader[i].id + '"> <div class="tooltip"> Is Leader <span class="tooltiptext"> Minimum of one leader is required. Corpse dragging can have two interchanging leaders. Leaders also get 20% bonus EXP. </span> </div> </label>';
			suppliedCB[i].innerHTML += '<label for="' + isSupplied[i].id + '"> <div class="tooltip"> Is Supplied <span class="tooltiptext"> Supplied dolls will consume Ammo and Rations. </span> </div> </label>'; 
		}

		mainTableGenerated = true;
	}

	resetConsole();
	showChangeLog();
 
	document.getElementById("consoleDiv").style.display = "none";
	//Stages
	if(!stagesLoaded)
	{
		var stage = document.getElementById("stage");
		var stageHTML = "";

		for(i = 0; i < stageEXP.length; i++)
		{
			var stageName = stageEXP[i][0];
			stageHTML += '<option value="' + stageName + '">' + stageName + "</option>"
		}

		stage.innerHTML = stageHTML;
		stagesLoaded = true;
	}
}

function resetCalculator()
{
	var gunType = document.getElementsByName("gunType");
	for(i = 0; i < gunType.length; i++)
	{
		if(!document.getElementById("corpseDrag").checked && i == 1)
			continue;

		gunType[i].value = "hg";
	}

	var clevel = document.getElementsByName("clevel");
	for(i = 0; i < clevel.length; i++)
		clevel[i].value = 1;

	var cexp = document.getElementsByName("cexp");
	for(i = 0; i < cexp.length; i++)
		cexp[i].value = 0;

	var isLeader = document.getElementsByName("isLeader");
	for(i = 0; i < isLeader.length; i++)
		isLeader[i].checked = false;

	currentLeaders = [];

	var isSupplied = document.getElementsByName("isSupplied");
	for(i = 0; i < isSupplied.length; i++)
		isSupplied[i].checked = false;

	var links = document.getElementsByName("links");
	for(i = 0; i < links.length; i++)
		links[i].value = "auto";

	consoleNumber = 0;

	isSupplied[0].checked = true;

	if(document.getElementById("corpseDrag").checked)
		isSupplied[0].disabled = true;
	
	isSupplied[1].disabled = true;
	isSupplied[1].checked = true;

	
	resetConsole();
}

function resetConsole()
{
	var consoleBox = document.getElementById("consoleBox");
	consoleBox.innerHTML = " " + drawLine(57) + "\n Girl's Frontline EXP Calculator | v" + version + " | By QuazzyWazzy\n " + drawLine(57);
	consoleNumber = 0;
}

var toggledElements = [];

function toggleAll(toggle)
{
	if(toggle)
	{
		toggledElements = [];
		var elements = document.body.getElementsByTagName("*");

		for(i = 0; i < elements.length; i++)	
		{
			if(!elements[i].disabled && elements[i].id != "stop" && elements[i].id != "buttonSwitch")
			{
				elements[i].disabled = true;
				toggledElements.push(elements[i]);
			}
		}
	} else
	{
		for(i = 0; i < toggledElements.length; i++)		
			toggledElements[i].disabled = false;		
	}
}

function validateValues()
{
	var elements = document.body.getElementsByTagName("*");

	for(i = 0; i < elements.length; i++)
	{
		if(elements[i].type != "number")
			continue;

		if(parseInt(elements[i].value) > parseInt(elements[i].max))
			elements[i].value = parseInt(elements[i].max);
	}
}

function setMinValues()
{
	var elements = document.body.getElementsByTagName("*");

	for(i = 0; i < elements.length; i++)
	{
		if(elements[i].type != "number")
			continue;

		if(parseInt(elements[i].value) < parseInt(elements[i].min))
			elements[i].value = parseInt(elements[i].min);
	}
}

function calculatorOnInput()
{
	//Calculation Type
	var calcType = document.getElementById("calcType").value;
	var targetText = document.getElementById("targetText");
	var target = document.getElementById("target");

	if(calcType == "targetLevel")
	{
		targetText.innerHTML = "Target Level: ";
		target.max = 100;
	} else if(calcType == "executeRuns")
	{
		targetText.innerHTML = "Amount of Runs: ";
		target.max = 9999;
	}

	//Link Dorm Room Level
	var linkDR = document.getElementById("linkDR");
	var drLevel = document.getElementById("drLevel").value;

	if(linkDR.checked)
	{
		document.getElementById("dcLevel").value = drLevel;
		document.getElementById("dtLevel").value = drLevel;
		document.getElementById("osLevel").value = drLevel;
		document.getElementById("compLevel").value = drLevel;
		document.getElementById("fmLevel").value = drLevel;
	}

	//Enable Resources
	var manpower = document.getElementById("manpower");
	var ammo = document.getElementById("ammo");
	var rations = document.getElementById("rations");
	var batteries = document.getElementById("batteries");
	var energy = document.getElementById("energy");
	
	var targetResource;

	if(calcType == "useResources")
		targetResource = true;
	else
		targetResource = false;

	target.disabled = targetResource;
	manpower.disabled = !targetResource;
	ammo.disabled = !targetResource;
	rations.disabled = !targetResource;
	batteries.disabled = !targetResource;
	energy.disabled = !targetResource;

	//Toggle Corpse Drag Mode
	var corpseDrag = document.getElementById("corpseDrag").checked;
	var gunType2 = document.getElementsByName("gunType")[1];
	var clevel2 = document.getElementsByName("clevel")[1];
	var cexp2 = document.getElementsByName("cexp")[1];
	var isLeader2 = document.getElementsByName("isLeader")[1];
	var links2 = document.getElementsByName("links")[1];
	var isSupplied = document.getElementsByName("isSupplied")[0];

	if(!corpseDrag)
	{
		if(isLeader2.checked)
		{
			isLeader2.checked = false;
			currentLeaders.splice(currentLeaders.indexOf(isLeader2.id), 1);
		}

		if(currentLeaders.length > 1)
		{
			var toRemove = currentLeaders.shift();
			document.getElementById(toRemove).checked = false;
		}

		gunType2.value = "none";
		clevel2.value = 0;
		cexp2.value = 0;
		links2.value = "auto";		
	} else
	{
		isSupplied.checked = true;
	}

	gunType2.disabled = !corpseDrag;
	clevel2.disabled = !corpseDrag;
	cexp2.disabled = !corpseDrag;
	isLeader2.disabled = !corpseDrag;
	links2.disabled = !corpseDrag;
	isSupplied.disabled = corpseDrag;

	var expText = document.getElementsByName("expText");
	var useSurplusEXP = document.getElementById("useSurplusEXP").checked;

	for(i = 0; i < expText.length; i++)
	{
		if(useSurplusEXP)
			expText[i].innerHTML = "Surplus";
		else
			expText[i].innerHTML = "EXP";
	}

	validateValues();
}

function displayConsole()
{
	var mainDiv = document.getElementById("mainDiv").style;
	var consoleDiv = document.getElementById("consoleDiv").style;
	var buttonSwitch = document.getElementById("buttonSwitch");

	mainDiv.display = "none";
	consoleDiv.display = "block";
	buttonSwitch.value = "Show Table";
}

function switchClick(x)
{
	var mainDiv = document.getElementById("mainDiv").style;
	var consoleDiv = document.getElementById("consoleDiv").style;

	if(x.value == "Show Console")
		displayConsole();
	else
	{
		mainDiv.display = "block";
		consoleDiv.display = "none";
		x.value = "Show Console";
	}
}

function isLeaderClick(x)
{
	if(x.checked)
		currentLeaders.push(x.id);
	else
		currentLeaders.splice(currentLeaders.indexOf(x.id), 1);
		
	if(currentLeaders.length > 2)
	{
		var toRemove = currentLeaders.shift();
		document.getElementById(toRemove).checked = false;
	}
}

function resourcesClick(x)
{
	if(document.getElementById("linkResources").checked)
	{
		var manpower = document.getElementById("manpower");
		var ammo = document.getElementById("ammo");
		var rations = document.getElementById("rations");
	
		switch(x.id)
		{
			case manpower.id:
				ammo.value = manpower.value;
				rations.value = manpower.value;
				break;

			case ammo.id:
				manpower.value = ammo.value;
				rations.value = ammo.value;
				break;

			case rations.id:
				manpower.value = rations.value;
				ammo.value = rations.value;
				break;
		}
	}
}

var loopDelay = 10;

var dolls = [];
var dollsLeveled = 0;

var totalBattles = 0;
var stageClears = 0;
var stagesCleared = 0;
var stageIndex = 0;

var target = 0;
var excessSurplusEXP = 0;

var currentCarry = "carry1";
var carry1Leader = false;
var carry2Leader = false;
var calculations = 0;

var acquiredEXP = 0;
var acquiredSurplus = 0;

var manpowerConsumed = 0;
var ammoConsumed = 0;
var rationsConsumed = 0;
var batteriesConsumed = 0;
var energyConsumed = 0;

var dollLeaders = [];
var currentDollLeader = 0;

var nextToConsumeIndex = 0;
var isCombatSim = false;
var isCalculating = false;

function calculateBtn()
{
	dolls = [];
	dollsLeveled = 0;
	totalBattles = 0;
	stageClears = 0;
	stagesCleared = 0;

	target = parseInt(document.getElementById("target").value);
	excessSurplusEXP = 0;

	currentCarry = "carry1";
	carry1Leader = false;
	carry2Leader = false;
	calculations = 0;

	acquiredEXP = 0;
	acquiredSurplus = 0;

	manpowerConsumed = 0;
	ammoConsumed = 0;
	rationsConsumed = 0;
	batteriesConsumed = 0;
	energyConsumed = 0;

	dollLeaders = [];
	currentDollLeader = 0;

	nextToConsumeIndex = 0;

	var stage = document.getElementById("stage").value;

	for(i = 0; i < stageEXP.length; i++)
	{ 
		if(stage == stageEXP[i][0])
		{
			stageIndex = i; 
			break;
		}
	}

	isCombatSim = stageEXP[stageIndex][5]; 

	var corpseDrag = document.getElementById("corpseDrag").checked;
	var calcType = document.getElementById("calcType").value;

	var ammo = parseInt(document.getElementById("ammo").value);
	var rations = parseInt(document.getElementById("rations").value);
	var batteries = parseInt(document.getElementById("batteries").value);

	var suppliedDolls = 0;

	displayConsole();
	setMinValues();

	for(i = 0; i < amountOfDolls; i++)
	{
		var gunType = document.getElementsByName("gunType")[i].value;
		var dollType = document.getElementsByName("dollType")[i].value;

		//If there's no carry
		if(dollType != "regular" && gunType == "none" && corpseDrag)
		{
			Log("[!] Carry can't be <none> on Corpse Drag Mode");
			return;
		}

		//No doll = skip
		if(gunType == "none")
			continue;

		var clevel = parseInt(document.getElementsByName("clevel")[i].value);
		var cexp = parseInt(document.getElementsByName("cexp")[i].value);
		var isLeader = document.getElementsByName("isLeader")[i].checked;
		var isSupplied = document.getElementsByName("isSupplied")[i].checked;
		var links = document.getElementsByName("links")[i].value;	

		if(isLeader)
		{
			dollLeaders.push(i);
			currentDollLeader = i;

			if(dollType == "carry1")
				carry1Leader = true;		

			if(dollType == "carry2")
				carry2Leader = true;
		}

		if(isSupplied)
			suppliedDolls++;
		
		var doll = new TDoll(gunType, dollType, clevel, cexp, isLeader, isSupplied, links, dolls.length);
		dolls.push(doll);
	}

	if(dolls.length == 0)
	{
		Log("[!] No dolls to calculate.");
		return;
	}

	if(suppliedDolls == 0)
		Log("Note: There are no dolls supplied.");

	if(!isCombatSim)
	{
		if(dollLeaders.length < 1)
		{	
			Log("[!] One leader must be assigned.");
			return;
		}

		if(corpseDrag && ((carry1Leader || carry2Leader) && dollLeaders.length < 2))
		{
			Log("[!] No leader is assigned after switching. Please select a second one.");
			return;
		}
	}

	if(isCombatSim)
	{
		if(dollLeaders.length > 0)
			Log("Note: Leader dolls will not get bonus EXP from Combat Sim.");

		if(corpseDrag)
			Log("Note: Corpse Drag will switch carrries every run. It is not reommended for Combat Sim.");
	}

	setGif(movingGif);
	toggleAll(true);
	isCalculating = true;

	Log("Inputs Valid. Beginning Calculation.");
	Log("Calculation Type: " + calcType + " | Stage Selected: " + stageEXP[stageIndex][0] + " | Dolls Active: " + dolls.length);
	Log("EXP Boost: " + document.getElementById("expBoost").checked + " | Utilize Surplus EXP: " + document.getElementById("useSurplusEXP").checked + " | Corpse Drag Mode: " + corpseDrag);
	
	calculationLoop();
}

var c = 0;
var stopLoop = false;

function calculationLoop()
{
	if(stopLoop)
	{
		loopFinish();
		return;
	}

	var corpseDrag = document.getElementById("corpseDrag").checked;
	var calcType = document.getElementById("calcType").value;

	setTimeout( function () {

		for(i = 0; i < dolls.length; i++)
		{
			var dollType = dolls[i].dollType;

			if((corpseDrag && (dollType == "regular" || dollType == currentCarry)) || !corpseDrag)
				dolls[i].simulateBattle();

			if(calcType == "targetLevel" && dolls[i].nlevel >= target)
				dollsLeveled++;

			dolls[i].rationsConsumed = Math.round(dolls[i].rationsConsumed);

			calculations++;
		}

		/* Old Calculation
		var dollType = dolls[c].dollType;

		if((corpseDrag && (dollType == "regular" || dollType == currentCarry)) || !corpseDrag)
			dolls[c].simulateBattle();

		if(calcType == "targetLevel" && dolls[c].nlevel >= target)
				dollsLeveled++;

		dolls[c].rationsConsumed = Math.round(dolls[c].rationsConsumed);

		calculations++;
		c++;
		
		if(c < dolls.length)
			calculationLoop();
		else
		{*/
			c = 0;
			totalBattles++;

			if(isCombatSim)
				energyConsumed += stageEXP[stageIndex][6];

			setResultValues();
			
			if(stageClears > stagesCleared)
			{
				if(corpseDrag)
				{
					var newCarry;

					if(currentCarry == "carry1")
						newCarry = "carry2";
					else if(currentCarry == "carry2")
						newCarry = "carry1";

					currentCarry = newCarry;

					var newLeader = currentDollLeader;

					if(dollLeaders.length > 1)
					{
						if(currentDollLeader == dollLeaders[0])
							newLeader = dollLeaders[1];
						else if(currentDollLeader == dollLeaders[1])
							newLeader = dollLeaders[0];
					}

					if(currentCarry == "carry1" && carry1Leader)
						newLeader = 0;
					else if(currentCarry == "carry2" && carry2Leader)
						newLeader = 1;

					currentDollLeader = newLeader;
				}
				stagesCleared++;
			}
			
			if(calcType == "targetLevel" && dollsLeveled == dolls.length)
			{
				loopFinish();
				return;
			}

			if(calcType == "executeRuns" && stageClears == target)
			{
				loopFinish();
				return;
			}

			if(calcType == "useResources")
			{
				var manpower = parseInt(document.getElementById("manpower").value);
				var ammo = parseInt(document.getElementById("ammo").value);
				var rations = parseInt(document.getElementById("rations").value);
				var batteries = parseInt(document.getElementById("batteries").value);
				var energy = parseInt(document.getElementById("energy").value);
				var useSurplusEXP = document.getElementById("useSurplusEXP").checked;

				if((manpowerConsumed >= manpower || ammoConsumed >= ammo || rationsConsumed >= rations) && !isCombatSim)
				{
					loopFinish();
					return;
				}

				if((useSurplusEXP && batteriesConsumed >= batteries))
				{
					loopFinish();
					return;
				}

				if(isCombatSim && energyConsumed >= energy)
				{
					loopFinish();
					return;
				}
			}
			
			dollsLeveled = 0;
			calculationLoop();				
		//} Old Calculation

	}, loopDelay);
}

function stopCalculation()
{
	if(isCalculating)
	{
		stopLoop = true;
		displayConsole();
		setGif(idleGif);
	}
}

function loopFinish()
{
	toggleAll(false);
	displayConsole();

	Log(drawLine(100));

	if(stopLoop)
		Log("Calculation Stopped | Showing results of " + calculations + " calculations");
	else
		Log("Calculation Finished | Total of " + calculations + " calculations");

	for(i = 0; i < dolls.length; i++)
	{
		var gunType = dolls[i].gunType.toUpperCase();
		var resultText = "";
		var expPercentage = Math.round((dolls[i].nexp / levelEXP[dolls[i].nlevel - 1]) * 100);

		if(dolls[i].nlevel == 100)
			expPercentage = 100;

		resultText += "Doll " + (i + 1) + " (" + gunType + ")";
		resultText += " Level: " + dolls[i].clevel + " - " + dolls[i].nlevel;
		resultText += ", EXP: " + dolls[i].nexp + " (" + expPercentage + "%)";
		resultText += ", Manpower: " + dolls[i].manpowerConsumed;
		resultText += ", Ammo: " + dolls[i].ammoConsumed;
		resultText += ", Rations: " + dolls[i].rationsConsumed;
		resultText += ", Reports Consumed: " + dolls[i].crConsumed;

		Log(resultText);
	}

	Log(drawLine(100));
	stopLoop = false;
	isCalculating = false;
	setGif(idleGif);
}

function setResultValues()
{
	document.getElementById("EXPacquired").value = acquiredEXP;
	document.getElementById("surplusEXP").value = acquiredSurplus;

	var combatReportEXPacquired = Math.floor(acquiredEXP / combatReportEXP);
	var combatReportSurplus = Math.floor(acquiredSurplus / combatReportEXP);

	document.getElementById("combatReportEXP").value = combatReportEXPacquired;
	document.getElementById("combatReportSurplus").value = combatReportSurplus;
	document.getElementById("totalBattles").value = totalBattles;

	stageClears = Math.floor(totalBattles / stageEXP[stageIndex][3]);
	document.getElementById("stageClears").value = stageClears;

	var useSurplusEXP = document.getElementById("useSurplusEXP").checked;
	var crBatches = document.getElementById("crBatches");
	var dtLevel = parseInt(document.getElementById("dtLevel").value);
	var fmLevel = parseInt(document.getElementById("fmLevel").value);
	var minLevel = Math.min(dtLevel, fmLevel);

	if(useSurplusEXP)
		crBatches.value = Math.ceil(combatReportSurplus / crPerBatch[minLevel]);
	else
		crBatches.value = Math.ceil(combatReportEXPacquired / crPerBatch[minLevel]);

	document.getElementById("crHours").value = parseInt(crBatches.value) * crDuration[parseInt(document.getElementById("compLevel").value)];

	var batteries = document.getElementById("batteriesC");

	if(useSurplusEXP)
		batteriesConsumed = combatReportSurplus * batteryPerReport;
	else
		batteriesConsumed = combatReportEXPacquired * batteryPerReport;

	batteries.value = batteriesConsumed;

	document.getElementById("manpowerC").value = manpowerConsumed;
	document.getElementById("ammoC").value = ammoConsumed;
	document.getElementById("rationsC").value = Math.round(rationsConsumed);
	document.getElementById("energyC").value = energyConsumed;
}

function levelToEXP(level, EXP)
{
	if(EXP == null)
		EXP = 0;

	return totalLevelEXP[level - 1] + EXP;
}

function EXPtoLevel(EXP)
{
	for(i = 0; i < totalLevelEXP.length; i++)
	{
		if(EXP >= totalLevelEXP[i] && EXP < totalLevelEXP[i + 1])
		{
			var remainderEXP = EXP - totalLevelEXP[i];
			return [i + 1, remainderEXP];
		}
	}
}

function TDoll(gunType, dollType, clevel, cexp, isLeader, isSupplied, links, index)
{
	this.gunType = gunType;
	this.dollType = dollType;
	this.clevel = clevel;
	this.isLeader = isLeader;
	this.isSupplied = isSupplied;
	this.links = links;
	this.index = index;

	this.nlevel = clevel;
	this.nexp = cexp;
	this.expAcquired = 0;
	this.surplusEXP = 0;
	this.stagesCleared = 0;

	this.manpowerConsumed = 0;
	this.ammoConsumed = 0;
	this.rationsConsumed = 0;
	this.crConsumed = 0;

	this.getLinks = function()
	{
		var tEXP = levelToEXP(this.nlevel, this.nexp);

		if(this.links != "auto")
			return parseInt(this.links);

		if(tEXP >= levelToEXP(linkLevels[0]) && tEXP < levelToEXP(linkLevels[1]))
			return 1;

		if(tEXP >= levelToEXP(linkLevels[1]) && tEXP < levelToEXP(linkLevels[2]))
			return 2;

		if(tEXP >= levelToEXP(linkLevels[2]) && tEXP < levelToEXP(linkLevels[3]))
			return 3;

		if(tEXP >= levelToEXP(linkLevels[3]) && tEXP < levelToEXP(linkLevels[4]))
			return 4;

		if(tEXP >= levelToEXP(linkLevels[4]))
			return 5;
	}

	this.simulateBattle = function()
	{
		var totalEXP;

		if(!isCombatSim)
		{
			// [0] Stage Name [1] Penalty Level [2] Base EXP [3] Amount of Enemies
			// Get Base EXP From Stage
			var stage = stageEXP[stageIndex];
			var penaltyLevel = stage[1];
			var baseEXP = stage[2];
		
			// Calculate Penalty EXP
			var penaltyEXP = 0;
			var penaltyMultiplier = 0;

			if(this.nlevel > penaltyLevel)	
				penaltyMultiplier = Math.ceil((this.nlevel - penaltyLevel) / 10) * expPenalty;	

			if(penaltyMultiplier >= 1)
				penaltyEXP = minimumBaseEXP;
			else
				penaltyEXP = baseEXP * (1 - penaltyMultiplier);

			totalEXP = penaltyEXP;

			//EXP Boost
			if(document.getElementById("expBoost").checked)
				totalEXP *= expBoost;
		
			// Leader and MVP Bonuses
			// Note: MVP is always the Carry Doll
			var expMultiplier = 1;

			if(this.isLeader && this.index == currentDollLeader)
				expMultiplier += leaderBonus;

			if(this.dollType != "regular")
				expMultiplier += mvpBonus;

			if(this.isLeader && this.dollType != "regular")
				expMultiplier += leaderAndMvpBonus;

			totalEXP *= expMultiplier;
			totalEXP *= linkMultiplier[this.getLinks() - 1];
			totalEXP = Math.round(totalEXP);
		} else		
			totalEXP = Math.round((stageEXP[stageIndex][2] * combatSimMultiplier) / dolls.length);

		this.expAcquired += totalEXP;
		acquiredEXP += totalEXP;

		// Consume Resources
		if(!isCombatSim)
		{
			if(this.isSupplied)
				this.consumeResources();

			if(this.stagesCleared == stageClears)
			{
				this.consumeManpower();
				this.stagesCleared++;
			}
		}

		var calcType = document.getElementById("calcType").value;
		var useSurplusEXP = document.getElementById("useSurplusEXP").checked;

		// Add Up 
		if(this.nlevel < 100)
		{
			this.nexp += totalEXP;			

			var dcLevel = parseInt(document.getElementById("dcLevel").value);
			var rsurplusEXP = Math.round(totalEXP * regSurplusEXP[dcLevel]);
			this.surplusEXP += rsurplusEXP;
			acquiredSurplus += rsurplusEXP;
			
			if(useSurplusEXP)
			{
				excessSurplusEXP += rsurplusEXP;

				if((calcType == "targetLevel" && this.nexp < levelToEXP(target)) || calcType != "targetLevel")
				{
					var surplusCR = Math.floor(excessSurplusEXP / combatReportEXP);
					var crEXP = surplusCR * combatReportEXP;

					if(nextToConsumeIndex > dolls.length - 1)
						nextToConsumeIndex = 0;

					if(nextToConsumeIndex == this.index && surplusCR > 0)
					{
						this.nexp += crEXP;
						this.crConsumed += surplusCR;
					
						excessSurplusEXP -= crEXP;
						nextToConsumeIndex++;
					}
				}

				if(calcType == "targetLevel" && this.nexp >= levelToEXP(target) && nextToConsumeIndex == this.index)
					nextToConsumeIndex++;
			}

			this.levelUp();
			return;
		}
		
		var osLevel = parseInt(document.getElementById("osLevel").value);
		var msurplusEXP = Math.round(totalEXP * maxSurplusEXP[osLevel]);
		this.surplusEXP += msurplusEXP;
		acquiredSurplus += msurplusEXP;
		
		if(useSurplusEXP)
			excessSurplusEXP += msurplusEXP;
			
		if(nextToConsumeIndex == this.index)
			nextToConsumeIndex++; 
	}

	this.consumeResources = function()
	{
		var ammo = 0;
		var rations = 0;

		switch(this.gunType)
		{
			case "hg":
				ammo = HGconsumption[this.getLinks() - 1][0];
				rations = HGconsumption[this.getLinks() - 1][1];
				break;

			case "smg":
				ammo = SMGconsumption[this.getLinks() - 1][0];
				rations = SMGconsumption[this.getLinks() - 1][1];
				break;

			case "ar":
				ammo = ARconsumption[this.getLinks() - 1][0];
				rations = ARconsumption[this.getLinks() - 1][1];
				break;

			case "rf":
				ammo = RFconsumption[this.getLinks() - 1][0];
				rations = RFconsumption[this.getLinks() - 1][1];
				break;

			case "mg":
				ammo = MGconsumption[this.getLinks() - 1][0];
				rations = MGconsumption[this.getLinks() - 1][1];
				break;

			case "sg":
				ammo = SGconsumption[this.getLinks() - 1][0];
				rations = SGconsumption[this.getLinks() - 1][1];
				break;
		}

		ammo *= ammoConsumption;

		var stageEnemies = stageEXP[stageIndex][3];
		var stageTurns = stageEXP[stageIndex][4];
		var rationsPerStage = stageEnemies + stageTurns;
		var rationRate = rationsPerStage / stageEnemies;

		rations *= rationConsumption * rationRate;		

		this.ammoConsumed += ammo;
		ammoConsumed += ammo;

		this.rationsConsumed += rations;
		rationsConsumed += rations;
	}

	this.levelUp = function()
	{
		var toNextLevel = levelEXP[this.nlevel - 1];

		if(this.nexp >= toNextLevel)
		{
			this.nlevel++;
			this.nexp -= toNextLevel;

			toNextLevel = levelEXP[this.nlevel - 1];

			if(this.nexp >= toNextLevel)
				this.levelUp();
		}
	}

	this.consumeManpower = function()
	{
		var manpower = this.getLinks() * manpowerConsumption;

		this.manpowerConsumed += manpower;
		manpowerConsumed += manpower;
	}
}

function Log(string, isChangeLog)
{
	var consoleBox = document.getElementById("consoleBox");
	var logText = "\n";

	if(!isChangeLog)
	{
		logText += " [" + String(consoleNumber).padStart(numberDigits, "0") + "]";
		consoleNumber++;
	}

	logText += " " + string;
	consoleBox.innerHTML += logText;

	consoleBox.scrollTop = consoleBox.scrollHeight;
}

function LogImportant(string)
{
	Log(string);
	displayConsole();
}

function drawLine(length)
{
	return "-".padStart(length - 1, "-");
}

function showChangeLog()
{
	for(i = 0; i < changeLog.length; i++)
	{
		var logVersion = "[v" + changeLog[i][0] + "]--";
		var changes = changeLog[i][1];

		for(j = 0; j < changes.length; j++)
		{
			if(j == 0)
				Log(logVersion + changes[j], true);
			else
				Log(changes[j].padStart(logVersion.length + changes[j].length, "-"), true);
		}

		Log(drawLine(80), true);
	}
	document.getElementById("consoleBox").scrollTop = 0;
}

var lastRandom = 0;
var idleMessage = ["Where do you think you're poking at?", "Don't you have anything else to do?", "D-don't touch me there, commander", "I really want a fluffy body pillow", "Boring...", "Ugghh...", "Please don't make me work", "Get those numbers crunching", "Got any results yet?", "Is there anything you want, commander?", "Don't expect too much of me..."];
var movingMessage = ["Here we go again", "Please be patient, commander", "This may take a while", "Why don't you sit there and wait?", "You're distracting me, commander", "I hate doing math... or doing anything in general", "I wanna go to bed already"];

function randomizeText()
{
	var randomText = document.getElementById("randomText");
	var text = "";
	var random = 0;

	if(!isCalculating)
	{
		random = Math.floor(Math.random() * idleMessage.length);

		while (random == lastRandom) 
			random = Math.floor(Math.random() * idleMessage.length);

		text = idleMessage[random];
	} else
	{
		random = Math.floor(Math.random() * movingMessage.length);

		while (random == lastRandom) 
			random = Math.floor(Math.random() * movingMessage.length);

		text = movingMessage[random];
	}

	lastRandom = random;
	randomText.innerHTML = text; 
}


function setGif(url)
{
	var img = new Image();
	var topLeftGif = document.getElementById("topLeftGif");

	img.onload = function()
	{
		topLeftGif.src = url;
		topLeftGif.width = this.width;
		topLeftGif.height = this.height;
	};

	img.src = url;
}
//dummy commit
