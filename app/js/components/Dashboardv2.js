var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

const originalLayouts = getFromLS('layouts') || {};

module.exports = global.Dashboardv2 = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 12, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
      verticalCompact: true
    };
  },

  getInitialState() {
    return {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      profile:{i:"profile",x: 100, y: 100, w: 0, h: 0, static: true},
      addgame:{i:"add",x: 100, y:100 , w: 0, h: 0, static: false},
      games:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      newCounter: 0,
      selectinterest:[],
      selectgame:'',
      showStore:false,
      gamename:'',
      img:null,
      level:null,
      avatar:null,
      hero:null,
      image:null,
      time:null,
      hero1:null,
      image1:null,
      time1:null,
      hero2:null,
      image2:null,
      time2:null,
      aboutMe:"about me",

    };
  },

  loadWidgets () {
    $.get(api_server+"/widget/show").done(function(res){
      for (var i = 0; i < res.length; i++) {
         $('#selectWidget').append($('<option>', {value:res[i]._id, text:res[i].widgetname}));
      }

    }).fail(function(err){
      console.log("something wrong with the load widget");
    });

  },

  loadProfile(){
    if (typeof(Storage) !== "undefined") {
      this.setState({aboutMe:localStorage.getItem("aboutme")});
      var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/login/load",{
          'token': token
          }).done((d)=> {
              $.get(api_server+'/login/profile/'+ d._id + '/info').done((res)=>{

                  var g=res.gameinventory.length;

                  this.setState({response: res,
                                  username:res.username,
                                  firstname:res.firstname,
                                  lastname:res.lastname});
                  for (var i = 0; i < g; i++) {
                      if (i == 0) {
                            var x =0;
                            var width = 12;
                            var height = 13;
                            var row = 0;
                          } else {
                            var x = (i-1)%3 *4;
                            var width = 4;
                            var height = 13;
                            var row = 14*(1+((i-1)/3));
                          }
                        this.setState({
                                  games: this.state.games.concat({
                                    i: res.gameinventory[i].game,
                                    x: x,
                                    y: row,
                                    w: width,
                                    h: height,
                                    minH: 13,
                                    maxH: 13,
                                    minW: 4,
                                    maxW: 12,
                                    int:res.gameinventory[i].interest,
                                    useringame:res.gameinventory[i].useringame,
                                  })
                      });

                      if(res.gameinventory[i].game =="Overwatch"){
                        var names =res.gameinventory[i].useringame;
                        var list =names.split("#");
                        $.get("https://api.lootbox.eu/pc/us/"+list[0]+"-"+list[1]+"/profile").done((res)=>{
                           this.setState({
                            level:res.data.level,
                            avatar:res.data.avatar,
                          });
                        });
                        $.get("https://api.lootbox.eu/pc/us/"+list[0]+"-"+list[1]+"/competitive/heroes").done((res)=>{
                           var H =JSON.parse(res);

                           this.setState({
                            hero:H[0].name,
                            image:H[0].image,
                            time:H[0].playtime,
                            hero1:H[1].name,
                            image1:H[1].image,
                            time1:H[1].playtime,
                            hero2:H[2].name,
                            image2:H[2].image,
                            time2:H[2].playtime,

                        });
                        });
                      }
                  }
          });
      });
    }
  },

  componentWillMount: function(){
    this.loadProfile();
    this.loadWidgets();
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

  handleChange(event) {
    this.setState({selectgame: event.target.value});
  },

  show() {
    this.setState({showStore: true});
  },

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.gamename == ''){
       $("#msg").html("username in game must be filled in.<button id='close' onclick='$(this).parent().hide();' ></button>");
        $("#msg").addClass('label warning input-group-field');
        $("#msg").addClass("shake");
        $("#msg").show();
        setTimeout(function () {
          $("#msg").removeClass("shake");
        },200);
        return false;
    }
    var L = this.state.games.length;
    for (var i = 0; i < L; i++) {
      if(this.state.selectgame == this.state.games[i].i){
        $("#msg").html("The game already exists!<button id='close' onclick='$(this).parent().hide();' ></button>");
        $("#msg").addClass('label warning input-group-field');
        $("#msg").addClass("shake");
        $("#msg").show();
        setTimeout(function () {
          $("#msg").removeClass("shake");
        },200);
        return false;
      }
    }

    var token = electron.remote.getGlobal('sharedObject').token;
    $.post(api_server+"/user/load",
              {
                 'token' :token
              }).done((d)=> {
                 $.ajax({
                         url:api_server+"/user/profile/addgames",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:d._id,
                             game:this.state.selectgame,
                             useringame:$("#gameusername").val(),
                             interest:this.state.selectinterest
                         })
                     }).done((res)=>{

                      var i=this.state.games.length;

                        if (i == 0) {
                          var x=0;
                          var width = 12;
                          var height = 13;
                          var row = 0;
                        } else {
                          var width = 4;
                          var height = 13;
                          var row = 14*(1+((i-1)/3));
                          var x = (i-1)%3 *4;
                        }

                        this.setState({
                              games: this.state.games.concat({
                                i: this.state.selectgame,
                                x: x,
                                y: row,
                                w: width,
                                h: height,
                                minH: 13,
                                maxH: 13,
                                minW: 4,
                                maxW: 12,
                                int:this.state.selectinterest,
                                useringame:$("#gameusername").val(),

                              }),
                              showStore:false,
                              gamename:'',
                              selectgame:'',

                            });

                        var list = $("#gameusername").val().split("#");
                        if(this.state.selectgame=="Overwatch"){
                        $.get("https://api.lootbox.eu/pc/us/"+list[0]+"-"+list[1]+"/profile").done((res)=>{
                            this.setState({
                              level:res.data.level,
                              avatar:res.data.avatar,
                              });
                          });
                        $.get("https://api.lootbox.eu/pc/us/"+list[0]+"-"+list[1]+"/competitive/heroes").done((res)=>{
                            var H = JSON.parse(res);
                            this.setState({
                              hero:H[0].name,
                              image:H[0].image,
                              time:H[0].playtime,
                              hero1:H[1].name,
                              image1:H[1].image,
                              time1:H[1].playtime,
                              hero2:H[2].name,
                              image2:H[2].image,
                              time2:H[2].playtime,

                            });
                          });
                        }
                      }).fail((err)=>{
                             alert("opps!");
                         });
                     });
  },

  onGame(el){
    var i = el.i;
    var gameImage;
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };
    switch(i) {
    case "League of Legends":
        gameImage = "lol";
        break;
    default:
        gameImage = i;
    };
    return (
      <div key={el.i} data-grid={el}>
        <h2>{el.i} </h2>
        <div className="gameImage" style={{background: 'url(./../app/img/'+gameImage+'.png)'}}>
          <div className="row">
            <div className="overlay">
                { el.i =="Overwatch" ?  ( <div>  <div className="row user"><img className="avatar" src={this.state.avatar} /><div><h5>{el.useringame}</h5><p>level:{this.state.level}
                                     </p></div></div>
                                     <hr />
                <div className="row heroes">
                  <div className="column small-4"><img src={this.state.image} />  <h6>{this.state.hero}</h6><p>{this.state.time}</p></div>
                  <div className="column small-4"><img src={this.state.image1} /> <h6>{this.state.hero1}</h6><p>{this.state.time1} </p></div>
                  <div className="column small-4"><img src={this.state.image2} /> <h6>{this.state.hero2}</h6> <p>{this.state.time2}</p> </div>
                </div>
              </div>
              ):(<p>example</p>) }
            </div>
            {/*<p>interest:</p>
            <p>{el.int}</p>
            <p>username in game : {el.useringame} </p>
            <button className="button" onClick={this.editgame(el)}>Edit</button>*/}
          </div>
        </div>
        <span className="remove" style={removeStyle} onClick={this.removeWidget.bind(this, i)}>x</span>
        <ul className="menu horizontal">
        <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
        </a></li>
        <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        </a></li>
        <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>
        </a></li>
        </ul>
      </div>
    );
  },

  removeWidget(i) {
    this.setState({games: _.reject(this.state.games, {i: i})});
    var token = electron.remote.getGlobal('sharedObject').token;
    $.post(api_server+"/user/load",
              {
                 'token' :token
              }).done((d)=> {
                 $.ajax({
                         url:api_server+"/user/profile/removegames",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:d._id,
                             game:i
                         })
                     }).done((res)=>{
                      console.log("remvoed!");
                     }).fail((res)=>{
                      console.log("fail to remove");
                     });
                   });

  },

  goToProfileEdit() {
  let MainWindow =  ReactDOM.render(
        <ProfileEdit />,
        document.getElementById('content'));
  },

  editAboutMe(event) {

    this.setState({aboutMe:event.target.value});
  },

  render() {
    // Set Titles
    var title = "Dashboard v2 - Testing - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_Dashboardv2" ).addClass('active');

    if (this.state.response) {
      return (
        <div className="noselect">
        <div className="row profileHeader">
        <div className="column small-8 user noselect">
          <img className="avatar" height="60" width="60" src="./../app/img/GamEmpireLogo.png" />
          <div>
            <h3 onClick={this.goToProfileEdit}>{this.state.username}</h3>
            <input type="text" placeholder="About Me" value={this.state.aboutMe} onChange={this.editAboutMe} onBlur={(event) => {localStorage.setItem("aboutme", this.state.aboutMe)}}/>

          </div>
        </div>
        <div className="column small-4"><button className="button noselect" onClick={this.resetLayout}>Reset Layout</button></div>
        </div>

          <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
              onBreakpointChange={this.onBreakpointChange} {...this.props}>

              {_.map(this.state.games, this.onGame)}
          </ResponsiveReactGridLayout>

          <div className="row dropFade" style={{display: this.state.showStore ? 'block' : 'none'}}>
            <form onSubmit={this.handleSubmit}>
              <h5>Add widget:</h5>
              <select value={this.state.selectgame} onChange={this.handleChange} id="selectWidget">
                  <option className="disabled" value="" disabled>Select a game</option>
                  <option value="Hearthstone">Hearthstone</option>
                  <option value="Overwatch">Overwatch</option>
                  <option value="Dota2">Dota2</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="StarCraft II">StarCraft II</option>
                  <option value="CSGO">CSGO</option>
                  <option value="Call of Duty">Call of Duty</option>
                  <option value="Heroes of the Storm">Heroes of the Storm</option>
                  <option value="Halo 5">Halo 5</option>
              </select>
              <br/> Username in Game:
              <br></br>
              <input id="gameusername" type="text" placeholder="YourTag#0000 OR Yourname" onChange={(event) => {this.setState({gamename: event.target.value})}} value={this.state.gamename}/>
               <center><div className="input-group-field" id="msg"></div></center>
              <button className="button" type="submit" value="Submit" >Submit</button>
            </form>
          </div>

          <div className="row">
            <button style={{display: this.state.showStore ?  'none':'block' }} className="button secondary hollow" id="show" onClick={this.show}>+</button>
          </div>
        </div>
      );

    } else {
      return (
        <div className="noselect">Loading</div>
        );
    }
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

$.get(api_server+"/widget/show").done(function(res){
  for (var i = 0; i < res.length; i++) {
     $('#selectWidget').append($('<option>', {value:res[i]._id, text:res[i].widgetname}));
  }

}).fail(function(err){
  console.log("something wrong with the load widget");
});