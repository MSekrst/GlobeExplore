/**
 * Created by Tea on 10.4.2016..
 */
function init(){
    
    var width = $(document).width();
    var height = $(document).height();

    var features;

    var projection = d3.geo.orthographic()
        .scale(250) // scale the map
        .translate([width / 2, height / 2]) // set the center of the map to be the center of the canvas
        .clipAngle(90);


    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);

    var backgroundCircle = svg.append("svg:circle")
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', projection.scale() )
        .attr('fill', 'blue');


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

                d3.select(this).style("fill", "magenta");
                tooltip.style("display", "block")
                    .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                    .html(d.properties.name)
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

            features.attr('d', path);

        }));
    var lambda = d3.scale.linear()
        .domain([0, width])
        .range([-180, 180]);

    var phi = d3.scale.linear()
        .domain([0, height])
        .range([90, -90]);

    var sens=0.25;

    svg.call(d3.behavior.drag()
        .origin(function() {
            var currentRotation = projection.rotate();
            return {x: currentRotation[0] / sens, y: -currentRotation[1] / sens};
        })
        .on("drag", function() {
            var rotate = projection.rotate();
            projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);

            svg.selectAll("path").attr("d", path);
            path.projection(projection);
        }));
}