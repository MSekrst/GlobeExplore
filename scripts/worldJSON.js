'use strict';

var fs = require('fs');
var fileName = '../globe/world-countries.json';
var file = require(fileName);

for (var state in file.features) {
  delete file.features[state].properties.scalerank;
  delete file.features[state].properties.featurecla;
  delete file.features[state].properties.labelrank;
  delete file.features[state].properties.sovereignt;
  delete file.features[state].properties.AFG;
  delete file.features[state].properties.adm0_dif;
  delete file.features[state].properties.level;
  delete file.features[state].properties.type;
  delete file.features[state].properties.admin;
  delete file.features[state].properties.adm0_a3;
  delete file.features[state].properties.geou_dif;
  delete file.features[state].properties.geounit;
  delete file.features[state].properties.gu_a3;
  delete file.features[state].properties.su_dif;
  delete file.features[state].properties.subunit;
  delete file.features[state].properties.su_a3;
  delete file.features[state].properties.brk_diff;
  delete file.features[state].properties.brl_a3;
  delete file.features[state].properties.brk_name;
  delete file.features[state].properties.brk_group;
  delete file.features[state].properties.abbrev;
  delete file.features[state].properties.postal;
  delete file.features[state].properties.formal_fr;
  delete file.features[state].properties.note_adm0;
  delete file.features[state].properties.note_brk;
  delete file.features[state].properties.name_sort;
  delete file.features[state].properties.name_alt;
  delete file.features[state].properties.mapcolor7;
  delete file.features[state].properties.mapcolor8;
  delete file.features[state].properties.mapcolor9;
  delete file.features[state].properties.mapcolor13;
  delete file.features[state].properties.gdp_md_est;
  delete file.features[state].properties.pop_est;
  delete file.features[state].properties.pop_year;
  delete file.features[state].properties.lastcensus;
  delete file.features[state].properties.gdp_year;
  delete file.features[state].properties.wikipedia;
  delete file.features[state].properties.fips_10;
  delete file.features[state].properties.un_a3;
  delete file.features[state].properties.wb_a2;
  delete file.features[state].properties.wb_a3;
  delete file.features[state].properties.woe_id;
  delete file.features[state].properties.adm0_a3_is;
  delete file.features[state].properties.adm0_a3_us;
  delete file.features[state].properties.adm0_a3_un;
  delete file.features[state].properties.adm0_a3_wb;
  delete file.features[state].properties.region_wb;
  delete file.features[state].properties.name_len;
  delete file.features[state].properties.long_len;
  delete file.features[state].properties.abbrev_len;
  delete file.features[state].properties.tiny;
  delete file.features[state].properties.homepart;
  delete file.features[state].properties.translations;
}

fs.writeFileSync(fileName, JSON.stringify(file));