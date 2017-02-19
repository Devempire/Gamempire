const soundcloud = '58a73d8a27b83be81d3008b3';
const discord = '58a7fd3c27b83be81d30091c';
const messenger = '58a7fd4827b83be81d30091d';
const steamchat = '58a7fd5027b83be81d30091e';
const googleplaymusic = '58a7fd6227b83be81d30091f';


class listWidgets {
  loadwid(i) {
    var i;

    if ( i == soundcloud) { return ( <webview className='widget' src='https://soundcloud.com/charts/top'></webview> ); }
    if ( i == discord) { return ( <webview className='widget' src='https://discordapp.com/login'></webview> ); }
    if ( i == messenger) { return ( <webview className='widget' src='https://www.messenger.com/login/'></webview> ); }
    if ( i == steamchat) { return ( <webview className='widget' src='https://steamcommunity.com/chat'></webview> ); }
    if ( i == googleplaymusic) { return ( <webview className='widget' src='https://play.google.com/music/listen?authuser#/home'></webview> ); }
    return false;
  }
}

module.exports = global.listWidgets = new listWidgets();
