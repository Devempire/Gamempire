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
  loadwid(widgetID) {

    if ( widgetID == soundcloud) { return ( <webview id={widgetID+'webview'} className='widget' src='https://soundcloud.com/charts/top'></webview> ); }
    if ( widgetID == discord) { return ( <webview id={widgetID} className='widget' src='https://discordapp.com/login'></webview> ); }
    if ( widgetID == messenger) { return ( <webview id={widgetID} className='widget' src='https://www.messenger.com/login/'></webview> ); }
    if ( widgetID == steamchat) { return ( <webview id={widgetID} className='widget' src='https://steamcommunity.com/chat'></webview> ); }
    if ( widgetID == googleplaymusic) { return ( <webview id={widgetID} className='widget' src='https://play.google.com/music/listen?authuser#/home'></webview> ); }
    return false;
  }

  loadjsx(widgetID) {
    if ( widgetID == heathstonebuilder) { return ( <div id={widgetID} className="hearthstone_scroll widget jsx"><HSDeckBuilder /></div> ); }
    if ( widgetID == soundcloudapp) { return ( <div id={widgetID} className="hearthstone_scroll widget jsx"><Soundcloud /></div> ); }
    if ( widgetID == notepad) { return ( <div id={widgetID} className="hearthstone_scroll widget jsx"><Notepad /></div>); }
  }
}

module.exports = global.listWidgets = new listWidgets();
