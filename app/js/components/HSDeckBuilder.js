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
      cols: {lg: 3, md: 3, sm: 3, xs: 3, xxs: 3},
      isDraggable: false,
      verticalCompact: true
    };
  },

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
      heroCard:'',
      title:'',
      description:'',
      cardCounter:0,
      hsCardKey:0
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
    // Uncomment the below code during release/testing phases. Comment it during development.
    unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Neutral?collectible=1")
    .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
    .end(function (result) {
      //console.log(result.body);
      var i = 0;
      while (i < result.body.length) {
        this.setState({neutral: this.state.neutral.concat(<li key={i}>
          <a href="#" id={result.body[i].cost} name={result.body[i].name} value={result.body[i].rarity}
          onClick={this.putCardToDeck}>{result.body[i].cost} {result.body[i].name}</a></li>)});
        i++;
      };
      //console.log(this.state.neutral);
    }.bind(this));
    if (event.target.value == 'Druid') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Druid?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        //increment the value if a new hero is added or decrement if a hero is removed
        var i = 1;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Hunter') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Hunter?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[1].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Mage') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Mage?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 3;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Paladin') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Paladin?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[1].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Priest') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Priest?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Rogue') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Rogue?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 1;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Shaman') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Shaman?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[1].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Warlock') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warlock?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 1;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    } else if (event.target.value == 'Warrior') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warrior?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        //console.log(result.body);
        var i = 2;
        this.putClassCards(i, result.body);
        this.setState({heroCard: result.body[0].img});
        //console.log(this.state.classCards);
      }.bind(this));
    }
  },

  //helper function for putting in class card names only into a list
  putClassCards(i, deck) {
    while (i < deck.length) {
      this.setState({classCards: this.state.classCards.concat(<li key={i}>
        <a href="#" id={deck[i].cost} name={deck[i].name} value={deck[i].rarity}
        onClick={this.putCardToDeck}>{deck[i].cost} {deck[i].name}</a></li>)});
      i++;
    };
    console.log(this.state.classCards);
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
    var card_cost = event.target.getAttribute('id');
    var card_picked = "";
    var i = this.state.myDeck.length;
    var count = 0;

    for (var j = 0; j < this.state.myDeckFinal.length; j++) {
      //have to do this for loop to put the elements inside the 
      //this.state.myDeckFinal[j].props.children array into one
      //string
      for (let k of this.state.myDeckFinal[j].props.children) {
        card_picked = card_picked + k
      }
      if (card_picked == card_cost + " " + card_name) {
        count++;
      } else if (card_picked == card_cost + " " + card_name + ' x2') {
        count = 2;
      }
      card_picked = "";
    }

    //myDeck is for during deck creation, the deck names need to be clickable
    //to call removeCard function to remove a desired card.
    //myDeckFinal is for publishing the deck, the deck names are not clickable
    //and only for display.
    if (this.state.cardCounter < 30 && card_rarity != 'Legendary' && count == 0) {
      this.setState({myDeck: this.state.myDeck.concat(<li key={this.state.hsCardKey}>
          <a href="#" id={card_cost} name={card_name} value={card_rarity}
          onClick={this.removeCard}>{card_cost} {card_name}</a></li>)});
      this.setState({myDeckFinal: this.state.myDeckFinal.concat(<li key={this.state.hsCardKey}>
          {card_cost} {card_name}</li>)});
      this.setState({cardCounter: this.state.cardCounter + 1});
      this.setState({hsCardKey: this.state.hsCardKey + 1});
    } else if (this.state.cardCounter < 30 && card_rarity != 'Legendary' && count == 1) {
      //If a card already exists and the user wants to add the same card,
      //remove the original card from the list and add in the card with x2
      //to indicate there are 2 cards. Otherwise, just add the card normally.
      for (var j = 0; j < i; j++) {
        for (let k of this.state.myDeckFinal[j].props.children) {
          card_picked = card_picked + k
        }
        if (card_picked == card_cost + " " + card_name) {
          this.state.myDeck.splice(j, 1, <li key={this.state.hsCardKey}>
              <a href="#" id={card_cost} name={card_name} value={card_rarity}
              onClick={this.removeCard}>{card_cost} {card_name+' x2'}</a></li>)
          this.setState({myDeck: this.state.myDeck});
          this.state.myDeckFinal.splice(j, 1, <li key={this.state.hsCardKey}>
              {card_cost} {card_name+' x2'}</li>)
          this.setState({myDeckFinal: this.state.myDeckFinal});
          this.setState({cardCounter: this.state.cardCounter + 1});
          this.setState({hsCardKey: this.state.hsCardKey + 1});
        }
        card_picked = "";
      }
    } else if (this.state.cardCounter < 30 && card_rarity == 'Legendary' && count == 0) {
      this.setState({myDeck: this.state.myDeck.concat(<li key={this.state.hsCardKey}>
          <a href="#" id={card_cost} name={card_name} value={card_rarity}
          onClick={this.removeCard}>{card_cost} {card_name}</a></li>)});
      this.setState({myDeckFinal: this.state.myDeckFinal.concat(<li key={this.state.hsCardKey}>
          {card_cost} {card_name}</li>)});
      this.setState({cardCounter: this.state.cardCounter + 1});
      this.setState({hsCardKey: this.state.hsCardKey + 1});
    }
  },

  removeCard(event) {
    var deck_list = [];
    var card_name = event.target.getAttribute('name');
    var card_rarity = event.target.getAttribute('value');
    var card_cost = event.target.getAttribute('id');
    var card_picked = '';

    //First, put all card names in the deck into a list
    for (var i = 0; i < this.state.myDeck.length; i++) {
      for (let k of this.state.myDeckFinal[i].props.children) {
        card_picked = card_picked + k
      }
      deck_list.push(card_picked);
      card_picked = '';
    }

    //Second, find the index of the card to be removed
    for (var j = 0; j < deck_list.length; j++) {
      //If card_name has ' x2' in its name, remove that and replace it
      //with the original name without the ' x2'. Otherwise, remove the
      //card as normal.
      if (deck_list[j] == card_cost + " " + card_name + ' x2') {
        this.state.myDeck.splice(j, 1, <li key={this.state.hsCardKey}>
            <a href="#" id={card_cost} name={card_name} value={card_rarity}
            onClick={this.removeCard}>{card_cost} {card_name}</a></li>)
        this.setState({myDeck: this.state.myDeck});
        this.state.myDeckFinal.splice(j, 1, <li key={this.state.hsCardKey}>
            {card_cost} {card_name}</li>)
        this.setState({myDeckFinal: this.state.myDeckFinal});
        this.setState({cardCounter: this.state.cardCounter - 1});
        this.setState({hsCardKey: this.state.hsCardKey + 1});
      } else if (deck_list[j] == card_cost + " " + card_name) {
        var index = j;
        this.state.myDeck.splice(index, 1);
        this.setState({myDeck: this.state.myDeck});
        this.state.myDeckFinal.splice(index, 1);
        this.setState({myDeckFinal: this.state.myDeckFinal});
        this.setState({cardCounter: this.state.cardCounter - 1});
      }
    }
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

  render() {

    return (
      <div className="hearthstone_scroll">

        <br/>

        <div className="row">
          <button style={{display: this.state.showAddDeck ? 'block':'none' }} className="button secondary 0e1519" id="show" onClick={this.show}>Add Hearthstone Deck</button>
        </div>

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
        </div>

        <div className="row dropFade" style={{display: this.state.showDeckBuilder ? 'block' : 'none'}}>
          <h5>Create a Deck: </h5>
          <h6>Title: </h6>
          <input type="text" name="title" id="deck_title" onChange={(event) => {this.setState({title: event.target.value})}} value={this.state.title}></input>
          <h6>Description: </h6>
          <input type="text" name="description" id="deck_desc" onChange={(event) => {this.setState({
            description: event.target.value})}} value={this.state.description}></input>
        </div>

        <ResponsiveReactGridLayout style={{display: this.state.showDeckBuilder ? 'block' : 'none'}}
            layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange} {...this.props}>
            <div key="a" data-grid={{x: 0, y: 0, w: 1, h: 11, static: true}} className="hearthstone_scroll">
              <h4>{this.state.selectclass} Cards</h4>
              <input type="text" id="class_card" onKeyUp={this.searchClassCards} placeholder="Search a Card"></input>
              <ul id="class_card_list">
                {this.state.classCards}
              </ul>
            </div>
            <div key="b" data-grid={{x: 1, y: 0, w: 1, h: 11, static: true}} className="hearthstone_scroll" style={{left: '33.33%'}}>
              <h4>Neutral Cards</h4>
              <input type="text" id="neutral_card" onKeyUp={this.searchNeutralCards} placeholder="Search a Card"></input>
              <ul id="neutral_card_list">
                {this.state.neutral}
              </ul>
            </div>
            <div key="c" data-grid={{x: 2, y: 0, w: 1, h: 11, static: true}} className="hearthstone_scroll" style={{left: '66.66%'}}>
              <h4>Deck {this.state.cardCounter}/30</h4>
              <ul id="deck_list">
                <center><img src={this.state.heroCard} height="250" width="250"/></center>
                {this.state.myDeck}
              </ul>
            </div>
        </ResponsiveReactGridLayout>

        <div className="row dropFade" style={{display: this.state.showDeckBuilder ? 'block' : 'none'}}>
          <form onSubmit={this.handleSubmit}>
            <button className="button" type="submit" value="Submit">Submit</button>
            <center><div className="input-group-field" id="hsmsg"></div></center>
          </form>
        </div>

        <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange} {...this.props}>
            {_.map(this.state.decks, this.deckBuilder)}
        </ResponsiveReactGridLayout>
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
