const soundcloud = '58b8e5bf3d5b91307a68ee0f';
const discord = '58b8e5d43d5b91307a68ee12';
const messenger = '58b8e5cf3d5b91307a68ee11';
const steamchat = '58b8e5d93d5b91307a68ee13';
const googleplaymusic = '58b8e5c93d5b91307a68ee10';
const heathstonebuilder = '58b8e5f33d5b91307a68ee14';

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
