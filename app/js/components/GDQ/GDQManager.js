import {GDQEvent, GDQRunner} from './GDQModels.js';
import request from 'request';

const gdqapi = 'https://gamesdonequick.com/tracker/search';

let instance = null;

export default class GDQManager {
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

    this.getEvents();
    this.getRunners();
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
          that._events.push(new GDQEvent(
            evnt.pk,
            evnt.fields.name,
            evnt.fields.short,
            evnt.fields.date,
            evnt.fields.targetamount,
            evnt.fields.amount
          ));
        });
        that._events.sort(function (a, b) {
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
          that._runners[runner.pk] = new GDQRunner(
            runner.pk,
            runner.fields.name,
            runner.fields.stream
          );
        });
        console.log(that._runners);
      } else {
        console.log('Error loading runners');
        console.log(err);
      }
    });
  }

  getLatestEvent () {
    return this.events.last();
  }

  // Returns null if no event on, otherwise the event
  getOngoingEvent () {
    if (this.getLatestEvent().isCurrent()) {
      return this.getLatestEvent();
    } else {
      return null;
    }
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
