var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);
var ReactGridLayout = require('react-grid-layout');
var ReactTable = require('react-table').default;

const originalLayouts = getFromLS('layouts') || {};
const gdqapi = "https://private.gamesdonequick.com/tracker/search";

var unirest = require('unirest');
var request = require('request');

//Hearthstone Deck Builder
module.exports = global.GDQ = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      rowHeight: 30,
      cols: {lg: 4, md: 4, sm: 4, xs: 4, xxs: 2},
      isDraggable: false,
      verticalCompact: true,
      initialLayout: [
        {x:0, y:0, w:1, h:1, i: "a", static: true},
        {x:1, y:0, w:1, h:1, i: "b", static: true},
        {x:2, y:0, w:1, h:1, i: "c", static: true},
        {x:3, y:0, w:1, h:1, i: "d", static: true}
      ]
    };
  },

  getInitialState() {
    return {
    	layouts: {lg: this.props.initialLayout},
    	event:new Event(''),
      events:[],
      runners:{},
      runs:[],
    	response:undefined,
      showEvent:false,
      currentBreakpoint:'lg'
    };

  },

  loadEvents() {
    var that = this;
    console.log('Requesting events..');
    request({
      uri: gdqapi,
      qs: { type: 'event' },
      json: true,
      timeout: 5000
    }, function(err, res, body) {
      console.log(body);
      if (body instanceof Array) {
        body.forEach(function (evnt) {
          var id = evnt.pk;
          var date = evnt.fields.date;
          var shortName = evnt.fields.short;
          var target = evnt.fields.targetamount;
          var raised = evnt.fields.amount;
          var name = evnt.fields.name;
          that.setState({events: that.state.events.concat(new Event(id, name, shortName, date, target, raised))});
        })
        that.setState({
          events: that.state.events.slice(0).sort(function (a, b) {
            return b.date - a.date;
          })
        });
        console.log(that.state.events);
      }
      else {
        console.log('Error loading events');
        console.log(err);
      }
    });
  },

  loadRunners() {
    var that = this;
    console.log('Requesting runners..');
    request({
      uri: gdqapi,
      qs: { type: 'runner' },
      json: true,
      timeout: 5000
    }, function(err, res, body) {
      if (body instanceof Array) {
        body.forEach(function (runner) {
          that.state.runners[runner.pk] = new Runner(runner.pk, runner.fields.name, runner.fields.stream);
        })
        console.log(that.state.runners);
      }
    });
  },

  resetLayout() {
    this.setState({layouts: {}});
  },

  onBreakpointChange(breakpoint) {
    console.log(breakpoint);
    this.setState({
      currentBreakpoint: breakpoint
    });
  },

  onLayoutChange(layout, layouts) {
    //saveToLS('layouts', layouts);
    console.log(layouts);
    this.setState({layouts});
  },

  show() {
    this.setState({showStore: true,
                  showAddDeck: false});
  },

  eventFromID(id) {
    return this.state.events.find(function(event) {
      return (event.id == id);
    });
  },

  showEvent(slot) {
    var event = this.eventFromID(slot.target.value);
    this.setState({
      event: event,
      showEvent: true,
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
    }, function(err, res, body) {
      console.log(body);
      if (body instanceof Array) {
        var runs = _.map(body, function(run) {
          return new Run(run.pk,
            run.fields.display_name,
            run.fields.starttime,
            run.fields.runners,
            run.fields.category,
            run.fields.run_time,
            run.fields.setup_time,
            run.fields.order);
        })
        console.log(runs);
        that.setState({ runs: runs })
      }
    });
  },

  handleSubmit(event) {
    event.preventDefault();
    var i = this.state.decks.length;
    var width = 1;
    var height = 8;
    var row = 0;

    //Put < during release/testing phases. Put > during development.
    if (this.state.cardCounter < 30) {
      $("#hsmsg").html("Deck is not complete. Please add 30 cards to the deck.<button id='close' onclick='$(this).parent().hide();' ></button>");
      $("#hsmsg").addClass('label warning');
      $("#hsmsg").addClass("shake");
      $("#hsmsg").show();
      setTimeout(function () {
        $("#hsmsg").removeClass("shake");
      },200);
    } else {
      this.setState({
        decks: this.state.decks.concat({
          i: i.toString(),
          x: i % 3,
          y: row,
          w: width,
          h: height,
          minH: 8,
          maxH: 8,
          minW: 1,
          maxW: 1,
          static: true,
          hero:this.state.selectclass,
          title:this.state.title,
          description:this.state.description,
          decks:this.state.myDeckFinal,
          heroCard:this.state.heroCard
        }),
        showDeckBuilder:false,
        showAddDeck:true,
        myDeck:[],
        selectclass:'',
        title:'',
        description:'',
        classCards:[],
        neutral:[],
        myDeckFinal:[],
        heroCard:[],
        cardCounter:0,
        hsCardKey:0
      });
    }
  },

  deckBuilder(el) {
    var i = el.i;
    var hero = el.hero;
    var title = el.title;
    var description = el.description;
    var heroCard = el.heroCard;

    return (
      <div key={i} data-grid={el} className="hearthstone_scroll">
        <center><h1>{hero}</h1></center>
        <center><img src={heroCard} height="250" width="250"/></center>
        <h3>{title}</h3>
        <h4>{description}</h4>
        <ul>
          {el.decks}
        </ul>
      </div>
    );
  },

  onEvent(item){
    return (
      <option key={item.id} value={item.id}>{item.name}</option>
    );
  },

  componentWillMount: function(){
    this.loadEvents();
    this.loadRunners();
  },

  componentDidMount: function() {
    this.setState({ mounted: true });
  },


  render() {
    const data = [{
      name: 'Tanner Linsley',
      age: 26,
      friend: {
        name: 'Jason Maurer',
        age: 23,
      }
    }]

    const columns = [{
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'Age',
      accessor: 'age',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'friendName', // Required because our accessor is not a string
      Header: 'Friend Name',
      accessor: d => d.friend.name // Custom value accessors!
    }, {
      Header: props => <span>Friend Age</span>, // Custom header components!
      accessor: 'friend.age'
    }]
    return (
      <div>
        <br/>

        <div className="row">
          <button style={{display: this.state.showAddDeck ? 'block':'none' }} className="button secondary 0e1519" id="show" onClick={this.show}>Add Hearthstone Deck</button>
        </div>

        <div className="row dropFade" style={{display: 'block'}}>
          <select value={this.state.event.id}
                  onChange={this.showEvent}>
            <option value="" disabled>Choose an Event</option>
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
          <div key="a" className="static">{this.state.event.statusString()}</div>
          <div key="b" className="static">{this.state.event.donationString()}</div>
        </ResponsiveReactGridLayout>

        <ReactTable
          data={data}
          columns={columns}
        />
      </div>
    )
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

function Event(id, name, shortName, date, target, raised) {
  var that = this;

  this.id = id;
  this.name = name;
  this.shortName = shortName;
  this.date = new Date(date);
  this.target = parseInt(target);
  this.raised = parseInt(raised);

  this.toString = function() {
    return that.shortName;
  };

  this.statusString = function() {
    if (that.date > new Date()) {
      return "Upcoming: Starts on " + formatDate(that.date);
    }
    else {
      return "Started on " + formatDate(that.date);
    }
  }

  this.donationString = function() {
    if (raised >= target) {
      return "Met! Raised " + that.raised + "/" + that.target;
    }
    else {
      return "Raised " + that.raised + "/" + that.target;
    }
  }
}

function Run(id, name, startTime, runners, category, estimate, setup, order) {
  var that = this;

  this.id = id;
  this.name = name;
  this.startTime = startTime;
  this.runners = runners;
  this.category = category;
  this.estimate = (estimate == 0) ? '0:00:00' : estimate;
  this.setup = (setup == 0) ? '0:00:00' : setup;
  this.order = order;

  this.toString = function() {
    return that.name + that.category;
  }

  this.runnerString = function() {
    var ret = '';
    if (this.runners instanceof Array) {
      this.runners.forEach(function (runner) {
        ret += ', ' + that.state.runners[runner].name;
      })
    }
    return ret;
  }
}

function Runner(id, name, twitch) {
  this.id = id;
  this.name = name;
  this.twitch = twitch;
}

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm }
  return mm + '/' + dd + '/' + yyyy;
}
