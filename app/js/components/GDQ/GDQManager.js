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
    this._runners = [];
    this._eventsLoaded = false;

    this.getEvents();
  }

  get events () {
    return this._events;
  }

  getEvents () {
    var that = this;
    console.log('0Requesting events..');
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
        that._eventsLoaded = true;
        console.log('Events loaded');
        console.log(that._events);
      } else {
        console.log('Error loading events');
        console.log(err);
      }
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
          that.state.runners[runner.pk] = new Runner(runner.pk, runner.fields.name, runner.fields.stream);
        });
        console.log(that.state.runners);
      }
    });
  }

  eventFromID (id) {
    return this._events.find(function (event) {
      return (event.id == id);
    });
  }
}
