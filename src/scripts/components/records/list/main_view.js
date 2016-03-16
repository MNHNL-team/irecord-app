/******************************************************************************
 * Welcome page view.
 *****************************************************************************/
import $ from '../../../../vendor/jquery/js/jquery';
import Marionette from '../../../../vendor/marionette/js/backbone.marionette';
import Morel from '../../../../vendor/morel/js/morel';
import Hammer from '../../../../vendor/hammerjs/js/hammer';
import browser from '../../../helpers/browser';
import dateExtension from '../../../helpers/date_extension';
import JST from '../../../JST';


const RecordView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'table-view-cell',

  triggers: {
    'click #delete': 'record:delete'
  },

  events: {
    // need to pass the attribute therefore 'triggers' method does not suit
    'click .js-attr': function (e) {
      e.preventDefault();
      this.trigger('record:edit:attr', $(e.target).data('attr'))
    }
  },

  modelEvents: {
    'sync:request sync:done sync:error': 'render',
    'geolocation': 'render'
  },

  initialize: function () {
    this.template = JST['records/list/record' + (browser.isMobile() ? '_mobile': '')];
  },

  onRender: function () {
    // early return
    if (!browser.isMobile()) return;

    this.$record = this.$el.find('a');
    this.docked = false;
    this.position = 0;

    var options = {
      threshold: 50,
      toolsWidth: 100
    };

    var hammertime = new Hammer(this.el, {direction: Hammer.DIRECTION_HORIZONTAL});
    var that = this;

    //on tap bring back
    this.$record.on('tap click', $.proxy(this._swipeHome, this));

    hammertime.on('pan', function(e) {
      e.preventDefault();
      that._swipe(e, options);
    });
    hammertime.on('panend', function(e) {
      that._swipeEnd(e, options);
    });

  },

  remove: function () {
    //removing the last element leaves emptyView + fading out entry for a moment
    if (this.model.collection.length >= 1) {
      let that = this;
      this.$el.addClass('shrink');
      setTimeout(function () {
        Marionette.ItemView.prototype.remove.call(that);
      }, 300);
    } else {
      Marionette.ItemView.prototype.remove.call(this);
    }
  },

  serializeData: function () {
    let recordModel = this.model;
    let occ = recordModel.occurrences.at(0);
    let date = recordModel.get('date').print(),
        specie = occ.get('taxon') || {},
        images = occ.images;
    let img = images.length && images.at(0).get('data');

    let appModel = this.options.appModel;

    let taxon = specie[specie.found_in_name];

    let syncStatus = this.model.getSyncStatus();

    let location_print = recordModel.printLocation();
    let location = recordModel.get('location') || {};

    return {
      id: recordModel.id || recordModel.cid,
      saved: recordModel.metadata.saved,
      onDatabase: syncStatus === Morel.SYNCED,
      isLocating: recordModel.isGPSRunning(),
      location: location_print,
      location_name: location.name,
      isSynchronising: syncStatus === Morel.SYNCHRONISING,
      date: date,
      taxon: taxon,
      number: occ.get('number') && occ.get('number').limit(20),
      stage: occ.get('stage') && occ.get('stage').limit(20),
      comment: occ.get('comment'),
      img: img ? '<img src="' + img + '"/>' : ''
    };
  },

  _swipe: function (e, options) {
    //only swipe if no scroll up
    if (Math.abs(e.deltaY) > 10) return;

    if (this.docked) {
      this.position = -options.toolsWidth + e.deltaX;
    } else {
      this.position = e.deltaX;
    }

    //protection of swipeing right too much
    if (this.position > 0) this.position = 0;

    this.$record.css('transform', 'translateX(' + this.position + 'px)');
  },

  _swipeEnd: function (e, options) {
    //only swipe if no scroll up and is not in the middle
    if (Math.abs(e.deltaY) > 10 && !this.position) return;

    if ((-options.toolsWidth + e.deltaX) > -options.toolsWidth) {
      //bring back
      this.position = 0;
      this.docked = false;
    } else {
      //open tools
      this.docked = true;
      this.position = -options.toolsWidth;
    }

    this.$record.css('transform', 'translateX(' + this.position + 'px)');
  },

  _swipeHome: function (e) {
    if (this.docked) {
      e.preventDefault();
      this.position = 0;
      this.$record.css('transform', 'translateX(' + this.position + 'px)');
      this.docked = false;
    }
  }
});

let NoRecordsView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'table-view-cell empty',
  template: JST['records/list/list-none']
});

export default Marionette.CollectionView.extend({
  id: 'records-list',
  tagName: 'ul',
  className: 'table-view no-top',
  emptyView: NoRecordsView,
  childView: RecordView,

  //inverse the collection
  attachHtml: function(collectionView, childView, index){
    collectionView.$el.prepend(childView.el);
  },

  childViewOptions: function () {
    return {
      appModel: this.options.appModel
    }
  }
});
