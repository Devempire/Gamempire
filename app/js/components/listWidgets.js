const soundcloud = '58ad388f68ddfeac581167b3';
const discord = '58ad38ab68ddfeac581167b7';
const messenger = '58ad389d68ddfeac581167b5';
const steamchat = '58ad38a168ddfeac581167b6';
const googleplaymusic = '58ad389668ddfeac581167b4';

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
