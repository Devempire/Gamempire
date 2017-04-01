var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

const listWidgets = require('./listWidgets.js');

var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

module.exports = global.Dashboard = React.createClass({

  getDefaultProps() {
    return {
      breakpoint: "md",
      className: "layout",
      cols: {lg: 12, md: 24, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
    };
  },

  getInitialState() {
    var widget = electron.remote.getGlobal('sharedObject').widget;
    var layout = electron.remote.getGlobal('sharedObject').layout;
    var id = electron.remote.getGlobal('sharedObject').id;
    return {
      games:[],
      widgets:[],
      id:id,
      layouts:layout,
      widget:widget,
      showStore:false,
      selectwidget:'',
    };
  },

  onLayoutChange(layout, layouts) {

    this.setState({layouts});
    if(JSON.stringify(layouts.md)=="[]") {
            //console.log('Just stopped a unnecessary API request on blank layouts.');
    }else{
      $.ajax({
        url:api_server+"/login/profile/updatelayout",
        type:"PUT",
        contentType: 'application/json; charset=utf-8',
        data:JSON.stringify({
                             _id:this.state.id,
                             layout:layouts
                         })
                     }).done((res)=>{
                      electron.remote.getGlobal('sharedObject').layout=this.state.layouts;

                    }).fail((err)=>{
                      console.log("Layout failed to update to the server.")
                      vex.dialog.alert({
                          message: 'Layout failed to update to the server.',
                          callback: function (value){
                              if (value) {
                                return;
                              }
                          }.bind(this)
                      })
                    })
    }
  },

  loadWidgets(){
    $.get(api_server+"/widget/show").done((res)=>{
        var i = res.length;
        while (i--) {
          for(var j=0; j<this.state.widget.length;j++){
          if (res[i]._id ==this.state.widget[j].widgetid) {
            res.splice(i, 1);

          }
        }
      }
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
      console.log('Something is wrong with loading widgets.');
      vex.dialog.alert({
          message: 'Something is wrong with loading widgets.',
          callback: function (value){
              if (value) {
                return;
              }
          }.bind(this)
      })
    });

  },

  reRender(widgetID) {
    this.setState({games: _.reject(this.state.games, {i: widgetID})});


    $.get(api_server+'/widget/find/'+ widgetID + '/info').done((res2)=>{
      console.log(res2.widgetname+' widget was reset.');
    var i=this.state.games.length;

    if (i == 0) {
      var x=0;
      var y = 0;
    } else {
      var y = 4*(i/2);
      var x = (i%2) *12;
    }

    this.setState({
          games: this.state.games.concat({
            i: widgetID,
            widgettype:res2.widgettype,
            widgetname:res2.widgetname,
            x: x,
            y: y,
            w: res2.w,
            h: res2.h,
            minH: res2.minH,
            maxH: res2.maxH,
            minW: res2.minW,
            maxW: res2.maxW,
          }),
          widgets: _.reject(this.state.widgets, {value: widgetID}),
          showStore:false,
          selectwidget:'',

        });
    });
    //this.setState({selectwidget: widgetID});
    //this.handleSubmit(widgetID);
  },

  loadLayout(){
    var mdl =this.state.layouts.md;

    var g =this.state.widget.length;
    for (var h = 0; h < g; h++) {
        $.get(api_server+'/widget/find/'+ this.state.widget[h].widgetid + '/info').done((res2)=>{
            var xx=res2.x;
            var yy=res2.y;
            var ww=res2.w;
            var hh=res2.h;
            for(var j=0; j<mdl.length; j++){
              if(mdl[j].i == res2._id){
                xx=mdl[j].x;
                yy=mdl[j].y;
                ww=mdl[j].w;
                hh=mdl[j].h;
                }

                //Debugging
                //console.log('x: '+ xx);
                //console.log('y: '+yy);
                //console.log('w: '+ww);
                //console.log('h: '+hh);
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
  },

  componentWillMount: function(){

    this.loadLayout();
    this.loadWidgets();

  },

  componentDidMount: function(){

    //console.log("component did mouint!");
  },


  onBreakpointChange(breakpoint, cols) {
    //console.log('onBreakpointChange Triggered \n    Breakpoint: '+ breakpoint+'\n     Cols: ' + cols );
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

    // avoid dup checking in widget, it should never happen again with current option selection.
 // var L = this.state.games.length;
 //     for (var h = 0; h < L; h++) {
 //       if(this.state.selectwidget === this.state.games[h].i){
 //         $("#msg").html("The widget already exists! <button id='close' onclick='$(this).parent().hide();' ></button>");
 //         $("#msg").addClass('label warning input-group-field');
 //         $("#msg").addClass("shake");
 //         $("#msg").show();
 //         setTimeout(function () {
 //           $("#msg").removeClass("shake");
 //         },200);
 //         return false;
 //       }
 //     }

                 $.ajax({
                         url:api_server+"/login/profile/addwidget",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:this.state.id,
                             widgetid:this.state.selectwidget,
                         })
                     }).done((res)=>{

                        $.get(api_server+'/widget/find/'+ this.state.selectwidget + '/info').done((res2)=>{
                        var i=this.state.games.length;

                        

                        this.setState({
                              games: this.state.games.concat({
                                i: this.state.selectwidget,
                                widgettype:res2.widgettype,
                                widgetname:res2.widgetname,
                                x: 0,
                                y: Infinity,
                                w: res2.w,
                                h: res2.h,
                                minH: res2.minH,
                                maxH: res2.maxH,
                                minW: res2.minW,
                                maxW: res2.maxW,
                              }),
                              widgets: _.reject(this.state.widgets, {value: this.state.selectwidget}),
                              showStore:false,
                              selectwidget:'',

                            });
                        $.ajax({
                              url:api_server+'/login/profile/'+ this.state.id + '/info',
                              type:"GET"
                             }).done((res3)=>{
                            electron.remote.getGlobal('sharedObject').widget=res3.widgets;
                          });
                        $( "#add_widget_button" ).prop( "disabled", true );





                        });
                      }).fail((err)=>{
                        console.log('Adding a new widget failed.');
                        vex.dialog.alert({
                            message: 'Adding a new widget failed.',
                            callback: function (value){
                                if (value) {
                                  return;
                                }
                            }.bind(this)
                        })
                      });

  },

  onGame(el){
    var i =el.i;
    var widgettype = el.widgettype;
    var widgetID =el.i;
    var widgetTitle=el.widgetname;
    var el = el;

    if (widgettype == 'game') {
        return (
          <div key={widgetID} data-grid={el} className="widgetFrame">
          <p className="widgetTitle noselect">{widgetTitle}
            <span title="Reload widget" className="rerender" onClick={this.reRender.bind(this, widgetID)}>⟳</span>
            <span title="Remove widget" className="remove" onClick={this.removeWidgetConfirm.bind(this, widgetID, widgetTitle)}>✖</span>
          </p>
            <div className="widget">
            <div className="gameImage" style={{background: 'url(./../app/img/widget_img/'+widgetID+'.png)'}}>
              <div className="row">
                <div className="overlay">
                <div>
                  <label>Enter Name </label>
                  <input className="input-group-field noselect" type="text" onChange={(event)=> {this.setState({Name: event.target.value})}}/>
                  <button className="button"  >Submit</button> 
                </div>


                </div>
              </div>
            </div>
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
        <div key={widgetID} data-grid={el} id={widgetID} className="widgetFrame">
        <p className="widgetTitle noselect">{widgetTitle}
          <span title="Reload widget" className="rerender" onClick={this.reRender.bind(this, widgetID)}>⟳</span>
          <span title="Remove widget" className="remove" onClick={this.removeWidgetConfirm.bind(this, widgetID, widgetTitle)}>✖</span>
        </p>
        {listWidgets.loadwid(widgetID)}
        </div>
      );
    } else if (widgettype == 'other') {
      return (
      <div key={widgetID} data-grid={el} className="widgetFrame">
        <p className="widgetTitle noselect">{widgetTitle}
          <span title="Reload widget" className="rerender" onClick={this.reRender.bind(this, widgetID)}>⟳</span>
          <span title="Remove widget" className="remove" onClick={this.removeWidgetConfirm.bind(this, widgetID, widgetTitle)}>✖</span>
        </p>
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

  removeWidgetConfirm(i, name){
    vex.dialog.confirm({
        overlayClosesOnClick: false,
        message: 'Are you sure you want to remove the ' + name + ' Widget?',
        callback: function (value){
            if (value) {
              this.removeWidget(i);
            } else {
              return;
            }
        }.bind(this)
    })
  },

  removeWidget(i) {
    this.setState({games: _.reject(this.state.games, {i: i})});

                 $.ajax({
                         url:api_server+"/login/profile/removewidget",
                         type:"PUT",
                         contentType: 'application/json; charset=utf-8',
                         data:JSON.stringify({
                             _id:this.state.id,
                             widgetid:i
                         })
                     }).done((res)=>{
                      $.get(api_server+'/widget/find/'+ i + '/info').done((res2)=>{
                        this.setState({
                              widgets: this.state.widgets.concat({
                                value:res2._id,
                                text:res2.widgetname,
                                widgettype:res2.widgettype
                              })
                            });
                          });
                      $.ajax({
                              url:api_server+'/login/profile/'+ this.state.id + '/info',
                              type:"GET"
                             }).done((res3)=>{
                            electron.remote.getGlobal('sharedObject').widget=res3.widgets;

                          });

                     }).fail((res)=>{
                      console.log('Widget failed to remove.');
                      vex.dialog.alert({
                          message: 'Widget failed to remove.',
                          callback: function (value){
                              if (value) {
                                return;
                              }
                          }.bind(this)
                      })
                     });
  },

  goToProfileEdit() {
  let MainWindow =  ReactDOM.render(
        <ProfileEdit />,
        document.getElementById('content'));
  },

  render() {
    // Set Titles
    var title = "Dashboard \u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_Dashboard" ).addClass('active');


      return (
        <div className="noselect">
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

  }


});
