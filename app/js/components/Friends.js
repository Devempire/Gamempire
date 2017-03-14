var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

const originalLayouts = getFromLS('layouts') || {};

module.exports = global.Friends = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: 3,
      isDraggable: false,
      rowHeight: 50,
      verticalCompact: true
    };
  },

  getInitialState() {
    return {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      friends: []
    };
  },


  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout, layouts) {
    this.setState({layouts});
  },

  loadFriends() {

    $.get(api_server+"/user/show").done((res)=>{
      for (var i = 0; i < res.length; i++) {

        this.setState({
          friends: this.state.friends.concat({
            id:res[i]._id,
            username:res[i].username,
            aboutme:res[i].aboutme,
            avatar:res[i].avatar
          })
        });

      }
      this.renderFriends();

    }).fail((err)=>{
      console.log("Couldn't load friends.");
    });

  },


  renderFriends(){
var targat = '';
for (var i = 0; i < this.state.friends.length; i++) {
  if (!this.state.friends[i].avatar ){
    var avatar = '<img width="75" src="./../app/img/user.jpg" />';
  }else{
    var avatar = '<img width="75" src="http://gamempire.net/img/avatars/'+this.state.friends[i].id+'.jpg?'+ new Date().getTime()+'" />';
  }


  targat = targat+
    '<p>'+avatar+'&nbsp;&nbsp;&nbsp;<b>'+this.state.friends[i].username+'</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>'+this.state.friends[i].aboutme+'</i></p><br>';

}
document.getElementById('targat').innerHTML = targat;



},

  componentWillMount: function(){
    this.loadFriends();
  },



  render() {
    var title = "Friends \u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_Friends" ).addClass('active');

      return (

        <ReactGridLayout className="layout" layouts={this.state.layouts} onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange} {...this.props}>

        <div key={"1"} data-grid={{x: 0, y: 0, w: 3, h: 20, static: true}} className="widgetFrame noselect hearthstone_scroll" id="targat">Loading friends...</div>
        </ReactGridLayout>

      );

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
