/**
 * chromosome = [] => 1->3->4->2 => {0,8}->{9,0}->{3,4}->{1,1}
 * */

export default function Genetic(pointsMapping, pathDictionary, graphMatrix, options) {
    var populationSize = 70;
    var crossoverSize = 3;
    var iterations = 400;
    var mutationSize = 2;
    var mutationProbability = 0.5;
    var population = [];
    var newPopulation = [];
    var generationCount = 0;

    function init() {
        //create initial trip -> [0..pointsMapping.length-1]
        var initChr = [];
        initChr = pointsMapping.map((v, i) => i);
        for (var i = 0; i < populationSize; i++) {
            //copy array
            var newChr = initChr.slice(0, initChr.length);
            shuffle(newChr);
            population.push(newChr);
        }
    }


    function crossover(chr1, chr2) {
        var newChr = chr2.slice(0, chr2.length);
        for (var i = 0; i < crossoverSize; i++) {
            var switchI = Math.floor(Math.random * (chr1.length - 1));
            var gen1 = chr1[switchI];
            var gen2 = chr2[switchI];
            // find same gen in chromosome 2 but in diff position
            var ind2 = chr2.filter(gen => gen == gen1)[0];
            // replace gen2 with gen1
            newChr[switchI] = gen1;
            // put switched gen on position of the same gen
            newChr[ind2] = gen2;
        }
        newPopulation.push(newChr);
    }

    function mutation() {
        for (var i = 0; i < mutationSize; i++) {
            var chromosome = newPopulation[Math.floor(Math.random() * (newPopulation.length - 1))];
            if (Math.random() < mutationProbability) {
                var firstI = Math.floor(Math.random * (chromosome.length - 1));
                var secondI = Math.floor(Math.random * (chromosome.length - 1));
                var firstP = chromosome[firstI];
                chromosome[firstI] = chromosome[secondI];
                chromosome[secondI] = firstP;
            }
        }
    }

    function fitness(chromosome) {
        var distance = 0;
        for (var i = 0; i < chromosome.length - 1; i++) {
            distance += graphMatrix[chromosome[i]][chromosome[i + 1]];
        }
        return -distance;
    }


    function selectNextGeneration() {
        var nextPopulation = [];
        var curPop = population.concat(newPopulation);
        var size = population.length;
        // sort DESC
        curPop = curPop.sort((a, b) => -fitness(a) + fitness(b) );

        for (var i = 0; i < size; i++) {
            nextPopulation.push(curPop[i]);
        }

        population = nextPopulation;
    }


    // return array of {parent1 : chr1 , parent2 : chr2}
    function selectPairsForReproduction() {
        var shufflePopulation = population.slice(0, population.length);
        var pairs = [];
        for (var i = 0; i < shufflePopulation.length - 1; i++) {
            pairs.push({
                parent1: shufflePopulation[i],
                parent2: shufflePopulation[i + 1]
            })
        }
        return pairs;
    }

    function nextGeneration() {
        var pairs = selectPairsForReproduction();
        pairs.forEach(pair => crossover(pair.parent1, pair.parent2));
        mutation();
        selectNextGeneration();
    }


    function run() {
        for (var i = 0; i < iterations; i++) {
            generationCount++;
            nextGeneration();
            console.log(generationCount);
        }
        selectNextGeneration();
    }

    function getTheBest() {
        var max = Number.MIN_SAFE_INTEGER;
        var index = 0;
        for (var i = 0; i < population.length; i++) {
            if (fitness(population[i]) > max) {
                max = fitness(population[i]);
                index = i;
            }
        }
        return population[index];
    }

    function buildTrip() {
        init();
        run();
        var trip = [];
        var points = getTheBest();
        for (var i = 0; i < points.length - 1; i++) {
            var start = pointsMapping[i];
            var end = pointsMapping[i + 1];
            trip.push(pathDictionary[getId(start[0], start[1]) + "#" + getId(end[0], end[1])]);
        }
        return trip;
    }

    function getId(x, y) {
        return x + "|" + y;
    }

    /**
     * Shuffles array in place.
     * @param {Array} a items The array containing the items.
     */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

//this.init = init;
//this.run = run;
    this.buildTrip = buildTrip;
}