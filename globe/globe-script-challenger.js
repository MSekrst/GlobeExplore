/**
 * Created by Tea on 22.5.2016..
 */
var vrstaIgre = 'states';
var randomCountries = [];
var saveRandomCountries = [];
var randomContinents = [];
var saveRandomContinents = [];
var result = [];
calledFromHandleBars = true;
var challangedZastavica=false;

var difficulty = '1';
var numberOfQuestions = 5;
var challanged="";


randomContinents = shuffle(["Europe", "Africa", "Asia", "South America", "North America", "Antarctica", "Australia"]);
saveRandomContinents=jQuery.extend(true, [], randomContinents);

var difficulties = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'extreme': 4
}

var continents = {
    "Europe": [],
    "Africa": [],
    "Asia": [],
    "South America": [],
    "North America": [],
    "Antarctica": [],
    "Australia": []
}

$(document).on('click', '#btn-challange', function (event) {

    $('#myModal').modal('show');
    document.getElementById("friend").value = "";
    document.getElementById("friend").style.borderColor = "";
    if (document.getElementById("invalid username") != null)
        document.getElementById("modal-body").removeChild(document.getElementById("invalid username"));
});

$( document ).ready(function() {
    $.get('/getPlayers', function (data) {
        for (var player in data) {
            if (data[player].username != document.getElementById("username").innerHTML) {
                var option = document.createElement('option');
                option.value = data[player].username;
                document.getElementById("select-friend").appendChild(option);
            }
        }
    });

  var username = document.getElementById("username").innerHTML;

  $.post('/getChallanges', {username: username}, function (data) {
    for (var c in data) {
      var chal = '<div class="col-sm-6 col-md-4"><div class="thumbnail"><div class="status';

      if (data[c].challengedScore) {  //  game over
       if (data[c].winner === username) {
         chal += ' challenge-won">WON';
       } else {
         chal += ' challenge-lose">LOST';
       }
      } else {  //  game to play
        if (data[c].challanged === username) {
          chal += ' challenge-play">PLAY';
        } else {
          chal += '">WAITING';
        }
      }

      chal += '</div><div class="caption">';

      if (data[c].challanged === username) {
        chal += '<h4 style="text-align: center">Opponent: &nbsp;' + data[c].challenger + '</h4>' ;
      } else {
        chal += '<h4 style="text-align: center">Opponent: &nbsp;' + data[c].challanged + '</h4>';
      }

      chal += '<p>';

      chal += 'Game mode: &nbsp;' + data[c].gameMode + '<br />';
      if (data[c].difficulty) {
        chal += 'Difficulty: &nbsp;' + data[c].difficulty + '<br />';
      }
      chal += 'Questions: &nbsp;' + data[c].number + '<br /></p>';

      if (data[c].challanged === username && !data[c].challengedScore) {
        chal += '<div class="button-challange-friend btn-igraj-chal" data-id="' + data[c]._id + '">PLAY</div>';
      }

      chal += '</div></div></div>';

      $('.challanges__body').append(chal)
    }
  });
});

$(document).on('click', '.btn-igraj-chal', function (event) {
    var id = $(this).data('id');
    console.log(id);
    challangedZastavica=true;
    $.post('/getChallenge',{id:id},function(data){
        console.log(data);
        difficulty = difficulties[data.difficulty];
        vrstaIgre=data.gameMode;
        numberOfQuestions=data.number;
        if(vrstaIgre=="states" || vrstaIgre=="capitals"){
            randomCountries=data.questions;
            
        }
        else{
            randomContinents=data.questions;
            saveRandomContinents=jQuery.extend(true, [], randomContinents);
        }
        init();
    });
});

$(document).on('click', '#btn-play', function (event) {
    var val = $("#friend").val();
    var obj = $("#select-friend").find("option[value='" + val + "']");


    if (obj != null && obj.length > 0){
        $(".close").click();
        $(".info").css("visibility", "visible");
        $(".instructions").css("visibility", "hidden");
        $(".challange-container").css("visibility", "hidden");
        getRandomCountries(function () {
            init();
        });
    }
    else {
        document.getElementById("friend").style.borderColor = "#af1c1c";
        if (document.getElementById("invalid username") == null) {
            var div = document.createElement('div');
            div.id = "invalid username";
            div.innerHTML = "please select existing player";
            document.getElementById("modal-body").appendChild(div);
        }
    }

});
$(document).on('change paste keyup', '#friend', function (event) {
    document.getElementById("friend").style.borderColor = "";
    challanged=$(this).val();
});

$(document).on('change', '#difficulty', function (event) {
    difficulty = difficulties[$(this).val()]

});

$(document).on('change', '#number_of_questions', function (event) {
    numberOfQuestions = $(this).val();
});

$(document).on('change', '#game_type', function (event) {
    // console.log($(this).val());

    if ($(this).val() == 'Continents') {
        vrstaIgre = 'continents';
        difficulty = 'nebitno';
        numberOfQuestions = 7;

        d3.select('.modal__init_div_nb').style("display", 'none');
        d3.select('.modal__init_div_diff').style("display", 'none');
    } else if ($(this).val() == 'Countries') {
        vrstaIgre = 'states';
        difficulty = $('#difficulty').val();
        difficulty = difficulties[difficulty];
        numberOfQuestions = $('#number_of_questions').val();
        d3.select('.modal__init_div_nb').style("display", 'block');
        d3.select('.modal__init_div_diff').style("display", 'block');
    } else if ($(this).val() == 'Capitals') {
        vrstaIgre = 'states';
        difficulty = $('#difficulty').val();
        difficulty = difficulties[difficulty];
        numberOfQuestions = $('#number_of_questions').val();
        d3.select('.modal__init_div_nb').style("display", 'block');
        d3.select('.modal__init_div_diff').style("display", 'block');
        vrstaIgre = 'capitals';
    }
});


function getRandomCountries(callback) {
    console.log('getting random c');
    var randoms = [];
    d3.json("../globe/world-countries.json", function (collection) {

        if (difficulty == 1) {//easy
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor(Math.random() * 176);
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != difficulty) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        } else if (difficulty == 2) {//medium
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor(Math.random() * 176);
                if (numberOfQuestions % 2 == 0) {//svako drugo pitanje lagano
                    if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != (difficulty - 1)) {
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
                var random = Math.floor(Math.random() * 176);
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != 2) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        } else if (difficulty == 4) {//extreme
            for (var i = 0; i < numberOfQuestions; i++) {
                var random = Math.floor(Math.random() * 176);
                if (randoms.indexOf(random) > -1 || collection.features[random].properties.difficulty != 3) {
                    i--;
                } else {
                    randoms[i] = random;
                    randomCountries[i] = collection.features[random];
                }
            }
        }
        console.log('made: ', randomCountries)
        callback();
    });

}


function init() {

    //izbjec ono inicijalizaciju iz handleBarsova body onLoad=init()
    if (calledFromHandleBars) {
        calledFromHandleBars = false;
        return false;
    }

    if (challangedZastavica) {
        $(".info").css("visibility", "visible");
    }

    //inicijalizacija
    var width = $(window).width() * 0.84;
    var height = $(window).height();
    console.log(width);
    console.log(height);
    var features;
    var time = d3.select("body").append("div").attr("id", "time").attr("class", "stopwatch");
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

    var starList = createStars(200);

    var stars = svg.append("g")
        .selectAll("g")
        .data(starList)
        .enter()
        .append("path")
        .attr("class", "pathStars")
        .attr("d", function (d) {
            spacePath.pointRadius(d.properties.radius);
            return spacePath(d);
        });

    var backgroundCircle = svg.append("svg:circle")
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', projection.scale())
        .attr('fill', '#009fe1');


    var g = svg.append("g");
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    var last = null;

    svg.call(d3.behavior.zoom()
        .scale(projection.scale())
        .scaleExtent([100, 800])
        .on('zoom', function () {

            var _scale = d3.event.scale;

            projection.scale(_scale);
            backgroundCircle.attr('r', _scale);
            path.projection(projection);
            space.scale(_scale * 3);

            stars.attr("d", function (d) {
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });

            features.attr('d', path);

        }));

    var sens = 0.5;

    svg.on("dblclick.zoom", null);

    svg.call(d3.behavior.drag()
        .origin(function () {
            var currentRotation = projection.rotate();
            return {x: currentRotation[0] / sens, y: -currentRotation[1] / sens};
        })
        .on("drag", function () {
            var rotate = projection.rotate();
            projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
            space.rotate([-d3.event.x * sens, d3.event.y * sens, rotate[2]]);
            svg.selectAll("path").attr("d", path);

            stars.attr("d", function (d) {
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });

            path.projection(projection);
        }));

    if (vrstaIgre == 'states' || vrstaIgre == 'capitals') {

        if (vrstaIgre == 'states') {
            d3.select('.info').html('Use double click to select:  ' + randomCountries[0].properties.name_long);
        } else if (vrstaIgre == 'capitals') {
            d3.select('.info').html('Use double click to select country with capital: ' + randomCountries[0].properties.capital);
        }

        d3.json("../globe/world-countries.json", function (collection) {
            features = g.selectAll(".feature")
                .data(collection.features)
                .enter()
                .append("path")
                .attr("d", path)
                .on("dblclick", function (d, i) {

                    var mouse = d3.mouse(this);
                    d3.select(last).style("fill", "#49E20E");
                    last = this;

                    console.log(this)

                    if (randomCountries[0].properties.name_long == d.properties.name_long) {
                        // console.log('pogodia');
                        d3.select(this).style("fill", "green");

                        var x = this;
                        setTimeout(function () {
                            d3.select(x).style("fill", "#49E20E");
                            tooltip.style("display", "none");
                        }, 500);

                        result.push('correct');

                    } else {
                        d3.select(this).style("fill", "#af1c1c");

                        var x = this;
                        setTimeout(function () {
                            d3.select(x).style("fill", "#49E20E");
                            tooltip.style("display", "none");
                        }, 500);

                        result.push('wrong');
                    }


                    if (randomCountries.length > 1) {
                        saveRandomCountries.push(randomCountries.shift());
                        // console.log('trazis: ', randomCountries[0].properties.name_long);
                        if (vrstaIgre == 'states') {
                            d3.select('.info').html('Select:  ' + randomCountries[0].properties.name_long);
                        } else if (vrstaIgre == 'capitals') {
                            d3.select('.info').html('Select country with capital: ' + randomCountries[0].properties.capital);
                        }
                    } else {
                        saveRandomCountries.push(randomCountries.shift());
                        var endTime = new Date().getTime();
                        stop();
                        time = d3.select('#time').html();
                        setTimeout(function () {
                            $('.modal-header').html("");
                            $('.modal-header').append('<p style="text-align: center">Result: ' + getResult(result, vrstaIgre)[0] + '</p>');
                            var t = time.toString().substr(3);
                            $('.modal-body').html(getResult(result, vrstaIgre)[1] + '<br\><div> Time: ' + t + '</div>');
                            $('#myModal').modal('show');


                            if (!challangedZastavica) {
                                $.post('/saveChallange',{challenger:document.getElementById("username").innerHTML, challanged:challanged, gameMode:vrstaIgre, number:result.length,difficulty:Object.keys(difficulties)[difficulty - 1],questions:getResult(result, vrstaIgre)[3],challengerTime:t,challengerScore: getResult(result, vrstaIgre)[2]});

                                $('#myModal').on('hidden.bs.modal', function () {
                                    var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                    console.log(route);
                                    $(location).attr('href', route);
                                });
                            } else {
                                $.post('/updateChallange',{_id: $('.btn-igraj-chal').data('id') ,challengedTime:t,challengedScore: getResult(result, vrstaIgre)[2]},function(data){
                                  console.log(data);
                                    if ((data.challengerScore<data.challengedScore) ||  (data.challengerScore==data.challengedScore && data.challengedTime<data.challengerTime) ) {
                                        $('.modal-body').append("<div class=\"get_better\" style=\" font-size: large; color:green !important;\">You won!</div>");
                                        $.post('/saveWinner',{_id: data._id,winner:data.challanged}, function () {
                                            $('#myModal').on('hidden.bs.modal', function () {
                                                var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                                console.log(route);
                                                $(location).attr('href', route);
                                            });
                                        });
                                    }
                                    else {
                                        $('.modal-body').append("<div class=\"get_better\" style=\" font-size: large; color:\"#af1c1c\" !important;\">You lost!</div>");
                                        $.post('/saveWinner',{_id: data._id,winner:data.challenger}, function () {
                                            $('#myModal').on('hidden.bs.modal', function () {
                                                var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                                console.log(route);
                                                $(location).attr('href', route);
                                            });
                                        });
                                    }
                                });

                            }



                            result = [];
                            randomCountries = [];
                            saveRandomCountries = [];
                            vrstaIgre = '';
                            // d3.selectAll(".globe").remove();
                            // init();
                        }, 1000);


                    }


                })

        });


    } else if (vrstaIgre == 'continents') {

        d3.select('.info').html('Select:  ' + randomContinents[0]);

        d3.json("../globe/world-countries.json", function (collection) {

            features = g.selectAll(".feature")
                .data(collection.features)
                .enter()
                .append("path")
                .attr("d", path)
                .on("dblclick", function (d, i) {

                    var mouse = d3.mouse(this);

                    if (randomContinents[0] == d.properties.continent) {

                        var putanje = g.selectAll("path");

                        for (var i = 0; i < 178; i++) {
                            if (putanje[0][i].__data__.properties.continent == d.properties.continent) {
                                d3.select(putanje[0][i]).style("fill", "green");
                            }
                        }

                        var x = this;
                        setTimeout(function () {
                            var putanje = g.selectAll("path");

                            for (var i = 0; i < 178; i++) {
                                d3.select(putanje[0][i]).style("fill", "#49E20E");
                            }

                        }, 500);

                        result.push('correct');

                    } else {
                        var putanje = g.selectAll("path");

                        for (var i = 0; i < 178; i++) {
                            if (putanje[0][i].__data__.properties.continent == d.properties.continent) {
                                d3.select(putanje[0][i]).style("fill", "#af1c1c");
                            }
                        }

                        setTimeout(function () {
                            var putanje = g.selectAll("path");

                            for (var i = 0; i < 178; i++) {
                                d3.select(putanje[0][i]).style("fill", "#49E20E");

                            }
                        }, 500);

                        result.push('wrong');
                    }

                    if (randomContinents.length > 1) {
                        randomContinents.shift();
                        d3.select('.info').html('Select:  ' + randomContinents[0]);
                    } else {
                        var endTime = new Date().getTime();

                        stop();
                        time = d3.select('#time').html();
                        setTimeout(function () {
                            $('.modal-header').html("");
                            $('.modal-header').append('<p style="text-align: center">Result: ' + getResult(result, vrstaIgre)[0] + '</p>');
                            var t = time.toString().substr(3);
                            $('.modal-body').html(getResult(result, vrstaIgre)[1] + '<br\><div> Time: ' + t + '</div>');
                            $('#myModal').modal('show');



                            if (!challangedZastavica) {
                                $.post('/saveChallange',{challenger:document.getElementById("username").innerHTML, challanged:challanged, gameMode:vrstaIgre, number:result.length,difficulty:Object.keys(difficulties)[difficulty - 1],questions:getResult(result, vrstaIgre)[3],challengerTime:t,challengerScore: getResult(result, vrstaIgre)[2]});

                                $('#myModal').on('hidden.bs.modal', function () {
                                    var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                    console.log(route);
                                    $(location).attr('href', route);
                                });
                            } else {
                                $.post('/updateChallange',{_id: $('.btn-igraj-chal').data('id') ,challengedTime:t,challengedScore: getResult(result, vrstaIgre)[2]},function(data){
                                    if ((data.challengerScore<data.challengedScore) ||  (data.challengerScore==data.challengedScore && data.challengedTime<data.challengerTime) ) {
                                        $('.modal-body').append("<div class=\"get_better\" style=\" font-size: large; color:green !important;\">You won!</div>");
                                        $.post('/saveWinner',{_id: data._id,winner:data.challanged}, function () {
                                            $('#myModal').on('hidden.bs.modal', function () {
                                                var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                                console.log(route);
                                                $(location).attr('href', route);
                                            });
                                        });
                                    }
                                    else {
                                        $('.modal-body').append("<div class=\"get_better\" style=\" font-size: large; color:\"#af1c1c\" !important;\">You lost!</div>");
                                        $.post('/saveWinner',{_id: data._id,winner:data.challenger}, function () {
                                            $('#myModal').on('hidden.bs.modal', function () {
                                                var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                                console.log(route);
                                                $(location).attr('href', route);
                                            });
                                        });
                                    }
                                });

                            }

                            $('#myModal').on('hidden.bs.modal', function () {
                                var route = '/challangeReturn/' + document.getElementById("username").innerHTML;
                                console.log(route);
                                $(location).attr('href', route);
                            })

                            result = [];
                            randomCountries = [];
                            saveRandomCountries = [];
                            vrstaIgre = '';
                            // d3.selectAll(".globe").remove();
                            //init();

                        }, 1000);


                    }


                })

        });
    }
}


function createStars(number) {
    var data = [];
    for (var i = 0; i < number; i++) {
        data.push({
            geometry: {
                type: 'Point',
                coordinates: randomLonLat()
            },
            type: 'Feature',
            properties: {
                radius: (Math.random() + 0.2) * 3
            }
        });
    }
    return data;
}

function randomLonLat() {
    return [Math.random() * 360 - 180, Math.random() * 180 - 90];
}

function getResult(result, vrstaIgre) {
    var correct = 0;
    res = [];
    var sum = result.length;
    var questions=[];
    res1 = '<div style=" font-size: large">Your answers:</div><div>';

    console.log('save: ', saveRandomCountries);
    if (vrstaIgre == 'continents') {
        saveRandomContinents.forEach(function (element, index) {
            res1 += '<div class=' + result[index] + '>' + element + ' : ' + result[index] + '</div>'
            questions.push(element);
        });
    } else {
        saveRandomCountries.forEach(function (element, index) {
            if (vrstaIgre == 'states') {
                res1 += '<div class=' + result[index] + '>' + element.properties.name_long + ' : ' + result[index] + '</div>'
                delete element['geometry'];
                questions.push(element);
            } else if (vrstaIgre == 'capitals') {
                res1 += '<div class=' + result[index] + '>' + element.properties.capital + ' : ' + result[index] + '</div>'
                delete element['geometry'];
                questions.push(element);
            }
        });
    }

    res1 += '</div>';
    result.forEach(function (element, index) {
        if (element == 'correct') {
            correct++;
        }
    });
    if (vrstaIgre == 'continents') res0 = ' ' + correct + ' / ' + sum;
    else res0 = ' ' + correct + ' / ' + sum + ' (difficulty: ' + Object.keys(difficulties)[difficulty - 1] + ')';
    if (!challangedZastavica) {
        res1 += '<br\><div class="get_better" style=" font-size: large">You will see the result when your friend finishes the game!</div>';
    }
    res.push(res0, res1,correct,questions)
    return res;
}


//STOPWATCH
var clsStopwatch = function () {
    // Private vars
    var startAt = 0;    // Time of last start / resume. (0 if not running)
    var lapTime = 0;    // Time on the clock when last stopped in milliseconds

    var now = function () {
        return (new Date()).getTime();
    };

    // Public methods
    // Start or resume
    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    // Stop or pause
    this.stop = function () {
        // If running, update elapsed time otherwise keep it
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        startAt = 0; // Paused
    };

    // Reset
    this.reset = function () {
        lapTime = startAt = 0;
    };

    // Duration
    this.time = function () {
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

    h = Math.floor(time / (60 * 60 * 1000));
    time = time % (60 * 60 * 1000);
    m = Math.floor(time / (60 * 1000));
    time = time % (60 * 1000);
    s = Math.floor(time / 1000);
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

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }

  return a;
}

function getChallangeResult(challange, me) {
    console.log('from getChallangeResult: ', challange, me);

    //I'm challanger
    

    //I'm challanged
}













