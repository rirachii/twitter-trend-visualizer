const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

require('dotenv').config();
const { json, response } = require('express');
const Twit = require('twit');
const config = require('./config')
const worlddata = require('./data/worlddata')
const usadata = require('./data/usadata');

const T = new Twit(config);
const Datastore = require('nedb');

const usadb = new Datastore('usatrend.db');
const worlddb = new Datastore('worldtrend.db');
usadb.loadDatabase();
worlddb.loadDatabase();


function trendLookUp() {
  //remove existing data first
  T.get('trends/place', {"id": "23424977"}, (err) => {
    if (err) {
      return console.error(err.message);
    }
  })
  looping(worlddata, worlddb)
  looping(usadata, usadb)
}

function looping(dataset, database){
  database.remove({ }, { multi: true }, function (err, numRemoved) {
    database.loadDatabase();
  });
  let colormap = {}
  for (let i = 0; i < dataset.length; i++) {
      let params = {
        "id" : (dataset[i].woeid).toString()
      }
      T.get('trends/place', params, (err, trendobj) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(dataset[i].state)
        let trend = trendobj[0].trends
        trend.sort(function(a, b) {
          return b.tweet_volume - a.tweet_volume;
        });
        let first = trend[0].name
        let second = trend[1].name
        let third = trend[2].name
        if(first in colormap == false){
          colormap[first] = "#" + Math.floor(Math.random()*16777215).toString(16)
        }
        if(second in colormap == false){
          colormap[second] = "#" + Math.floor(Math.random()*16777215).toString(16)
        }
        if(third in colormap == false){
          colormap[third] = "#" + Math.floor(Math.random()*16777215).toString(16)
        }   
        database.insert({
          state: dataset[i].state, woeid: dataset[i].woeid, 
          trend1: [first, trend[0].query, colormap[first]], 
          trend2: [second, trend[1].query, colormap[second]], 
          trend3: [third, trend[2].query, colormap[third]]
        });
    });
  }
}

app.get('/worlddb', (request, response) => {
    worlddb.find({}, (error, data)=> {
      if (error){
        response.end();
        return;
      }
      response.json(data);
    });
});

app.get('/usadb', (request, response) => {
    usadb.find({}, (error, data)=> {
      if (error){
        response.end();
        return;
      }
      response.json(data);
    });
});

trendLookUp()
setInterval(trendLookUp, 960000)

// let test = [
//     {
//       "state": "US-AL",
//       "woeid": 2364559,
//     }, 
//     {
//       "state": "US-AZ",
//       "woeid": 2471390
//     }, ]
// test[1].trend = "Monster"
// console.log(test)