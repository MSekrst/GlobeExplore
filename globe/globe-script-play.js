var vrstaIgre = 'states';
var randomCountries = [];
var saveRandomCountries = [];
var randomContinents = [];
var result = [];
firstTime = true;

var difficulty = '1';
var numberOfQuestions = 5;

var continents = {
    "Europe": [],
    "Africa": [],
    "Asia": [],
    "South America": [],
    "North America": [],
    "Antarctica": [],
    "Oceania": []
}

$(document).on('change', '#difficulty', function(event) {
    // console.log($(this).val());
    if ($(this).val() == 'easy') {
        difficulty = 1;
    } else if ($(this).val() == 'medium') {
        difficulty = 2;
    } else if ($(this).val() == 'hard') {
        difficulty = 3;
    } else if ($(this).val() == 'extreme') {
        difficulty = 4;
    }
    
});

$(document).on('change', '#number_of_questions', function(event) {
    // console.log($(this).val());
    numberOfQuestions = $(this).val();
});

$(document).on('change', '#game_type', function(event) {
    // console.log($(this).val());

    if ($(this).val() == 'Continents') {
        vrstaIgre = 'continents';
        difficulty = 'nebitno'
        numberOfQuestions = 7;

        randomContinents.push("Europe", "Africa", "Asia", "South America", "North America", "Antarctica",  "Oceania");
    } else if ($(this).val() == 'Continents') {
        vrstaIgre = 'states';
    } else if ($(this).val() == 'Capitals') {
        console.log('capitals');
        vrstaIgre = 'capitals';
    }
});

function isMissingArguments() {
    var message;
    if (vrstaIgre && numberOfQuestions && difficulty ) {
        return false;
    } else {
        if (!vrstaIgre) {
            message = "Please choose game type."
        }
        if (!numberOfQuestions) {
            console.log('fali ti numberOfQuestions')
        }
        if (!difficulty) {
            console.log('fali ti difficulty')
        }
        $('.instructions').html("<h1>" + message + "</h1>");
        $('.instructions').show();
        return true;
    }
}



function getRandomCountries( callback ){
    var randoms = [];
    d3.json("../globe/world-countries.json", function(collection) {

        if (difficulty == 1) {//easy
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor( Math.random()*176 );
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != difficulty) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        } else if (difficulty == 2) {//medium
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor( Math.random()*176 );
                if (numberOfQuestions%2==0) {//svako drugo pitanje lagano
                    if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != (difficulty-1)) {
                        i--;
                    } else {
                        randoms[i] = random;
                        randomCountries[i] = collection.features[random];
                    }
                } else {
                    if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != difficulty) {
                        i--;
                    } else {
                        randoms[i] = random;
                        randomCountries[i] = collection.features[random];
                    }
                }
                
            }
            
        } else if (difficulty == 3) {//hard
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor( Math.random()*176 );
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != 2) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        } else if (difficulty == 4) {//extreme
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor( Math.random()*176 );
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != 3) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        }

        
        saveRandomCountries = randomCountries;

        callback();
    });

}

$(document).on('click', '#btn-play', function(event) {
    console.log('start game');

    $(".close").click();




    getRandomCountries( function() {
        console.log('callback');
        init();
    })

});


$(document).on('click', '#btn-play-start', function(event) {

    $('#myModal').modal('show');
    firstTime = false;
});




function init(){
    console.log('init: ', vrstaIgre);

    if (false) {
        $('#myModal').modal('show');
        firstTime = false;
    }

    if (isMissingArguments()) {

        console.log('missing arguments')



    } else {
        if (vrstaIgre == 'states' || vrstaIgre == 'capitals') {

            if (vrstaIgre == 'states') {
                d3.select('.info').html('Select: ' + randomCountries[0].properties.name_long );
            } else if (vrstaIgre == 'capitals') {
                d3.select('.info').html('Select country with capital: ' + randomCountries[0].properties.capital );
            }
            var width = $(document).width()*0.82;
            var height = $(document).height()*0.9;
            var features;
            var time = d3.select("body").append("div").attr("id","time").attr("class","stopwatch");
            show();
            start();

            var space = d3.geo.azimuthalEquidistant()
                .translate([width / 2, height / 2]);

            space.scale(space.scale() * 3);

            var spacePath = d3.geo.path()
                .projection(space)
                .pointRadius(1);

            var projection = d3.geo.orthographic()
                .scale(250) // scale the map
                .translate([width / 2, height / 2]) // set the center of the map to be the center of the canvas
                .clipAngle(90);


            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .classed("globe", true);

            var path = d3.geo.path()
                .projection(projection);

            svg.append("rect")
                .attr("width", width)
                .attr("height", height);

            var starList = createStars(2000);

            var stars = svg.append("g")
                .selectAll("g")
                .data(starList)
                .enter()
                .append("path")
                .attr("class", "pathStars")
                .attr("d", function(d){
                    spacePath.pointRadius(d.properties.radius);
                    return spacePath(d);
                });

            var backgroundCircle = svg.append("svg:circle")
                .attr('cx', width / 2)
                .attr('cy', height / 2)
                .attr('r', projection.scale() )
                .attr('fill', '#009fe1');


            var g = svg.append("g");
            var tooltip = d3.select("body").append("div").attr("class","tooltip");        
            var last=null;


            d3.json("../globe/world-countries.json", function(collection) {
                features=g.selectAll(".feature")
                    .data(collection.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .on("dblclick", function(d,i) {

                        var mouse = d3.mouse(this);
                        d3.select(last).style("fill", "#49E20E");
                        last=this;

                        if (randomCountries[0].properties.name_long == d.properties.name_long) {
                            console.log('pogodia');
                            d3.select(this).style("fill", "green");
                            tooltip.style("display", "block")
                                .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                                .html("CORRECT");
                            var x = this;
                            setTimeout(function(){
                                        d3.select(x).style("fill", "#49E20E");
                                        tooltip.style("display", "none");
                                        }, 500);

                            result.push('correct');

                        } else {
                            console.log('falia');
                            d3.select(this).style("fill", "red");
                            tooltip.style("display", "block")
                                .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                                .html("WRONG");
                            var x = this;
                            setTimeout(function(){
                                d3.select(x).style("fill", "#49E20E");
                                tooltip.style("display", "none");
                            }, 500);

                            result.push('wrong');
                        }

                        
                        if (randomCountries.length > 1) {
                            randomCountries.shift();
                            console.log('trazis: ', randomCountries[0].properties.name_long);
                            if (vrstaIgre == 'states') {
                                d3.select('.info').html('Select: ' + randomCountries[0].properties.name_long );
                            } else if (vrstaIgre == 'capitals') {
                                d3.select('.info').html('Select country with capital: ' + randomCountries[0].properties.capital );
                            }
                        } else {
                            var endTime = new Date().getTime();
                            stop();
                            time = d3.select('#time').html();
                            setTimeout(function(){
                                alert('gotovo! rezultat: ' + getResult(result) + ' Time: ' + time);
                                window.location = '/play';
                                result = [];
                                randomCountries = [];
                                saveRandomCountries = [];
                                vrstaIgre = '';
                                d3.selectAll(".globe").remove();
                                init();
                            }, 1000);
                            
                            

                        }
                        

                        
                        
                    })

            });

            svg.call(d3.behavior.zoom()
                .scale( projection.scale() )
                .scaleExtent([100, 800])
                .on('zoom', function(){

                    var _scale = d3.event.scale;

                    projection.scale(_scale);
                    backgroundCircle.attr('r', _scale);
                    path.projection(projection);
                    space.scale(_scale*3);

                    stars.attr("d", function(d){
                        spacePath.pointRadius(d.properties.radius);
                        return spacePath(d);
                    });

                    features.attr('d', path);

                }));

            var sens=0.25;

            svg.on("dblclick.zoom", null);
            svg.call(d3.behavior.drag()
                .origin(function() {
                    var currentRotation = projection.rotate();
                    return {x: currentRotation[0] / sens, y: -currentRotation[1] / sens};
                })
                .on("drag", function() {
                    var rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    space.rotate([-d3.event.x * sens, d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path").attr("d", path);

                    stars.attr("d", function(d){
                        spacePath.pointRadius(d.properties.radius);
                        return spacePath(d);
                    });

                    path.projection(projection);
                }));
        } else if (vrstaIgre == 'continents') {

            console.log('trazis: ', randomContinents[0]);
            d3.select('.info').html('Select: ' + randomContinents[0] );
            var width = $(document).width()*0.82;
            var height = $(document).height()*0.9;
            var features;
            var time = d3.select("body").append("div").attr("id","time").attr("class","stopwatch");
            show();
            start();

            var space = d3.geo.azimuthalEquidistant()
                .translate([width / 2, height / 2]);

            space.scale(space.scale() * 3);

            var spacePath = d3.geo.path()
                .projection(space)
                .pointRadius(1);

            var projection = d3.geo.orthographic()
                .scale(250) // scale the map
                .translate([width / 2, height / 2]) // set the center of the map to be the center of the canvas
                .clipAngle(90);


            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .classed("globe", true);

            var path = d3.geo.path()
                .projection(projection);

            svg.append("rect")
                .attr("width", width)
                .attr("height", height);

            var starList = createStars(2000);

            var stars = svg.append("g")
                .selectAll("g")
                .data(starList)
                .enter()
                .append("path")
                .attr("class", "pathStars")
                .attr("d", function(d){
                    spacePath.pointRadius(d.properties.radius);
                    return spacePath(d);
                });

            var backgroundCircle = svg.append("svg:circle")
                .attr('cx', width / 2)
                .attr('cy', height / 2)
                .attr('r', projection.scale() )
                .attr('fill', '#009fe1');


            var g = svg.append("g");
            var tooltip = d3.select("body").append("div").attr("class","tooltip");        
            var last=null;


            d3.json("../globe/world-countries.json", function(collection) {
                features=g.selectAll(".feature")
                    .data(collection.features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .on("click", function(d,i) {

                        var mouse = d3.mouse(this);
                        d3.select(last).style("fill", "#49E20E");
                        last=this;

                        if (randomContinents[0] == d.properties.continent) {
                            console.log('pogodia');
                            d3.select(this).style("fill", "green");
                            tooltip.style("display", "block")
                                .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                                .html("CORRECT");
                            var x = this;
                            setTimeout(function(){
                                        d3.select(x).style("fill", "#49E20E");
                                        tooltip.style("display", "none");
                                        }, 500);

                            result.push('correct');

                        } else {
                            console.log('falia');
                            d3.select(this).style("fill", "red");
                            tooltip.style("display", "block")
                                .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                                .html("WRONG");
                            var x = this;
                            setTimeout(function(){
                                d3.select(x).style("fill", "#49E20E");
                                tooltip.style("display", "none");
                            }, 500);

                            result.push('wrong');
                        }

                        
                        if (randomContinents.length > 1) {
                            randomContinents.shift();
                            console.log('trazis: ', randomContinents[0]);
                            d3.select('.info').html('Select: ' + randomContinents[0] );
                        } else {
                            var endTime = new Date().getTime();
                            stop();
                            time = d3.select('#time').html();
                            setTimeout(function(){
                                alert('gotovo! rezultat: ' + getResult(result) + ' Time: ' + time);
                                result = [];
                                randomContinents = [];
                                saveRandomCountries = [];
                                vrstaIgre = '';
                                d3.selectAll(".globe").remove();
                                init();
                            }, 1000);
                            
                            

                        }
                        

                        
                        
                    })

            });

            svg.on("dblclick.zoom", null);
            svg.call(d3.behavior.zoom()
                .scale( projection.scale() )
                .scaleExtent([100, 800])
                .on('zoom', function(){

                    var _scale = d3.event.scale;

                    projection.scale(_scale);
                    backgroundCircle.attr('r', _scale);
                    path.projection(projection);
                    space.scale(_scale*3);

                    stars.attr("d", function(d){
                        spacePath.pointRadius(d.properties.radius);
                        return spacePath(d);
                    });

                    features.attr('d', path);

                }));

            var sens=0.25;

            svg.call(d3.behavior.drag()
                .origin(function() {
                    var currentRotation = projection.rotate();
                    return {x: currentRotation[0] / sens, y: -currentRotation[1] / sens};
                })
                .on("drag", function() {
                    var rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    space.rotate([-d3.event.x * sens, d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path").attr("d", path);

                    stars.attr("d", function(d){
                        spacePath.pointRadius(d.properties.radius);
                        return spacePath(d);
                    });

                    path.projection(projection);
                }));
        }
        
   

    }
}





function createStars(number){
    var data = [];
    for(var i = 0; i < number; i++){
        data.push({
            geometry: {
                type: 'Point',
                coordinates: randomLonLat()
            },
            type: 'Feature',
            properties: {
                radius: Math.random() * 1.5
            }
        });
    }
    return data;
}

function randomLonLat(){
    return [Math.random() * 360 - 180, Math.random() * 180 - 90];
}

function getResult(result){
    var correct = 0;
    var sum = result.length;

    result.forEach( function(element, index) {
        if (element == 'correct') {
            correct++;
        }
    });
    return correct + '/' + sum;
}


//STOPWATCH
var clsStopwatch = function() {
        // Private vars
        var startAt = 0;    // Time of last start / resume. (0 if not running)
        var lapTime = 0;    // Time on the clock when last stopped in milliseconds

        var now = function() {
                return (new Date()).getTime();
            }; 
 
        // Public methods
        // Start or resume
        this.start = function() {
                startAt = startAt ? startAt : now();
            };

        // Stop or pause
        this.stop = function() {
                // If running, update elapsed time otherwise keep it
                lapTime = startAt ? lapTime + now() - startAt : lapTime;
                startAt = 0; // Paused
            };

        // Reset
        this.reset = function() {
                lapTime = startAt = 0;
            };

        // Duration
        this.time = function() {
                return lapTime + (startAt ? now() - startAt : 0); 
            };
    };



var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
}

function formatTime(time) {
    var h = m = s = ms = 0;
    var newTime = '';

    h = Math.floor( time / (60 * 60 * 1000) );
    time = time % (60 * 60 * 1000);
    m = Math.floor( time / (60 * 1000) );
    time = time % (60 * 1000);
    s = Math.floor( time / 1000 );
    ms = time % 1000;

    newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
    return newTime;
}

function show() {
    $time = document.getElementById('time');
    update();
}

function update() {
    $time.innerHTML = formatTime(x.time());
}

function start() {
    clocktimer = setInterval("update()", 1);
    x.start();
}

function stop() {
    x.stop();
    clearInterval(clocktimer);
}

function reset() {
    stop();
    x.reset();
    update();
}









