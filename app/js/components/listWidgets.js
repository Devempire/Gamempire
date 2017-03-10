//This file is intended to be the only place we currently have to hardcode the WidgetIDs.

const discord = '58b93e79a7c98c3001ad48a4';
const messenger = '58b93e8ca7c98c3001ad48a5';
const steamchat = '58b93e97a7c98c3001ad48a6';

const soundcloud = '58b93eafa7c98c3001ad48a7';
const googleplaymusic = '58b93ee3a7c98c3001ad48a8';

const heathstonebuilder = '58b93f03a7c98c3001ad48a9';
const soundcloudapp = '58be7102884985c454420bbd';
const notepad ='58c32d942ca0d464773a4dbb';

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
    if ( i == soundcloudapp) { return ( <div className="hearthstone_scroll widget jsx"><Soundcloud /></div> ); }
    if ( i == notepad) { return ( <div className="hearthstone_scroll widget jsx"><form> <textarea rows="4" wrap="virtual" cols="20"></textarea><br/><input type="reset" value="Clear"/></form></div> ); }
  }
}

module.exports = global.listWidgets = new listWidgets();
