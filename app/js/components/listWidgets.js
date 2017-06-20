//This file is intended to be the only place we currently have to hardcode the WidgetIDs.

const discord = '58b93e79a7c98c3001ad48a4';
const messenger = '5948716f9946ff8e74fd134f';
const steamchat = '594871cc9946ff8e74fd1351';

const soundcloud = '594871ff9946ff8e74fd1352';
const googleplaymusic = '594872129946ff8e74fd1354';

const heathstonebuilder = '5948727c9946ff8e74fd1359';
const soundcloudapp = '594872299946ff8e74fd1355';
const notepad ='5948720c9946ff8e74fd1353';

const gdq = '5948719b9946ff8e74fd1350' ;

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
    if ( widgetID == gdq) { return ( <div id={widgetID} className="hearthstone_scroll widget jsx"><GDQ /></div>); }
  }
}

module.exports = global.listWidgets = new listWidgets();
