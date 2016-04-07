# VacuumCleanerWorld

## Short description
Vacuum cleaner know about map and trash location. You can run four different algorithms - Greedy Algorithm, Random Algorithm, Genetic Algorithm
and Method of Branch and Bound, also you can control robot manualy. When robot starts building trip it creates Adjacency matrix using A start 
algorithm to find shorter route between two points and two additional structures - dicstionary where key is cordinates of two points and value
is array of waypoints between them and array pointMapping that allows us to associate point id with point coordinates.

### Greedy Algorithm
Just pick the nearest point on each iteration. The fastes algorithms among all.

### Random Algorithm
Randomly choose diraction and move on one to three steps. Stop when all rooms are clean.

### Genetic Algorithm
The slowest algorithm among all. It finds better trip compating with greedy and random but takes a lot of time.

### Method of Branch and Bound
Build tree of possible paths with a depth of 5 levels. Take significant amount of time  when we have more then 13 room with trash 
but faster than genetic algorithm and if depth equals number of trash find optimum trip.


### Trash generator 
You have two modes static trsh generation when press generate trash button and when you press run button trash are generated dynamicly.

###Comparing algorithm
If you whant to compare two algorithm choose one, generate trash, build trip, then press restart button and choose another algorith and 
after the second completed building the trip and run through, one can compare amount of wasted energy.
