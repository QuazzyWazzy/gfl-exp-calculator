# Girl's Frontline EXP Calculator
An EXP Calculator for the mobile game, Girls Frontline.

Made especially to calculate corpse-dragging method efficiency.

<br>
  
## How to Use:
### The Main Table
This table has 6 rows of different doll properties, with each row being a different doll. This table will be your echelon. The table has two modes: Corpse Drag Mode and Normal Mode (We'll get on to that later).

#### Doll Properties
* Gun Type - Specifies the gun type of the doll. Determines how much resources a doll would consume ber battle.

* Doll Type - This property can't be changed but it is very important. This property has three types: 1st Carry, 2nd Carry, and Regular. 1st and 2nd Carries are the dolls that mainly do the damage when corpse dragging. When corpse dragging is off, 2nd Carry would be disabled. (Note: Carry dolls will always have the MVP Bonus EXP. Make sure to put the right dolls)

* Current Level and Current EXP: Pretty self-explanatory.

* Is Leader: Check this if that doll is your assigned leader. (Leaders get bonus EXP). When corpse dragging, you need atleast 2 leaders (Ideally you would want to make your carry dolls the leader)

* Is Supplied: You would only ever want to check this if you're not corpse dragging. Determines whether or not the doll is supplied in battle.

* Links: The amount of dummy links of your doll. Auto would make the links dynamic (say, if your doll is level 20 and your target level is 40, the doll would be dummy linked when it reaches 30). Don't select auto if you want a static link number.

<br>

### The Where-you-input-stuff-part (Can't think of a name)
This mainly where you input how everything would be calculated. Think like buttons on a calculator.

* Stage - Specifies the stage where battle simulation would take place. It is also one of the main factors of your EXP growth. (Note: Penalty Level is also calculated. Make sure you pick the right stage for your dolls)

* Data Room Level And Components - Determines how much Surplus EXP you gain and how fast you can make combat reports. Check "Link All" to sync every data room component level.

* EXP Boost - Check this if there's an EXP Boost event. Otherwise, ignore it. Or not. There's not really much I can do if you *really* want to press it.

* Utilize Surplus EXP - When enabled, all the Surplus EXP your dolls would generate throughout the calculation would be turned to Combat Reports that would then be fed to them one by one. Can save you a lot of time but would also require a bunch of batteries, depending on how much you make.

* Ammo, Rations, and Batteries - This is where you can allocate resources for calculation. Check "Link All" to link Ammo and Rations values.

<br>

### The Calculation Process
Where the poorly coded magic happens. Calculations can take from a few seconds to a few minutes (since nested loops kept breaking/crashing/freezing I had to make a workaround by making delayed loops. It's pretty slow I know, am still a bit new to coding)

#### Calculation Type
This will determine how everything would be calculated. There are three calculation types (wow, so diverse) you can choose from:

* Reach Target Level - In this mode, the calculator would run battle simulations (no, not the one in-game) of the selected stage until every doll in the echelon has reached the target level. 

* Execute Amount of Runs - When selected, the calculator would run battle simulations based on the amount of runs specified. (Note: Runs = Stage Clears. Each stage has around 4 to 5 enemies)

* Use Resources Allocated - This will enable the resource input boxes so you can allocate resources. This will run simulations until one resource runs out.

#### Corpse Dragging
Now, if corpse dragging is enabled, a few other stuff happens during the calculation.

Every stage clear, the carry dolls (and leaders) are interchanged (just like in-game). In normal mode, the row for the 2nd carry doll is disabled since it is only ever used when switching carries. 

#### The Results and Console
Displays the output of the calculation.

<br>
<br>
<br>

Yeah, that's pretty much it. I might update this with new stuff and optimize some parts of the code. (Actually I was also gonna add manpower, parts and repair tickets to resources but there's too many factors to determine how many repairs it would take per run)
