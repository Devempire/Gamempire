var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

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
    $( "#Soundcloud" ).toggle();;
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
    <ResponsiveReactGridLayout className="layout" layouts={this.state.layouts}
          breakpoints={{lg: 1042, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 17, md: 12, sm: 8, xs: 4, xxs: 2}}>

          <div key={"1"} data-grid={{x: 0, y: 0, w: 3, h: 2, static: true}} className="widgetFrame noselect" id="settings">
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

          </div>

          <div key={"2"} data-grid={{x: 3, y: 0, w: 5, h: 3}} className="widgetFrame" id="Discord">
            <span className="widgetTitle noselect">Discord</span>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://discordapp.com/login" ></webview>
          </div>


          <div key={"3"} data-grid={{x: 8, y: 0, w: 8, h: 3}} className="widgetFrame" id="Soundcloud">
            <p className="widgetTitle noselect">Soundcloud</p>
            <script>ipcRenderer.send('disable-x-frame', webview.partition);</script>
            <webview className="widget" src="https://soundcloud.com/charts/top" ></webview>
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
