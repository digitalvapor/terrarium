(function() {
  var AppRouter, Backbone, Plant, PlantCollection, PlantHistoryView, PlantListView, _, newAppRouter;

  _ = require('underscore');
  Backbone = require('backbone');
  Backbone.ajax = require('backbone.nativeajax');
  Backbone.View = require('backbone.nativeview');
  require('./taxonomy');
  require('./plot');

  Plant = Backbone.Model.extend({
    initialize: function() {
      _.extend(this, this.attributes);
      return this.addEnvironmentalParameters();
    },
    addEnvironmentalParameters: function() {
      var foundParams;
      foundParams = _.find(window.rawTaxonomy, (function(_this) {
        return function(plantAttributes) {
          return plantAttributes.taxon === _this.taxon;
        };
      })(this));
      if (foundParams) {
        return _.extend(this, foundParams);
      }
    },
    formattedTemperature: function() {
      var ref, t;
      if (t = (ref = this.environment) != null ? ref.temperature : void 0) {
        return [t.ambient, t.soil, t.extremes].join(' ');
      } else {
        return '';
      }
    },
    formattedHumidity: function() {
      var ref;
      return ((ref = this.environment) != null ? ref.humidity : void 0) || '';
    },
    formattedLuminosity: function() {
      var ref;
      return ((ref = this.environment) != null ? ref.luminosity : void 0) || '';
    },
    defaults: {
      alive: true,
      carnivorous: true,
      owner: 'tom'
    }
  });

  PlantCollection = Backbone.Collection.extend({
    model: Plant,
    url: './javascripts/plants.json'
  });

  this.plantList = new PlantCollection();

  this.plantList.on('add', function(plant) {
    return console.log("added plant: " + (plant != null ? plant.taxon : void 0));
  });

  PlantListView = Backbone.View.extend({
    el: '#plant-container',
    events: {
      'click .update': 'updatePlant',
      'click .create': 'createPlant',
      'click .changes': 'viewUnsyncedChanges',
      'click .cancel': 'cancelUnsyncedChanges',
      'click .sync': 'syncPlants'
    },
    model: this.plantList.models,
    template: _.template(document.querySelector('#plant-collection-template').innerHTML),
    initialize: function() {
      return this.render();
    },
    render: function() {
      this.el.innerHTML = this.template({
        plants: this.model
      });
      return this;
    },
    updatePlant: (function(_this) {
      return function(_event) {
        console.log('update', _this);
        return _this.defaultPlantListView.render();
      };
    })(this),
    createPlant: (function(_this) {
      return function(_event) {
        _this.plantList.add([
          {
            taxon: "new plant! edit me"
          }
        ]);
        return _this.defaultPlantListView.render();
      };
    })(this)
  });

  PlantHistoryView = Backbone.View.extend({
    el: "#plant-history-container",
    events: {
      'click .do-something': 'doSomething'
    },
    template: _.template(document.querySelector("#plant-history-template").innerHTML),
    initialize: function() {
      return 'yah history';
    },
    render: function() {
      return this.el.innerHTML = this.template({
        junk: yuh
      });
    },
    doSomething: function() {
      return console.log('did something');
    }
  });

  AppRouter = Backbone.Router.extend({
    routes: {
      '': 'list',
      'plant-info/:id': 'viewPlant'
    },
    list: (function(_this) {
      return function() {
        return _this.plantList.fetch({
          success: function() {
            _this.defaultPlantListView = new PlantListView();
            return _this.defaultPlantListView.render();
          }
        });
      };
    })(this),
    viewPlant: (function(_this) {
      return function() {};
    })(this)
  });

  newAppRouter = new AppRouter();

  Backbone.history.start();

}).call(this);