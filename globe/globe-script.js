/**
 * Created by Tea on 10.4.2016..
 */

function init(){

    var width = $(document).width();
    var height = $(document).height();

    var features;

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
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);


    svg.append("rect")
        .attr("width", width)
        .attr("height", height);

    //ZVIJEZDE
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
                d3.select(last).style("fill", "#49E20E");
                last=this;



                 var searchTerm=d.properties.name_long;
                var infobox;
                var url="http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + searchTerm+"&redirects&prop=text&callback=?";
                $.getJSON(url,function(data){
                    wikiHTML = data.parse.text["*"];
                    $wikiDOM = $("<document>"+wikiHTML+"</document>");
                    infobox=$wikiDOM.find('.infobox').html();
                     $('.modal-body').html("");
                     $('.modal-body').append(infobox);
                    $('#myModal').modal('show');
                });

                d3.select(this).style("fill", "#228B22");
                
                // tooltip.style("display", "block")
                //     .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                //     .html("<b>"+d.properties.name_long+"</b>");

            })

    });

    svg.call(d3.behavior.zoom()
        .scale( projection.scale() )
        .scaleExtent([100, 800])
        .on('zoom', function(){

            var _scale = d3.event.scale;

            projection.scale(_scale);
            space.scale(_scale*3);
            backgroundCircle.attr('r', _scale);
            path.projection(projection);

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
            path.projection(projection);

            stars.attr("d", function(d){
                spacePath.pointRadius(d.properties.radius);
                return spacePath(d);
            });

        }));
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

}
