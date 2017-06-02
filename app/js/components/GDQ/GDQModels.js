import {formatMoney} from 'accounting-js';
import Formatters from '../../Helpers/Formatters.js';

export class GDQEvent {
  constructor (id, name, shortName, date, target, raised) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.date = new Date(date);
    this.target = parseInt(target);
    this.raised = parseInt(raised);
  }

  toString () {
    return this.shortName;
  }

  statusString () {
    if (this.date > new Date()) {
      return 'Upcoming: Starts on ' + Formatters.formatDate(this.date);
    } else {
      return 'Started on ' + Formatters.formatDate(this.date);
    }
  }

  donationString () {
    if (this.raised >= this.target) {
      return 'Met! Raised ' + formatMoney(this.raised) + '/' + formatMoney(this.target);
    } else {
      return 'Raised ' + formatMoney(this.raised) + '/' + formatMoney(this.target);
    }
  }
}

export class Runner {
  constructor (id, name, twitch) {
    this.id = id;
    this.name = name;
    this.twitch = twitch;
  }
}

export class Run {
  constructor (id, name, startTime, runners, category, estimate, setup, order) {
    this.id = id;
    this.name = name;
    this.startTime = startTime;
    this.runners = runners;
    this.category = category;
    this.estimate = (estimate === 0) ? '0:00:00' : estimate;
    this.setup = (setup === 0) ? '0:00:00' : setup;
    this.order = order;
  }

  toString () {
    return this.name + this.category;
  }

  runnerString (runners) {
    var ret = '';
    if (this.runners instanceof Array && this.runners.length > 0) {
      ret += runners[this.runners[0]].name;
      for (var i = 1; i < this.runners.length; i++) {
        ret += ', ' + runners[this.runners[i]].name;
      }
    }
    return ret;
  }

  runnerCell (runners) {
    return _.map(this.runners, function (runner) {
      return <option key={item.id} value={item.id}>{item.name}</option>;
    });
  }
}
