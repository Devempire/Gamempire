var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

const listWidgets = require('./listWidgets.js');

module.exports = global.Dashboardv2 = React.createClass({

  getDefaultProps() {
    return {
      breakpoint: "md",
      className: "layout",
      cols: {lg: 18, md: 24, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
    };
  },


  getInitialState() {
    return {
      layouts: {},
      games:[],
      widgets:[],
      response:undefined,
      showStore:false,
      selectwidget:'',
    };
  },


    onLayoutChange(layout, layouts) {
      if(global.loading=="no"){
  
       if(JSON.stringify(layouts.md)=="[]") {
         console.log('LAYOUTS CURENTLY NONE');
       }else{
        this.setState({layouts});


      var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/user/load",
                {
                   'token' :token
                }).done((d)=> {
                  $.ajax({
                           url:api_server+"/user/profile/updatelayout",
                           type:"PUT",
                           contentType: 'application/json; charset=utf-8',
                           data:JSON.stringify({
                               _id:d._id,
                               layout:this.state.layouts
                           })
                       }).done((res)=>{
                        console.log("layout on server!");
                      }).fail((err)=>{
                        console.log("layout fail to update to server!")
                      })
                });
      }
      }
    },

  loadWidgets(){

    $.get(api_server+"/widget/show").done((res)=>{

      for (var i = 0; i < res.length; i++) {
         this.setState({
          widgets: this.state.widgets.concat({
            value:res[i]._id,
            text:res[i].widgetname,
            widgettype:res[i].widgettype
          })
         });

      }
    }).fail((err)=>{
      console.log("something wrong with the load widget");
    });

  },

  loadProfile(){

      var token = electron.remote.getGlobal('sharedObject').token;
      $.post(api_server+"/user/load",{
          'token': token
          }).done((d)=> {
              $.get(api_server+'/user/profile/'+ d._id + '/info').done((res)=>{

                  var g=res.widgets.length;
                  this.setState({response: res,
                                  username:res.username,
                                  firstname:res.firstname,
                                  lastname:res.lastname,
                                  aboutMe:res.aboutme,
                                  layouts:res.layout,
                                  });
                  console.log(res.layout.md);
                  for (var h = 0; h < g; h++) {

                        $.get(api_server+'/widget/find/'+ res.widgets[h].widgetid + '/info').done((res2)=>{
                            var xx=res2.x;
                            var yy=res2.y;
                            var ww=res2.w;
                            var hh=res2.h;
                            for(var j=0; j<this.state.layouts.md.length; j++){
                              if(this.state.layouts.md[j].i == res2._id){
                                var xx=this.state.layouts.md[j].x;
                                var yy=this.state.layouts.md[j].y;
                                var ww=this.state.layouts.md[j].w;
                                var hh=this.state.layouts.md[j].h;
                              }
                              console.log('x: '+ xx);
                              console.log('y: '+yy);
                              console.log('w: '+ww);
                              console.log('h: '+hh);
                          }

                          this.setState({
                                  games: this.state.games.concat({
                                    i: res2._id,
                                    widgettype:res2.widgettype,
                                    widgetname:res2.widgetname,
                                    x:xx,
                                    y:yy,
                                    h:hh,
                                    w:ww,
                                    minH: res2.minH,
                                    maxH: res2.maxH,
                                    minW: res2.minW,
                                    maxW: res2.maxW,
                                  })
                            });

                      });

                  }


          });
      });
        global.loading="no";
  },

  componentWillMount: function(){
    this.loadProfile();
    this.loadWidgets();
  },



  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },


  handleChange(event) {
    $( "#add_widget_button" ).prop( "disabled", false );

    this.setState({
          selectwidget: event.target.value,
         });
  },

  show() {
    this.setState({showStore: true});
  },


  handleSubmit(event) {
    event.preventDefault();
    var L = this.state.games.length;
    for (var h = 0; h < L; h++) {
      if(this.state.selectwidget === this.state.games[h].i){
        $("#msg").html("The widget already exists! <button id='close' onclick='$(this).parent().hide();' ></button>");
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
                         url:api_server+"/user/profile/addwidget",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:d._id,
                             widgetid:this.state.selectwidget,
                         })
                     }).done((res)=>{

                        $.get(api_server+'/widget/find/'+ this.state.selectwidget + '/info').done((res2)=>{
                        var i=this.state.games.length;

                        if (i == 0) {
                          var x=0;
                          var row = 0;
                        } else {
                          var row = 14*(1+((i-1)/3));
                          var x = (i-1)%3 *4;
                        }

                        this.setState({
                              games: this.state.games.concat({
                                i: this.state.selectwidget,
                                widgettype:res2.widgettype,
                                widgetname:res2.widgetname,
                                x: x,
                                y: row,
                                w: res2.w,
                                h: res2.h,
                                minH: res2.minH,
                                maxH: res2.maxH,
                                minW: res2.minW,
                                maxW: res2.maxW,
                              }),
                              showStore:false,
                              selectwidget:'',

                            });

                        });
                      }).fail((err)=>{
                             alert("opps!");
                          });
                     });
  },


  onGame(el){
    var i =el.i;
    var widgettype = el.widgettype;
    var widgetID =el.i;
    var widgetTitle=el.widgetname;
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };

    if (widgettype == 'game') {
        return (
          <div key={widgetID} data-grid={el} className="widgetFrame">
            <p className="widgetTitle noselect">{widgetTitle} <span className="remove" style={removeStyle} onClick={this.removeWidget.bind(this, i)}>x</span></p>
            <div className="widget">
            <div className="gameImage" style={{background: 'url(./../app/img/widget_img/'+widgetID+'.png)'}}>
              <div className="row">
                <div className="overlay">
                  <p>example</p>
                </div>
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
          </div>
        );
    } else if (widgettype == 'social' || widgettype == 'music') {
    //                                                                                                                                          LOL = 58a7a0dd27b83be81d3008e3
    //if (el.i === "58a73d8a27b83be81d3008b3"|| "58a7fd3c27b83be81d30091c" || "58a7fd4827b83be81d30091d" || "58a7fd5027b83be81d30091e" || "58a7fd6227b83be81d30091f" || "58a7a0dd27b83be81d3008e3") {
      return (
        <div key={widgetID} data-grid={el} className="widgetFrame">
          <p className="widgetTitle noselect">{widgetTitle} <span className="remove" style={removeStyle} onClick={this.removeWidget.bind(this, i)}>x</span></p>
          {listWidgets.loadwid(widgetID)}
        </div>
      );
    } else if (widgettype == 'other') {
      return (
      <div key={widgetID} data-grid={el} className="widgetFrame">
        <p className="widgetTitle noselect">{widgetTitle} <span className="remove" style={removeStyle} onClick={this.removeWidget.bind(this, i)}>x</span></p>
        {listWidgets.loadjsx(widgetID)}
      </div>
    );
    }
    //console.log(widgetTitle + ' Loaded.');


  },

  onwidget(item){
    return (
      <option key={item.value} id={item.text} value={item.value} name={item.widgettype}>{item.text}</option>
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
                         url:api_server+"/user/profile/removewidget",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:d._id,
                             widgetid:i
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

  updateAboutMe(event){
    var token = electron.remote.getGlobal('sharedObject').token;
    $.post(api_server+"/user/load",
              {
                 'token' :token
              }).done((d)=> {
                $.ajax({
                         url:api_server+"/user/profile/updateaboutme",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:d._id,
                             aboutme:this.state.aboutMe
                         })
                     }).done((res)=>{
                      console.log("aboutme on server!");
                    }).fail((err)=>{
                      console.log("aboutme fail to update to server!")
                    })
              });

  },

  render() {
    // Set Titles
    var title = "Dashboard v2 - Testing - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_Dashboard" ).addClass('active');

    if (this.state.response) {
      return (
        <div className="noselect">
        <h2 className="profilehover" onClick={this.goToProfileEdit}>{this.state.username}</h2>
        <input type="text" placeholder="About Me" value={this.state.aboutMe} onChange={this.editAboutMe} onBlur={this.updateAboutMe}/>

          <ResponsiveReactGridLayout draggableCancel={".widget"} layouts={this.state.layouts} onLayoutChange={this.onLayoutChange}
              onBreakpointChange={this.onBreakpointChange} {...this.props}>

              {_.map(this.state.games, this.onGame)}
          </ResponsiveReactGridLayout>

          <div className="row dropFade" style={{display: this.state.showStore ? 'block' : 'none'}}>
            <form onSubmit={this.handleSubmit}>
              <h5>Add widget:</h5>
              <select value={this.state.selectwidget} onChange={this.handleChange} id="selectWidget">
                  <option className="disabled" value="" disabled>Select a widget</option>
                  {_.map(this.state.widgets, this.onwidget)}

              </select>

              <button className="button" type="submit" id="add_widget_button" value="Submit" disabled>Add</button>
            </form>
            <center><div className="input-group-field" id="msg"></div></center><br/>
          </div>

          <div className="row">
            <button style={{display: this.state.showStore ?  'none':'block' }} className="button secondary 0e1519" id="show" onClick={this.show}>+</button>
          </div>
        </div>
      );

    } else {
      return (
        <div className="content-loading"></div>
        );
    }
  }


});