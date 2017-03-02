const soundcloud = '58ad388f68ddfeac581167b3';
const discord = '58ad38ab68ddfeac581167b7';
const messenger = '58ad389d68ddfeac581167b5';
const steamchat = '58ad38a168ddfeac581167b6';
const googleplaymusic = '58ad389668ddfeac581167b4';
const heathstonebuilder = '58ae27d168ddfeac581167e9';

class listWidgets {
  loadwid(i) {

    if ( i == soundcloud) { return ( <webview className='widget' src='https://soundcloud.com/charts/top'></webview> ); }
    if ( i == discord) { return ( <webview className='widget' src='https://discordapp.com/login'></webview> ); }
    if ( i == messenger) { return ( <webview className='widget' src='https://www.messenger.com/login/'></webview> ); }
    if ( i == steamchat) { return ( <webview className='widget' src='https://steamcommunity.com/chat'></webview> ); }
    if ( i == googleplaymusic) { return ( <webview className='widget' src='https://play.google.com/music/listen?authuser#/home'></webview> ); }
    return false;
  }

  loadjsx(i) {
    if ( i == heathstonebuilder) { return ( <div className="hearthstone_scroll widget jsx"><HSDeckBuilder /></div> ); }
  }
}

module.exports = global.listWidgets = new listWidgets();
