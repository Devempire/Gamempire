var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);


module.exports = global.Playground = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 17, md: 12, sm: 12, xs: 4, xxs: 4},
      rowHeight: 30,
      verticalCompact: true
    };
    //this.handleChildUnmount = this.handleChildUnmount.bind(this);
  },

  // handleChildUnmount() {
  //   this.setState({renderChild: false});
  // },

  getInitialState() {
    return {
      layouts:{i:"layouts",x: 100, y: 100, w: 0, h: 0, static: true},
    };
  },

  onLayoutChange(layout, layouts) {
    saveToLS('layouts', layouts);
    this.setState({layouts});
  },

  toggleDiscord() {
    $("#Discord").toggle();
  },

  toggleSoundcloud() {
    $( "#Soundcloud" ).toggle();
  },

  toggleMessenger() {
    $( "#Messenger" ).toggle();
  },

  toggleSteamChat() {
    $( "#SteamChat" ).toggle();
  },

  toggleGooglePlay() {
    $( "#GooglePlay" ).toggle();
  },


  render() {
    // Set Titles
    var title = "Playground - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title
    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");
    //Set Dashbaord as active in menu
    $( "#_Playground" ).addClass('active');
    return <div>
    <ResponsiveReactGridLayout draggableCancel={".widget"} className="layout" layouts={this.state.layouts}
          breakpoints={{lg: 1042, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 17, md: 12, sm: 8, xs: 4, xxs: 2}}>

          <div key={"1"} data-grid={{x: 0, y: 0, w: 3, h: 3, static: true}} className="widgetFrame noselect" id="settings">
            <span className="widgetTitle noselect">Settings</span>

            <label className= "label" htmlFor="sel_soundcloud">Soundcloud</label>
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="sel_soundcloud" onChange={this.toggleSoundcloud} defaultChecked/>
                <label className="onoffswitch-label" htmlFor="sel_soundcloud">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div><br/>

            <label className= "label" htmlFor="sel_discord">Discord</label>
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="sel_discord" onChange={this.toggleDiscord} defaultChecked/>
                <label className="onoffswitch-label" htmlFor="sel_discord">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div><br/>

            <label className= "label" htmlFor="sel_messenger">Messenger</label>
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="sel_messenger" onChange={this.toggleMessenger} defaultChecked/>
                <label className="onoffswitch-label" htmlFor="sel_messenger">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div><br/>

            <label className= "label" htmlFor="sel_steamchat">Steam Chat</label>
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="sel_steamchat" onChange={this.toggleSteamChat} defaultChecked/>
                <label className="onoffswitch-label" htmlFor="sel_steamchat">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div><br/>

            <label className= "label" htmlFor="sel_GooglePlay">Google Play</label>
            <div className="onoffswitch">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="sel_GooglePlay" onChange={this.toggleGooglePlay} defaultChecked/>
                <label className="onoffswitch-label" htmlFor="sel_GooglePlay">
                    <span className="onoffswitch-inner"></span>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div><br/>

          </div>

          <div key={"2"} data-grid={{x: 3, y: 0, w: 5, h: 3}} className="widgetFrame"  id="Discord">
            <span className="widgetTitle">Discord</span>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://discordapp.com/login"></webview>
          </div>


          <div key={"3"} data-grid={{x: 8, y: 0, w: 8, h: 3}} className="widgetFrame" id="Soundcloud">
            <p className="widgetTitle noselect">Soundcloud</p>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://soundcloud.com/charts/top"></webview>
          </div>

          <div key={"4"} data-grid={{x: 0, y: 3, w: 8, h: 3}} className="widgetFrame" id="Messenger">
            <p className="widgetTitle noselect">Messenger</p>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://www.messenger.com/login/" ></webview>
          </div>

          <div key={"5"} data-grid={{x: 8, y: 3, w: 8, h: 3}} className="widgetFrame" id="SteamChat">
            <p className="widgetTitle noselect">Steam Chat</p>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://steamcommunity.com/chat" ></webview>
          </div>

          <div key={"6"} data-grid={{x: 0, y: 6, w: 10, h: 3}} className="widgetFrame" id="GooglePlay">
            <p className="widgetTitle noselect">Google Play</p>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://play.google.com/music/listen?authuser#/home" ></webview>
          </div>

{
/*
          <div key={"4"} data-grid={{x: 0, y: 2, w: 8, h: 2}} className="widgetFrame" id="Harthstone">
            <p className="widgetTitle noselect">HearthStone</p>
            <div id="hearthstoneWidget">
            </div>
          </div>
*/
}

        </ResponsiveReactGridLayout>
    </div>;

  }


});

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch(e) {/*Ignore*/}
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({
      key: value
    }));
  }
}
