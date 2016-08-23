var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/beers-auth');

var Beer = require("./models/BeerModel");
var Review = require("./models/ReviewModel");
var User = require("./models/UserModel");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(express.static('node_modules'));

//------------------------
// For authentication:
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());
//------------------------


app.post('/register', passport.authenticate('register'), function (req, res) {
  res.json(req.user);
});

app.get('/beers', function (req, res) {
  Beer.find(function (error, beers) {
    res.send(beers);
  });
});

app.post('/beers', function (req, res, next) {
  var beer = new Beer(req.body);

  beer.save(function(err, beer) {
    if (err) { return next(err); }

    res.json(beer);
  });
});

app.put('/beers/:id',  function(req, res, next) {
  Beer.findById(req.params.id, function (error, beer) {
    beer.name = req.body.name;

    beer.save(function(err, beer) {
      if (err) { return next(err); } 

      res.json(beer);
    });
  });
});

app.delete('/beers/:id', function (req, res) {
  Beer.findById(req.params.id, function (error, beer) {
    if (error) {
      res.status(500);
      res.send(error);
    } else {
      beer.remove();
      res.status(204);
      res.end();
    }
  });
});

app.post('/beers/:id/reviews', function(req, res, next) {
  Beer.findById(req.params.id, function(err, beer) {
    if (err) { return next(err); }

    var review = new Review(req.body);

    beer.reviews.push(review);

    beer.save(function (err, beer) {
      if (err) { return next(err); }
    
      res.json(review);
    });
  });
});

app.delete('/beers/:beer/reviews/:review', function(req, res, next) {
  Beer.findById(req.params.beer, function (err, beer) {
    for (var i = 0; i < beer.reviews.length; i ++) {
      if (beer.reviews[i]["_id"] == req.params.review) {
        beer.reviews.splice(i, 1);
        beer.save();

        res.status(204);
        res.end();
      }
    }
  });
});

app.listen(8000);