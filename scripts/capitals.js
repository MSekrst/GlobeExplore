'use strict';

var Client = require('node-rest-client').Client;
var client = new Client();

var fs = require('fs');
var fileName = '../globe/world-countries.json';
var file = require(fileName);

client.get("https://restcountries.eu/rest/v1/all", function (data) {
  for (var stateIndex in data) {
    for (var worldJSONIndex in file.features) {
      if (file.features[worldJSONIndex].properties.brk_a3 === data[stateIndex].alpha3Code) {
        //  enter data in JSON
        file.features[worldJSONIndex].properties.capital = data[stateIndex].capital;
        file.features[worldJSONIndex].properties.relevance = data[stateIndex].relevance;
        file.features[worldJSONIndex].properties.population = data[stateIndex].population;
        file.features[worldJSONIndex].properties.area = data[stateIndex].area;
        file.features[worldJSONIndex].properties.translations = data[stateIndex].translations;
        file.features[worldJSONIndex].properties.languages = data[stateIndex].languages;

        //  save data
        fs.writeFileSync(fileName, JSON.stringify(file, null, 2));
        break;
      }
    }
  }
});
