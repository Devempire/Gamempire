import {GDQEvent, GDQRunner} from './GDQModels.js';
import request from 'request';

const gdqapi = 'https://gamesdonequick.com/tracker/search';

let instance = null;

export class GDQManager {
  static Instance () {
    if (instance == null) {
      console.log('Creating GDQManager instance');
      instance = new GDQManager();
    }
    return instance;
  }

  constructor () {
    this._events = [];
    this._event = null;
    this._runners = {};
    this._eventsLoaded = false;
    this._loadedEventsHandlers = [];
  }

  get events () {
    return this._events;
  }

  get runners () {
    return this._runners;
  }

  addLoadedEventsHandler (handler) {
    this._loadedEventsHandlers.push(handler);
    if (this._eventsLoaded) {
      handler();
    }
  }

  getEvents () {
    var that = this;
    console.log('Requesting events..');
    request({
      uri: gdqapi,
      qs: { type: 'event' },
      json: true,
      timeout: 5000
    }, function (err, res, body) {
      console.log(body);
      if (body instanceof Array) {
        body.forEach(function (evnt) {
          var id = evnt.pk;
          var date = evnt.fields.date;
          var shortName = evnt.fields.short;
          var target = evnt.fields.targetamount;
          var raised = evnt.fields.amount;
          var name = evnt.fields.name;
          that._events.push(new GDQEvent(id, name, shortName, date, target, raised));
        });
        that._events.slice(0).sort(function (a, b) {
          return b.date - a.date;
        });
        that.eventsLoaded(that._events);
        console.log('Events loaded');
        console.log(that._events);
      } else {
        console.log('Error loading events');
        console.log(err);
      }
    });
  }

  eventsLoaded (events) {
    this._eventsLoaded = true;
    this._loadedEventsHandlers.forEach(function(handler) {
      handler(events);
    });
  }

  getRunners () {
    var that = this;
    console.log('Requesting runners..');
    request({
      uri: gdqapi,
      qs: { type: 'runner' },
      json: true,
      timeout: 5000
    }, function (err, res, body) {
      if (body instanceof Array) {
        body.forEach(function (runner) {
          that._runners[runner.pk] = new GDQRunner(runner.pk, runner.fields.name, runner.fields.stream);
        });
        console.log(that._runners);
      }
    });
  }

  showEvent (id, handler) {
    var event = this.eventFromID(id);
    this._event = event;
    console.log('Showing event:');
    console.log(event);
    event.getRuns(handler);

    return event;
  }

  eventFromID (id) {
    return this._events.find(function (event) {
      return (event.id == id);
    });
  }
}
