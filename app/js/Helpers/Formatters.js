export default class Formatters {
  static formatDate (date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    return mm + '/' + dd + '/' + yyyy;
  }

  static formatDollars (dollars) {
    var ret = String(parseInt());
  }
};
