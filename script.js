var combatReportEXP = 3000;
var batteryPerReport = 3;
var levelEXP = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,31,34,42,46,50,54,58,63,67,72,77,82,88,93,99,105,111,118,125,131,139,146,154,161,169,177,186,195,204,213,223,233,243,253,263,274,285,296,308,320,332,344,451,468,486,504,522,540,559,579,598,618,639,660,681,703,726,748,771,795,819,843,1126,1161,1195,1231,1267,1304,1341,1379,1418,1457];

function calculateBtn()
{
	var clevel = parseInt(document.getElementById("clevel").value);
  var cexp = parseInt(document.getElementById("cexp").value);
  var tlevel = parseInt(document.getElementById("tlevel").value);
  
  //Current EXP
  var cOverallEXP = cexp;
  var cExpIndex = clevel - 1;
  
  if(clevel == 1)
  	cExpIndex = 0;
  
  for(i = 0; i < cExpIndex; i++)  
  	cOverallEXP += levelEXP[i] * 100;
    
  //Target EXP
	var tOverallEXP = 0;
  var tExpIndex = tlevel - 1;
  
  if(tlevel == 1)
  	tExpIndex = 0;
  
  for(i = 0; i < tExpIndex; i++)  
  	tOverallEXP += levelEXP[i] * 100;
  
  //Calculate
	var totalRequiredEXP = tOverallEXP - cOverallEXP;
  var totalCombatReports = Math.ceil(totalRequiredEXP / combatReportEXP);
  var crRequiredEXP = totalCombatReports * combatReportEXP;
  var battRequired = totalCombatReports * batteryPerReport;
  
  var crOutput = document.getElementById("combatReports");
  var expOutput = document.getElementById("expRequired");
  var battOutput = document.getElementById("batteries")
  
  if(totalRequiredEXP < 0)
  {
  	crOutput.value = null;
  	expOutput.value = null;
  	battOutput.value = null;
  	alert("Invalid Input");
    return;
  }
    
	crOutput.value = totalCombatReports;
  expOutput.value = totalRequiredEXP + " (" + crRequiredEXP + ")";
  battOutput.value = battRequired;
}
