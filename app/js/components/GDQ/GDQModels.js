import {formatMoney} from 'accounting-js';
import Formatters from '../../Helpers/Formatters.js';

const gdqapi = 'https://gamesdonequick.com/tracker/search';
var request = require('request');

export class GDQEvent {
  constructor (id, name, shortName, date, target, raised) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.date = new Date(date);
    this.target = parseInt(target);
    this.raised = parseInt(raised);
    this.runs = [];
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

  getRuns (handler) {
    var that = this;
    request({
      uri: gdqapi,
      qs: {
        type: 'run',
        event: this.id
      },
      json: true,
      timeout: 5000
    }, function (err, res, body) {
      console.log(body);
      if (body instanceof Array) {
        var runs = _.map(body, function (run) {
          return new GDQRun(run.pk,
            run.fields.display_name,
            run.fields.starttime,
            run.fields.runners,
            run.fields.category,
            run.fields.run_time,
            run.fields.setup_time,
            run.fields.order);
        });
        console.log(runs);
        that.runs = runs;
        handler(that);
      }
    });
  }
}

export class GDQRunner {
  constructor (id, name, twitch) {
    this.id = id;
    this.name = name;
    this.twitch = twitch;
  }
}

export class GDQRun {
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
      return <span><a href={runners[this.runners[0]].twitch}>{runners[this.runners[0]].name}</a></span>;
    });
  }
}
