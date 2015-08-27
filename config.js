var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/ithelp', {safe:true});
var helper=mongoskin.helper;

var dbOparations={db:db,helper:helper};


module.exports.dbOparations=dbOparations;