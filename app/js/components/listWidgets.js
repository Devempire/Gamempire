class listWidgets {
  loadwid(i) {
    var i;

    if ( i == 'Soundcloud') { return ( <webview className='widget' src='https://soundcloud.com/charts/top'></webview> ); }
    if ( i == 'Discord') { return ( <webview className='widget' src='https://discordapp.com/login'></webview> ); }
    if ( i == 'Messenger') { return ( <webview className='widget' src='https://www.messenger.com/login/'></webview> ); }
    if ( i == 'Steamchat') { return ( <webview className='widget' src='https://steamcommunity.com/chat'></webview> ); }
    if ( i == 'Googleplaymusic') { return ( <webview className='widget' src='https://play.google.com/music/listen?authuser#/home'></webview> ); }
    return false;
  }
}

module.exports = global.listWidgets = new listWidgets();
