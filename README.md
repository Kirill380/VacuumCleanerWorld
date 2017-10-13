# WARNING
**IT IS A DEMO PROJECT THAT HAS CRITICAL ISSUES IN FUNCTIONALITY AND HARDCODED VALUES**

# Vacuum Cleaner World on JS

![main view](img/main.png)

### How to run

1. Install [npm](https://www.npmjs.com/get-npm) on your OS.
2. Install webpack -- `npm install webpack`
3. Run next command to download required dependencies -- `npm install`
4. Run `webpack` command in the project directory.
5. Now you can open `index.html` in browser and start playing. 

### Short description
Vacuum cleaner know about map and trash location. You can run four different algorithms - *Greedy Algorithm*, *Random Algorithm*, *Genetic Algorithm*
and *Method of Branch and Bound*, also you can control robot manually. When robot starts building trip it creates Adjacency matrix using *A start algorithm* to find shorter route between two points and two additional structures - dictionary where key is coordinates of two points and value
is array of waypoints between them and array pointMapping that allows us to associate point id with point coordinates.

#### Greedy Algorithm
Just pick the nearest point on each iteration. The fastest algorithms among all.

#### Random Algorithm
Randomly choose direction and move on one to three steps. Stop when all rooms are clean.

#### Genetic Algorithm
The slowest algorithm among all. It finds better trip comparing with greedy and random but takes a lot of time.

#### Method of Branch and Bound
Build tree of possible paths with a depth of 5 levels. Take significant amount of time  when we have more then 13 room with trash 
but faster than genetic algorithm and if depth equals number of trash find optimum trip.


#### Trash generator 
You have two modes static trash generation when press generate trash button and when you press **Run button** trash are generated dynamically.

#### Comparing algorithm
If you want to compare two algorithm choose one, generate trash, build trip, then press **Restart button** and choose another algorithm and 
after the second completed building the trip and run through, one can compare amount of wasted energy.
