'use strict';

function init() {

  var width = $(document).width() * 0.84;
  var height = $(document).height();

  var features;

  var space = d3.geo.azimuthalEquidistant().translate([width / 2, height / 2]);

  space.scale(space.scale() * 3);

  var spacePath = d3.geo.path().projection(space).pointRadius(1);

  var projection = d3.geo.orthographic()
    .scale(250) // scale the map
    .translate([width / 2, height / 2]) // set the center of the map to be the center of the canvas
    .clipAngle(90);

  var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

  var path = d3.geo.path().projection(projection);


  svg.append("rect").attr("width", width).attr("height", height);

  //ZVIJEZDE
  var starList = createStars(200);

  var stars = svg.append("g").selectAll("g").data(starList).enter().append("path").attr("class", "pathStars").attr("d", function (d) {
    spacePath.pointRadius(d.properties.radius);
    return spacePath(d);
  });

  var backgroundCircle = svg.append("svg:circle").attr('cx', width / 2).attr('cy', height / 2).attr('r', projection.scale())
    .attr('fill', '#009fe1');

  var g = svg.append("g");
  var tooltip = d3.select("body").append("div").attr("class", "tooltip");
  var last = null;

  d3.json("../globe/world-countries.json", function (collection) {
    features = g.selectAll(".feature").data(collection.features).enter().append("path").attr("d", path).on("click", function (d, i) {
      //d3.select(last).style("fill", "#49E20E");

      d3.select(this).style("fill", "#228B22");
      last = this;

      var searchTerm = d.properties.name_long;

      $.post('/state', {state: searchTerm}, function (data) {
        if (data) { //  HTML came from server
          $('.modal-body').html("");
          $('.modal-body').append(data);
          $('#modalLearning').modal('show');

          $('#modalLearning').on('hidden.bs.modal', function () {
            d3.select(last).style("fill", "#49E20E");
            if (document.getElementsByTagName('audio').length > 0)
              for (var i = 0; i < document.getElementsByTagName('audio').length; i++)
                document.getElementsByTagName('audio')[i].pause();
          });
        } else {  //  fetch data from API and save it in database for later use.
          var infobox;
          var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + searchTerm + "&redirects&prop=text&callback=?";
          $.getJSON(url, function (data) {
            var wikiHTML = data.parse.text["*"];
            var wikiDOM = $("<document>" + wikiHTML + "</document>");
            infobox = "<table>" + wikiDOM.find('.infobox').html();
            $('.modal-body').html("");

            infobox = infobox.replace("<td colspan=\"2\" style=\"border-bottom: 1px solid #DDDDDD;\"></td>", "");
            infobox = infobox.replace(/\[.*\]/g, '');
            var position;
            var index;

            if (infobox.indexOf('<b>Motto:&nbsp;</b>') != -1) index = 6;
            else  index = 5;

            position = nthIndex(infobox, "</tr>", index);

            var s = infobox.substring(0, position);

            s += "<tr><th>Capital</th><td>" + d.properties.capital + "</td><tr>";
            s += "<tr><th>Languages</th><td>" + d.properties.languages + "</td><tr>";
            s += "<tr><th>Area</th><td>" + d.properties.area + " km<sup>2</sup></td><tr>";
            s += "<tr><th>Population</th><td>" + d.properties.population + "</td><tr>";

            s += "</tbody></table><br\></document>";
            s = s.replace(/\[.*\]/, '');

            $.post('/newState', {state: searchTerm, html: s});

            $('.modal-body').append(s);
            $('#modalLearning').modal('show');

            $('#modalLearning').on('hidden.bs.modal', function () {
              d3.select(last).style("fill", "#49E20E");
              if (document.getElementsByTagName('audio').length > 0)
                for (var i = 0; i < document.getElementsByTagName('audio').length; i++)
                  document.getElementsByTagName('audio')[i].pause();
            });
          });
        }
      });
    })
  });

  svg.call(d3.behavior.zoom().scale(projection.scale()).scaleExtent([100, 800]).on('zoom', function () {
    var _scale = d3.event.scale;

    projection.scale(_scale);
    space.scale(_scale * 3);
    backgroundCircle.attr('r', _scale);
    path.projection(projection);

    stars.attr("d", function (d) {
      spacePath.pointRadius(d.properties.radius);
      return spacePath(d);
    });

    features.attr('d', path);
  }));

  var sens = 0.5; //  globe rotation sensitivity

  svg.call(d3.behavior.drag().origin(function () {
    var currentRotation = projection.rotate();
    return {x: currentRotation[0] / sens, y: -currentRotation[1] / sens};
  }).on("drag", function () {
    var rotate = projection.rotate();
    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);

    space.rotate([-d3.event.x * sens, d3.event.y * sens, rotate[2]]);

    svg.selectAll("path").attr("d", path);
    path.projection(projection);

    stars.attr("d", function (d) {
      spacePath.pointRadius(d.properties.radius);
      return spacePath(d);
    });
  }));

  function createStars(number) {
    var data = [];
    for (var i = 0; i < number; i++) {
      data.push({
        geometry: {
          type: 'Point',
          coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90]
        },
        type: 'Feature',
        properties: {
          radius: (Math.random() + 0.2) * 3
        }
      });
    }
    return data;
  }

  // function randomLonLat() {
  //   return [Math.random() * 360 - 180, Math.random() * 180 - 90];
  // }

  function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
      i = str.indexOf(pat, i);
      if (i < 0) break;
    }
    return i;
  }
}
