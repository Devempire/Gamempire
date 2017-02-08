var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

const originalLayouts = getFromLS('layouts') || {};

var unirest = require('unirest');

//Hearthstone Deck Builder
module.exports = global.HSDeckBuilder = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 3, md: 3, sm: 3, xs: 3, xxs: 1},
      rowHeight: 50,
      verticalCompact: true
    };
    //this.handleChildUnmount = this.handleChildUnmount.bind(this);
  },

  // handleChildUnmount() {
  // 	this.setState({renderChild: false});
  // },

  getInitialState() {

    return {
    	layouts: JSON.parse(JSON.stringify(originalLayouts)),
    	selectclass:'',
    	response:undefined,
    	showStore:false,
      showDeckBuilder:false,
      showAddDeck:true,
      myDeck:[],
      myDeckFinal:[],
      decks:[],
      neutral:[],
      classCards:[],
      cardCounter: 0,
      title:'',
      description:'',
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

  show() {
    this.setState({showStore: true,
                  showAddDeck: false});
  },

  showBuilder(event) {
    this.setState({selectclass: event.target.value});
    this.setState({showDeckBuilder: true});
    this.setState({showStore: false});
    // unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Neutral?collectible=1")
    // .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
    // .end(function (result) {
    //   console.log(result.body);
    //   var i = 0;
    //   while (i < result.body.length) {
    //     this.setState({neutral: this.state.neutral.concat(<li key={i}>
    //       <a href="#" name={result.body[i].name} value={result.body[i].rarity}
    //       onClick={this.putCardToDeck}>{result.body[i].name}</a></li>)});
    //     i++;
    //   };
    //   console.log(this.state.neutral);
    // }.bind(this));
    if (event.target.value == 'Druid') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Druid?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        //increment the value if a new hero is added or decrement if a hero is removed
        var i = 1;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Hunter') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Hunter?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Mage') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Mage?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 3;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Paladin') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Paladin?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Priest') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Priest?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Rogue') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Rogue?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 1;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Shaman') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Shaman?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Warlock') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warlock?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 1;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Warrior') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warrior?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        console.log(this.state.classCards);
      }.bind(this));
    }
  },

  //helper function for putting in class card names only into a list
  putClassCards(i, deck) {
    while (i < deck.length) {
      this.setState({classCards: this.state.classCards.concat(<li key={i}>
        <a href="#" name={deck[i].name} value={deck[i].rarity}
        onClick={this.putCardToDeck}>{deck[i].name}</a></li>)});
      i++;
    };
  },

  searchClassCards() {
    var card;
    var input = document.getElementById('class_card');
    var filter = input.value.toUpperCase();
    var ul = document.getElementById("class_card_list");
    var li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < li.length; i++) {
        card = li[i].getElementsByTagName("a")[0];
        if (card.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
  },

  searchNeutralCards() {
    var card;
    var input = document.getElementById('neutral_card');
    var filter = input.value.toUpperCase();
    var ul = document.getElementById("neutral_card_list");
    var li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < li.length; i++) {
        card = li[i].getElementsByTagName("a")[0];
        if (card.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
  },

  putCardToDeck(event) {
    var card_name = event.target.getAttribute('name');
    var card_rarity = event.target.getAttribute('value');
    var i = this.state.myDeck.length;
    var count = 0;

    for (var j = 0; j < this.state.myDeckFinal.length; j++) {
      if (this.state.myDeckFinal[j].props.children == card_name) {
        count++;
      }
    }

    //myDeck is for during deck creation, the deck names need to be clickable
    //to call removeCard function to remove a desired card.
    //myDeckFinal is for publishing the deck, the deck names are not clickable
    //and only for display.
    if (i < 30 && card_rarity != 'Legendary' && count < 2) {
      this.setState({myDeck: this.state.myDeck.concat(<li key={i}>
          <a href="#" name={card_name} value={card_rarity}
          onClick={this.removeCard}>{card_name}</a></li>)});
      this.setState({myDeckFinal: this.state.myDeckFinal.concat(<li key={i}>
          {card_name}</li>)});
    } else if (i < 30 && card_rarity == 'Legendary' && count < 1) {
      this.setState({myDeck: this.state.myDeck.concat(<li key={i}>
          <a href="#" name={card_name} value={card_rarity}
          onClick={this.removeCard}>{card_name}</a></li>)});
      this.setState({myDeckFinal: this.state.myDeckFinal.concat(<li key={i}>
          {card_name}</li>)});
    }
  },

  removeCard(event) {
    var deck_list = [];
    var card_name = event.target.getAttribute('name');

    //First, put all card names in the deck into a list
    for (var i = 0; i < this.state.myDeck.length; i++) {
      deck_list.push(this.state.myDeck[i].props.children.props.children);
    }

    //Second, find the index of the card to be removed
    for (var j = 0; j < deck_list.length; j++) {
      if (deck_list[j] == card_name) {
        var index = j;
      }
    }

    this.state.myDeck.splice(index, 1);
    this.setState({myDeck: this.state.myDeck.concat([])});
    this.state.myDeckFinal.splice(index, 1);
    this.setState({myDeckFinal: this.state.myDeckFinal.concat([])});
  },


  handleSubmit(event) {
    event.preventDefault();
    var i = this.state.decks.length;
    var width = 1;
    var height = 14;
    var row = 14;

    this.setState({
      decks: this.state.decks.concat({
        i: i.toString(),
        x: i,
        y: row,
        w: width,
        h: height,
        minH: 14,
        maxH: 14,
        minW: 1,
        maxW: 3,
        title:this.state.title,
        description:this.state.description,
      }),
      showDeckBuilder:false,
      showAddDeck:true,
      myDeck:[],
      selectclass:'',
      title:'',
      description:'',
      classCards:[],

    });
  },

  deckBuilder(el) {
    console.log(el);
    var i = el.i;
    var title = el.title;
    var description = el.description;

    return (
      <div key={i} data-grid={el}>
        <h3>{title}</h3>
        <h6>{description}</h6>
        <ul>
          {this.state.myDeckFinal}
        </ul>
      </div>
    );
  },

  render() {
    var title = "Hearthstone Deck Builder - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_HSDeckBuilder" ).addClass('active');

  	//{this.state.renderChild ? <SignUpWindow unmountMe={this.handleChildUnmount} /> : null}
    return (
      <div>
	      <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
	          onBreakpointChange={this.onBreakpointChange} {...this.props}>
	          {_.map(this.state.decks, this.deckBuilder)}
	      </ResponsiveReactGridLayout>

  		  <div className="row dropFade" style={{display: this.state.showStore ? 'block' : 'none'}}>
	        <h5>Choose a Class: </h5>
	        <select value={this.state.selectclass} onChange={this.showBuilder}>
	            <option className="disabled" value="" disabled>Choose a Class</option>
	            <option value="Druid">Druid</option>
	            <option value="Hunter">Hunter</option>
	            <option value="Mage">Mage</option>
	            <option value="Paladin">Paladin</option>
	            <option value="Priest">Priest</option>
	            <option value="Rogue">Rogue</option>
	            <option value="Shaman">Shaman</option>
	            <option value="Warlock">Warlock</option>
	            <option value="Warrior">Warrior</option>
	        </select>
	        <br/>
	        <br></br>
	      </div>

        <div className="row dropFade" style={{display: this.state.showDeckBuilder ? 'block' : 'none'}}>
          <h5>Create a Deck: </h5>
          <h6>Title: </h6>
          <input type="text" name="title" id="deck_title" onChange={(event) => {this.setState({title: event.target.value})}} value={this.state.title}></input>
          <h6>Description: </h6>
          <input type="text" name="description" id="deck_desc" onChange={(event) => {this.setState({description
            : event.target.value})}} value={this.state.description}></input>

          <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
              onBreakpointChange={this.onBreakpointChange} {...this.props}>
              <div key="1" data-grid={{x: 0, y: 0, w: 1, h: 8, static: true}} className="hearthstone_scroll">
                <h4>{this.state.selectclass} Cards</h4>
                <input type="text" id="class_card" onKeyUp={this.searchClassCards} placeholder="Search a Card"></input>
                <ul id="class_card_list">
                  {this.state.classCards}
                </ul>
              </div>
              <div key="2" data-grid={{x: 1, y: 0, w: 1, h: 8, static: true}} className="hearthstone_scroll">
                <h4>Neutral Cards</h4>
                <input type="text" id="neutral_card" onKeyUp={this.searchNeutralCards} placeholder="Search a Card"></input>
                <ul id="neutral_card_list">
                  {this.state.neutral}
                </ul>
              </div>
              <div key="3" data-grid={{x: 2, y: 0, w: 1, h: 14, static: true}} className="hearthstone_scroll">
                <h4>Deck</h4>
                <ul id="deck_list">
                  {this.state.myDeck}
                </ul>
              </div>
          </ResponsiveReactGridLayout>

          <br/>
          <br></br>

          <form onSubmit={this.handleSubmit}>
            <button className="button" type="submit" value="Submit">Submit</button>
          </form>
        </div>
	      <div className="row">
        	<button style={{display: this.state.showAddDeck ? 'block':'none' }} className="button secondary hollow" id="show" onClick={this.show}>Add Hearthstone Deck</button>
        </div>
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
