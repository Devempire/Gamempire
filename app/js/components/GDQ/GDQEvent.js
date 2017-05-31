import formatMoney from 'accounting';
import formatDate from '../../Helpers/Formatters.js';

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
      return 'Upcoming: Starts on ' + formatDate(this.date);
    } else {
      return 'Started on ' + formatDate(this.date);
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
