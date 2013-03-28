var google = require('../lib/google');
var assert = require('assert');

var T = function(expr){ assert(expr); };
var F = function(expr){ assert(!expr); };

describe('+ google()', function(){
  it('should return search results', function(done){
    var nextCounter = 0;
    var allLinks = [];
    var query = "Microsoft";

    var finished = function(){
      T (allLinks.length > 20);
      var flags = 0x0;
      for (var i = 0; i < allLinks.length; ++i) {
        var link = allLinks[i];
        if (link.title && link.link) {
          if (link.title.indexOf('Wikipedia')) {
            flags |= 0x1;
          }
          if (link.link.indexOf('microsoft.com')){
            flags |= 0x2;
          }
          if (link.link.indexOf('twitter.com/Microsoft')){
            flags |= 0x4;
          }
          if (link.title.indexOf('Microsoft Corporation')){
            flags |= 0x8;
          }
          if (link.title.indexOf('Microsoft Store')){
            flags |= 0x10;
          }
        }
      }

      T (flags === 31); //all flags above set properly

      done();
    }


    google(query, function(err, next, links){
      //console.log('L: ' + links.length);
      allLinks = allLinks.concat(links);
      if (nextCounter < 2) {
        if (next) {
          nextCounter += 1;
          next();
        } else {
          finished();
        }
      } else {
        finished();
      }
    });
  
  })

  describe('when resultsPerPage is set', function () {
    it('should return search results', function(done){
      var nextCounter = 0
        , allLinks = []
        , query = "Microsoft";

      var finished = function(){
        T (allLinks.length > 90);
        done()
      }

      google.resultsPerPage = 100;
      google(query, function(err, next, links){
        allLinks = allLinks.concat(links);
        //console.log(allLinks.length)
        finished();
      })
    
    })
  })
  
  describe('when querying a math expression', function() {
    it('should return the equation as the first element', function(done) {
      var nextCounter = 0
        , allLinks = []
        , query = '2 + 2';

      var finished = function(){
        console.log(allLinks[0].title)
        T (allLinks[0].title.indexOf('2 + 2 = 4') >= 0);
        T (allLinks[0].link == null)
        done()
      }

      google.resultsPerPage = 100;
      google(query, function(err, next, links){
        allLinks = allLinks.concat(links);
        finished();
      })
    })
  })

  describe('when querying a conversion', function() {
    it('should return the conversion as the first element', function(done) {
      var nextCounter = 0
        , allLinks = []
        , query = '20 kmh in mph';

      var finished = function(){
        T (allLinks[0].title.indexOf('20 kph = 12.4274238 mph') >= 0);
        T (allLinks[0].link == null)
        done()
      }

      google.resultsPerPage = 100;
      google(query, function(err, next, links){
        allLinks = allLinks.concat(links);
        finished();
      })
    })
  })
}) 
