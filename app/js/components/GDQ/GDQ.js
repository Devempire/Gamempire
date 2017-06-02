import {GDQManager} from './GDQManager.js';
import {GDQEvent} from './GDQModels.js';

var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var ReactTable = require('react-table').default;

const originalLayouts = getFromLS('layouts') || {};
const gdqapi = 'https://gamesdonequick.com/tracker/search';

var unirest = require('unirest');
var request = require('request');
var manager = GDQManager.Instance();

// Hearthstone Deck Builder
module.exports = global.GDQ = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps () {
    return {
      className: 'layout',
      rowHeight: 30,
      cols: {lg: 4, md: 4, sm: 4, xs: 4, xxs: 2},
      isDraggable: false,
      verticalCompact: true,
      initialLayout: [
        {x: 0, y: 0, w: 2, h: 1, i: 'a', static: true},
        {x: 2, y: 0, w: 2, h: 1, i: 'b', static: true},
        {x: 2, y: 0, w: 1, h: 1, i: 'c', static: true},
        {x: 3, y: 0, w: 1, h: 1, i: 'd', static: true}
      ]
    };
  },

  getInitialState () {
    return {
      layouts: {lg: this.props.initialLayout},
      event: new GDQEvent(''),
      events: [],
      runners: {},
      runs: [],
      response: undefined,
      showEvent: false,
      currentBreakpoint: 'lg',
      loadingRuns: true,
      loadingEvents: true
    };
  },

  loadEvents () {

  },

  resetLayout () {
    this.setState({layouts: {}});
  },

  onBreakpointChange (breakpoint) {
    console.log(breakpoint);
    this.setState({
      currentBreakpoint: breakpoint
    });
  },

  onLayoutChange (layout, layouts) {
    // saveToLS('layouts', layouts);
    console.log(layouts);
    this.setState({layouts});
  },

  showEvent (slot) {
    console.log('Selected ID:');
    console.log(slot.target.value);
    var event = manager.eventFromID(slot.target.value);
    this.setState({
      event: event,
      showEvent: true,
      loadingRuns: true
    });
    this.setState({showEvent: true});
    console.log('Showing event:');
    console.log(event);
    var that = this;
    request({
      uri: gdqapi,
      qs: {
        type: 'run',
        event: event.id
      },
      json: true,
      timeout: 5000
    }, function (err, res, body) {
      console.log(body);
      if (body instanceof Array) {
        var runs = _.map(body, function (run) {
          return new Run(run.pk,
            run.fields.display_name,
            run.fields.starttime,
            run.fields.runners,
            run.fields.category,
            run.fields.run_time,
            run.fields.setup_time,
            run.fields.order);
        });
        console.log(runs);
        that.setState({
          runs: runs,
          loadingRuns: false
        }, function () {
          console.log('Runs set');
        });
      }
    });
  },

  onEvent (item) {
    return (
      <option key={item.id} value={item.id}>{item.name}</option>
    );
  },

  componentWillMount: function () {
    this.loadEvents();
    this.loadRunners();
  },

  componentDidMount: function () {
    this.setState({ mounted: true });
  },

  render () {
    const columns = [{
      Header: 'Time',
      accessor: 'startTime' // String-based value accessors!
    }, {
      Header: 'Game',
      accessor: 'name',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'Runners', // Required because our accessor is not a string
      Header: 'Runners',
      accessor: d => d.runnerString(this.state.runners) // Custom value accessors!
    }, {
      Header: props => <span>Estimate</span>, // Custom header components!
      accessor: 'estimate'
    }];
    return (
      <div>
        <br />

        <div className='row'>
          <button style={{ display: this.state.showAddDeck ? 'block' : 'none' }} className='button secondary 0e1519' id='show' onClick={this.show}>Add Hearthstone Deck</button>
        </div>

        <div className='row dropFade' style={{display: 'block'}}>
          <select value={this.state.event.id}
            onChange={this.showEvent}
            disabled={this.state.loadingEvents}>
            <option value='' disabled>{this.state.loadingEvents ? 'Loading...' : 'Choose an Event'}</option>
            {_.map(this.state.events, this.onEvent)}
          </select>
        </div>

        <ResponsiveReactGridLayout style={{display: this.state.showEvent ? 'block' : 'none'}}
          {...this.props}
          layouts={this.state.layouts}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          measureBeforeMount={false}
          useCSSTransforms={this.state.mounted}>
          <div key='a' className='static'>{this.state.event.statusString()}</div>
          <div key='b' className='static'>{this.state.event.donationString()}</div>
        </ResponsiveReactGridLayout>

        <div className='table-wrap'>
          <ReactTable
            style={{display: this.state.showEvent ? 'block' : 'none'}}
            className='-striped -highlight'
            data={this.state.runs}
            columns={columns}
            loading={this.state.loadingRuns}
        />
        </div>
      </div>
    );
  }
});

function getFromLS (key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch (e) { /* Ignore */ }
  }
  return ls[key];
}

function saveToLS (key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({
      [key]: value
    }));
  }
}
