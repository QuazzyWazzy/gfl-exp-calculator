var combatReportEXP = 3000;
var levelEXP = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,31,34,42,46,50,54,58,63,67,72,77,82,88,93,99,105,111,125,131,139,146,154,161,169,177,186,195,204,213,223,233,243,253,263,274,285,296,308,320,332,344,451,468,486,504,522,540,559,579,598,618,639,660,681,703,762,748,771,795,819,843,1126,1161,1195,1231,1267,1304,1341,1379,1418,1457];

function calculate()
{
	var clevel = document.getElementById("clevel").value;
  var cexp = document.getElementById("cexp").value;
  var tlevel = document.getElementById("tlevel").value;
  
  var combatReports = document.getElementById("combatReports");
  var expRequired = document.getElementById("expRequired");
  
  //Current EXP
  var cOverallEXP = cexp;
  var cExpIndex = clevel - 1;
  
  if(clevel == 1)
  	cExpIndex = 1;
  
  for(i = 0; i < cExpIndex; i++)  
  	cOverallEXP += levelEXP[i];
  
  //Target EXP
	var tOverallEXP = 0;
  var tExpIndex = tlevel - 1;
  
  if(tlevel == 1)
  	tExpIndex = 1;
  
  for(i = 0; i < tExpIndex; i++)  
  	tOverallEXP += levelEXP[i];
  
  //Calculate
	var totalRequiredEXP = tOverallEXP - cOverallEXP;
  
  if(totalRequiredEXP < 0)
  	return;
    
	combatReports.value = Math.round(totalRequiredEXP / combatReportEXP);
  expRequired.value = totalRequiredEXP;
}
