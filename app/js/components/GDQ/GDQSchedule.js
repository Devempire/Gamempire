import {GDQEvent} from './GDQModels.js';
import Checkbox from '../Standalones/Checkbox.js';

var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var ReactTable = require('react-table').default;

const gdqapi = 'https://gamesdonequick.com/tracker/search';

var unirest = require('unirest');

export default class GDQSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layouts: {lg: this.props.initialLayout},
      event: new GDQEvent(''),
      events: [],
      runners: {},
      runs: [],
      response: undefined,
      showEvent: false,
      currentBreakpoint: 'lg',
      loadingRuns: true,
      loadingEvents: true,
      filterRuns: false,
      watchedRuns: {}
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.loadedEvents = this.loadedEvents.bind(this);
    this.loadedRuns = this.loadedRuns.bind(this);
    this.showEvent = this.showEvent.bind(this);
    this.onWatchCheck = this.onWatchCheck.bind(this);
    this.filterChange = this.filterChange.bind(this);
  }

  loadedEvents (events) {
    this.setState({
      events: events,
      loadingEvents: false
    });
  }

  loadedRuns (event) {
    var watchedRuns = {};
    event.runs.forEach((run) => {
      watchedRuns[run.id] = run.watching;
    });
    this.setState({
      event: event,
      loadingRuns: false,
      watchedRuns: watchedRuns
    });
  }

  resetLayout () {
    this.setState({layouts: {}});
  }

  onBreakpointChange (breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange (layout, layouts) {
    // saveToLS('layouts', layouts);
    this.setState({layouts});
  }

  showEvent (slot) {
    console.log('Selected ID:');
    console.log(slot.target.value);
    this.setState({
      showEvent: true,
      loadingRuns: true,
      event: this.props.manager.showEvent(slot.target.value, this.loadedRuns)
    });
  }

  onEvent (item) {
    return (
      <option key={item.id} value={item.id}>{item.name}</option>
    );
  }

  filterChange(sender) {
    this.setState({ filterRuns: !this.state.filterRuns });
  }

  onWatchCheck (value, id) {
    console.log('Watched checked');
    console.log(id);
    var watchedRuns = _.clone(this.state.watchedRuns);
    watchedRuns[id] = !watchedRuns[id];
    var run = this.state.event.runFromID(id);
    run.watching = watchedRuns[id];
    this.setState({ watchedRuns: watchedRuns });
  }

  componentWillMount () {
    this.props.manager.addLoadedEventsHandler(this.loadedEvents);
  }

  componentDidMount () {
    this.setState({ mounted: true });
  }

  render () {
    var that = this;

    const columns = [{
      Header: 'Watch',
      id: 'Watch',
      accessor: d => d.id,
      Cell: props => <Checkbox checked={that.state.watchedRuns[props.value]}
                               onChange={that.onWatchCheck}
                               id={props.value}/>
    }, {
      Header: 'Time',
      accessor: 'startTime' // String-based value accessors!
    }, {
      Header: 'Game',
      accessor: 'name',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'Runners', // Required because our accessor is not a string
      Header: 'Runners',
      accessor: d => d.runnerCell(that.props.manager.runners),
      Cell: props => props.value // Custom value accessors!
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
          <div key='c' className='static'>
            Show watched only
            <input type='checkbox'
                   checked={this.state.filterRuns}
                   onChange={this.filterChange}
            />
          </div>
        </ResponsiveReactGridLayout>

        <div className='table-wrap'>
          <ReactTable
            style={{display: this.state.showEvent ? 'block' : 'none'}}
            className='-striped -highlight'
            data={this.state.filterRuns ? this.state.event.watchedRuns() : this.state.event.runs}
            columns={columns}
            loading={this.state.loadingRuns}
        />
        </div>
      </div>
    );
  }
}

GDQSchedule.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  cols: {lg: 4, md: 4, sm: 4, xs: 4, xxs: 2},
  isDraggable: false,
  verticalCompact: true,
  initialLayout: [
    {x: 0, y: 0, w: 1, h: 1, i: 'a', static: true},
    {x: 1, y: 0, w: 1, h: 1, i: 'b', static: true},
    {x: 2, y: 0, w: 1, h: 1, i: 'c', static: true},
    {x: 3, y: 0, w: 1, h: 1, i: 'd', static: true}
  ]
};

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
