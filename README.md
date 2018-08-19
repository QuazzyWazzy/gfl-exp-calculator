# Girl's Frontline EXP Calculator
An EXP Calculator for the mobile game, Girls Frontline. Made especially to calculate corpse-dragging method efficiency.

---

## How Does it Work
### Battle Simulations
The calculator will run battle simulations of the selected stage using the dolls on the main table that would act as an echelon. These simulations would be treated as if the echelon has completed the stage, regardless of whether or not they can actually complete it in-game. These simulations are only for the sake of calculating EXP and how many resources it would consume per run. 

### Calculation Type
The conditions for the calculation will vary based on the selected calculation type.

* Reach Target Level will run simulations until all dolls in the echelon reach the target level.
* Execute Amount of Runs will run simulations based on the amount of runs specified.
* Use Resources Allocated will run simulations based on the amount of resources allocated.

### Carry Dolls and Corpse Drag Mode
The usual corpse dragging requires two damage dealers (particularly an AR) that are interchanged every run to save resources. When Corpse Drag mode is enabled, the calculator would imitate this process by interchanging the carry doll used in every run. When disabled, the 6th doll (the 2nd Carry Doll) would also be disabled since it can only ever be used when corpse dragging.

Note: Carry dolls would be treated as if they are the MVP for that battle, thus gaining bonus EXP. This applies whether or not Corpse Drag Mode is enabled.

Another Note: If a carry doll is set as a leader, and corpse dragging is enabled, you are required to set another leader since carry dolls are interchanged per turn.

### Use Surplus EXP
Apart from getting EXP from battles, dolls also generate a small amount of surplus EXP. Surplus EXP generation will vary based on the selected stage and the specified data room level.

When Use Surplus EXP is enabled, this surplus EXP generated from battle will be turned into combat reports that would then be distributed to each doll throughout the calculation process. This can be helpful as it can decrease the amount of turns needed to level your dolls, but it will also require a lot of batteries, depending on the amount of surplus EXP.

---

## How to Use
### Putting Dolls in the Main Table
The very first step is to fill in the table with the necessary information. Each row represents one doll, and the table as a whole is treated as an echelon. If corpse dragging, put your damage dealers on the same row where 1st and 2nd Carry Doll types are. If not, place your MVP doll on the same row as the 1st Carry Doll type.

Also make sure to put in the current level and EXP for every doll. Links correspond the amount of the dummy links the doll has. Setting this on auto will dynamically add links to that doll as it levels throughout the calculation (Example, you have a level 8 doll with only 1 link. When this doll reaches level 10, another link would be added to this doll). If you don't plan on dummy linking a particular doll, you can specify a static dummy link number instead.

### Choosing the Stage
Here you can choose what stage the battle simulations would take place in. Ideal corpse dragging spots are 4-3E and 0-2. More information about selecting the right stage can be found on [Dmesse's Popular Leveling Routes](http://dmesse.egloos.com/3567918). Make sure your selected stage's level range matches with your echelon's average level. EXP Penalty can greatly decrease the amount of EXP generated per battle, which wastes more resources and requires even more runs.

In addition to the stages available, there are also Combat Simulations. These require Sim Energy instead of the usual resources and provide more EXP than regular stages. Do note that every Combat Sim is treated as if the whole stage is cleared, meaning the amount of base EXP is doubled every turn.

### Choosing a Calculation Type, Using Surplus EXP, and Enabling Corpse Drag Mode
This has already been explained. Please refer above.

### Data Room Level and Data Room Components
This will determine the speed and the amount of surplus EXP you will generate per battle, and also the amount and time it takes to create combat reports. This is only useful if Use Surplus EXP is enabled.

### Resources
This is where you can allocate resources for calculation. Do note that if you have Use Surplus EXP enabled, make sure you also allocate a sufficient amount of batteries for combat reports.

Also remember that Combat Sim requires Sim Energy.

* Basic Traing = 1 energy
* Intermediate Training = 2 energy
* Advanced Training = 3 energy

---

## Calculation Results
### The Console
The console displays warnings and is also where most of the results is outputted. The console also contains the changelog.

### The Graph
This line graph shows the level growth of the dolls throughout the calculation. There are a few settings below the graph that you can tweak to change how the data is visualized.

### The Results Table
The downmost part of the page. This part displays live data incrementing throughout the calculation.

---

## Other Things
### Calculator Adjudant
Her main purpose is to show if the calculator is calculating.

Why does she have dialogue, you ask? Well... I got bored, okay? (plus I like her personality OwO)
