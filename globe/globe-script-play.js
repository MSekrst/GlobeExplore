/**
 * Created by Tea on 10.4.2016..
 */

var vrstaIgre;
var randomCountries = [];
var saveRandomCountries = [];
var result = [];
var startTime;

function init(){

    if (!vrstaIgre) {
        var randoms = [];
        console.log('odaberi vrstu igre');

        d3.select(".nav__link__play__continents").on('click', function () {
            vrstaIgre = 'continents';
            init();
        });

        d3.select(".nav__link__play__states").on('click', function () {
            vrstaIgre = 'states';

            d3.json("world-countries.json", function(collection) {

            for (var i = 0; i < 5; i++) {
                var random = Math.floor( Math.random()*176 );
                if (randoms.indexOf(random) > -1) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
             }

            saveRandomCountries = randomCountries;

            var sec = 0;
            var min = 0;

            startTime = new Date().getTime();
            // setInterval( function () {
            //     var time = Math.floor(( new Date().getTime() - startTime)/100) - min*60;
            //     var displayTime;
                
            //     if (min == 0 && time < 10) {
            //         displayTime = '00:0' + time;
            //     } else if (min == 0 && time < 60) {
            //         displayTime = '00:' + time;
            //     } else {
            //         if( time == 60){
            //             min++;
            //         }
            //         time -= 60;
            //         if (min < 10 && time < 10) {
            //             displayTime = '0' + min + ':0' + time;
            //         } else if (min < 10 && time < 60) {
            //             displayTime = '0' + min + ':' + time;
            //         } else if (min >= 10 && time < 10) {
            //             displayTime = min + ':0' + time;
            //         } else if (min >= 10 && time >= 10) {
            //             displayTime = min + ':' + time;
            //         }   
            //     }
            //     console.log(time)
            //     d3.select(".stopwatch").html( displayTime )

            // }, 1000 );
            init();
            }); 
        });

        d3.select(".nav__link__play__capitals").on('click', function () {
            vrstaIgre = 'capitals';
            init();
        });

    } else {
        if (vrstaIgre == 'capitals') {
            console.log('trazis glavni grad od blabla: ', randomCountries[0].properties.name_long);
        } else if (vrstaIgre == 'states') {
            console.log('trazis: ', randomCountries[0].properties.name);
        }
        
        var width = $(document).width()*0.82;
        var height = $(document).height();

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


        d3.json("world-countries.json", function(collection) {
            features=g.selectAll(".feature")
                .data(collection.features)
                .enter()
                .append("path")
                .attr("d", path)
                .on("click", function(d,i) {

                    var mouse = d3.mouse(this);
                    d3.select(last).style("fill", "white");
                    last=this;

                    if (randomCountries[0].properties.name_long == d.properties.name_long) {
                        console.log('pogodia');
                        d3.select(this).style("fill", "green");
                        tooltip.style("display", "block")
                            .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                            .html("CORRECT");
                        var x = this;
                        setTimeout(function(){
                                    d3.select(x).style("fill", "white");
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
                                    d3.select(x).style("fill", "white");
                                    tooltip.style("display", "none");
                                    }, 500);

                        result.push('wrong');
                    }

                    
                    if (randomCountries.length > 1) {
                        randomCountries.shift();
                        console.log('trazis: ', randomCountries[0].properties.name_long);
                    } else {
                        var endTime = new Date().getTime();
                        stop();
                        time = d3.select('#time').html();
                        d3.selectAll(".globe").remove();
                        setTimeout(function(){
                                    alert('gotovo! rezultat: ' + getResult(result) + ' Time: ' + time);
                                    }, 500);
                        

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









