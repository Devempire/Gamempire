var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);


const originalLayouts = getFromLS('layouts') || {};

var unirest = require('unirest');

//Hearthstone Deck Builder
module.exports = global.Notepad = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 3, md: 3, sm: 3, xs: 3, xxs: 3},
      isDraggable: false,
      verticalCompact: true
    };
  },


    componentDidMount: function(){
      console.log("Notepad App component did mount.");
    },

  getInitialState() {

    return {

    };

  },

  resetLayout() {
    this.setState({layouts: {}});
  },

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout, layouts) {
    saveToLS('layouts', layouts);
    this.setState({layouts});
  },

  render() {
    return (
<textarea rows="4" wrap="virtual" cols="20"></textarea>
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
      [key]: value
    }));
  }
}
