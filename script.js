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

// [0] Stage Name [1] Penalty Level [2] Base EXP [3] Amount of Enemies
var stageEXP = [
	["1-2", 14, 150, 4],
	["2-3", 29, 220, 4],
	["2-1E", 35, 250, 4],
	["3-5", 50, 290, 4],
	["4-3E", 74, 370, 4],
	["5-4", 79, 380, 5],
	["5-2E", 87, 410, 5],
	["0-2", 100, 490, 5],
];

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

var linkLevels = [1, 10, 30, 70, 90];
var linkMultiplier = [1, 1.5, 2, 2.5, 3];

var amountOfDolls = 6;
var currentLeaders = [];

var mainTableGenerated = false;
var stagesLoaded = false;

var consoleNumber = 0;
var numberDigits = 3;

function generateCalculator()
{
	//Main Table
	if(!mainTableGenerated)
	{
		var mainTable = document.getElementById("mainTable").innerHTML;

		for(i = 0; i < amountOfDolls - 1; i++)	
			document.getElementById("mainTable").innerHTML += mainTable;

		mainTableGenerated = true;
	}

	var dollType = document.getElementsByName("dollType");
	dollType[0].value = "carry1";
	dollType[1].value = "carry2";

	var isSupplied = document.getElementsByName("isSupplied");
	isSupplied[0].checked = true;

	if(document.getElementById("corpseDrag").checked)
		isSupplied[0].disabled = true;

	isSupplied[1].checked = true;
	isSupplied[1].disabled = true;

	var isLeader = document.getElementsByName("isLeader");
	for(i = 0; i < isLeader.length; i++)	
		isLeader[i].id = "isLeader" + i;

	//Stages
	if(!stagesLoaded)
	{
		var stage = document.getElementById("stage");
		var stageHTML = "";

		for(i = 0; i < stageEXP.length; i++)
		{
			var stageName = stageEXP[i][0];
			stageHTML += "<option value=" + stageName + ">" + stageName + "</option>"
		}

		stage.innerHTML = stageHTML;
		stagesLoaded = true;
	}

	resetConsole();
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

	generateCalculator();
}

function resetConsole()
{
	var consoleBox = document.getElementById("consoleBox");
	consoleBox.innerHTML = " --------------------------------------\n Corpse Dragging EXP Calculator | v1.0\n --------------------------------------";
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
			if(!elements[i].disabled && elements[i].id != "stop")
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

		if(parseInt(elements[i].value) < parseInt(elements[i].min) || (elements[i].value == "" && !elements[i].disabled))
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
		targetText.innerHTML = "Target Level: ";
	else if(calcType == "executeRuns")
		targetText.innerHTML = "Amount of Runs: ";

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
	var ammo = document.getElementById("ammo");
	var rations = document.getElementById("rations");
	var batteries = document.getElementById("batteries");

	var targetResource;
	if(calcType == "useResources")
		targetResource = true;
	else
		targetResource = false;

	target.disabled = targetResource;
	ammo.disabled = !targetResource;
	rations.disabled = !targetResource;
	batteries.disabled = !targetResource;

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
		var ammo = document.getElementById("ammo");
		var rations = document.getElementById("rations");
	
		if(x.id == ammo.id)
			rations.value = ammo.value;
		else
			ammo.value = rations.value;
	}
}

var loopDelay = 10;

var dolls = [];
var dollsLeveled = 0;

var totalBattles = 0;
var stageClears = 0;
var stageIndex = 0;

var target = 0;
var excessSurplusEXP = 0;

var currentCarry = "carry1";
var carry1Leader = false;
var carry2Leader = false;
var calculations = 0;

var acquiredEXP = 0;
var acquiredSurplus = 0;

var ammoConsumed = 0;
var rationsConsumed = 0;
var batteriesConsumed = 0;

var dollLeaders = [];
var currentDollLeader = 0;

var nextToConsumeIndex = 0;

function calculateBtn()
{
	dolls = [];
	dollsLeveled = 0;
	totalBattles = 0;
	stageClears = 0;

	target = parseInt(document.getElementById("target").value);
	excessSurplusEXP = 0;

	currentCarry = "carry1";
	carry1Leader = false;
	carry2Leader = false;
	calculations = 0;

	acquiredEXP = 0;
	acquiredSurplus = 0;

	ammoConsumed = 0;
	rationsConsumed = 0;
	batteriesConsumed = 0;

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

	var corpseDrag = document.getElementById("corpseDrag").checked;
	var calcType = document.getElementById("calcType").value;

	var ammo = parseInt(document.getElementById("ammo").value);
	var rations = parseInt(document.getElementById("rations").value);
	var batteries = parseInt(document.getElementById("batteries").value);

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
		
		var doll = new TDoll(gunType, dollType, clevel, cexp, isLeader, isSupplied, links, i);
		dolls.push(doll);
	}

	if(dolls.length == 0)
	{
		Log("[!] No dolls selected");
		return;
	}

	if((corpseDrag && dollLeaders.length < 2) || dollLeaders.length < 1)
	{
		if(corpseDrag)
			Log("[!] Corpse Drag Mode requires 2 leaders");
		else
			Log("[!] One leader must be assigned");

		return;
	}

	toggleAll(true);
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
		
		var dollType = dolls[c].dollType;

		if((corpseDrag && (dollType == "regular" || dollType == currentCarry)) || !corpseDrag)
			dolls[c].simulateBattle();

		if(calcType == "targetLevel" && dolls[c].nlevel >= target)
				dollsLeveled++;

		c++;
		calculations++;
		
		if(c < dolls.length)
			calculationLoop();
		else
		{
			c = 0;
			totalBattles++;
			
			if(corpseDrag)
			{
				var newCarry;
				var newLeader;

				if(currentCarry == "carry1")
					newCarry = "carry2";
				else if(currentCarry == "carry2")
					newCarry = "carry1";

				currentCarry = newCarry;

				if(currentDollLeader == dollLeaders[0])
					newLeader = dollLeaders[1];
				else if(currentDollLeader == dollLeaders[1])
					newLeader = dollLeaders[0];

				if(currentCarry == "carry1" && carry1Leader)
					newLeader = 0;
				else if(currentCarry == "carry2" && carry2Leader)
					newLeader = 1;

				currentDollLeader = newLeader;
			}

			setResultValues();
			
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
				var ammo = parseInt(document.getElementById("ammo").value);
				var rations = parseInt(document.getElementById("rations").value);
				var batteries = parseInt(document.getElementById("batteries").value);
				var useSurplusEXP = document.getElementById("useSurplusEXP").checked;

				if(ammoConsumed >= ammo || rationsConsumed >= rations || (useSurplusEXP && batteriesConsumed >= batteries))
				{
					loopFinish();
					return;
				}
			}
			
			dollsLeveled = 0;
			calculationLoop();				
		}

	}, loopDelay);
}

function stopCalculation()
{
	stopLoop = true;
}

function loopFinish()
{
	toggleAll(false);

	Log("----------------------------------------------------------------------------");

	if(stopLoop)
		Log("Calculation Stopped | Showing results of " + calculations + " calculations");
	else
		Log("Calculation Finished | Total of " + calculations + " calculations");

	for(i = 0; i < dolls.length; i++)
	{
		var gunType = dolls[i].gunType.toUpperCase();

		Log("Doll " + (i + 1) + " (" + gunType + ") Level:" + dolls[i].clevel + " - " + dolls[i].nlevel + ", EXP:" + dolls[i].nexp + ", Ammo:" + dolls[i].ammoConsumed + ", Rations:" + dolls[i].rationsConsumed + ", Reports Consumed:" + dolls[i].crConsumed);
	}

	Log("----------------------------------------------------------------------------");
	stopLoop = false;
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

	document.getElementById("ammoC").value = ammoConsumed;
	document.getElementById("rationsC").value = rationsConsumed;
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

		var totalEXP = penaltyEXP;

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
		this.expAcquired += totalEXP;
		acquiredEXP += totalEXP;

		// Consume Resources
		if(this.isSupplied)
			this.consumeResources();

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

				if((calcType == "targetLevel" && this.nlevel < target) || calcType != "targetLevel")
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

		ammo /= 5;
		rations /= 5;

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
}

function Log(string)
{
	var consoleBox = document.getElementById("consoleBox");
	consoleBox.innerHTML += "\n [" + String(consoleNumber).padStart(numberDigits, "0") + "] " + string;
	consoleBox.scrollTop = consoleBox.scrollHeight;
	consoleNumber++;
}
