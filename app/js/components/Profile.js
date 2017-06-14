var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

module.exports = global.Profile = React.createClass({

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  loadProfile(){
    var viewProfileID = electron.remote.getGlobal('sharedObject').viewProfileID;
    $.get(api_server+'/login/profile/'+ viewProfileID + '/info').done((res)=>{
    	if (!res.avatar || res.privacy.avatar == true || res.privacy.avatar == "true") {
  		  var avatar = './../app/img/user.jpg';
      } else {
      	var avatar = api_server+'/img/avatars/'+viewProfileID+'.jpg?' + new Date().getTime();
        	this.setState({showImageDelete:true});
      }

      if (res.privacy.firstname == false || res.privacy.firstname == "false") {
        this.setState({firstname:res.firstname});
      }

      if (res.privacy.lastname == false || res.privacy.lastname == "false") {
        this.setState({lastname:res.lastname});
      }

      if (res.privacy.dateofbirth == false || res.privacy.dateofbirth == "false") {
        this.setState({birthday:res.dateofbirth});
      }

      if (res.privacy.aboutme == false || res.privacy.aboutme == "false") {
        this.setState({aboutme:res.aboutme});
      }

      if (res.privacy.email == false || res.privacy.email == "false") {
        this.setState({email:res.email});
      }

      if (res.privacy.compspecs == false || res.privacy.compspecs == "false") {
        this.setState({cpu:res.comp_specs.cpu.replace("(TM)","™" ).replace("(R)"," ®" )});
        this.setState({gpu:res.comp_specs.gpu.replace("(TM)","™" ).replace("(R)"," ®" )});
        this.setState({harddrive:res.comp_specs.harddrive});
        this.setState({ram:res.comp_specs.ram});
        this.setState({monitor:res.comp_specs.monitor});
      }

      this.setState({
          username:res.username,
          avatar:avatar
      });
    }).fail((res)=>{
        console.log('Failed to load profile.');
        vex.dialog.alert({
            message: 'Failed to load profile.',
            callback: function (value){
                if (value) {
                  return;
                }
            }.bind(this)
        })
       });
  },

  componentWillMount: function(){
    this.loadProfile();
  },

  render() {
  	var title = this.state.username+" Profile\u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");
    $("#mySidenav>a").css("background-color", "");


    //Set Dashbaord as active in menu
    $( "#_Profile" ).addClass('active');

    return (<div><br/><br/>
<div className="row expanded noselect">
  <div className="small-3 large-3 columns noselect" key={Math.random().toString(36).substr(2, 5)}>
    <img className="thumbnail noselect" width="400" src={this.state.avatar} />
  </div>
  <div key={Math.random().toString(36).substr(2, 5)} className="small-6 columns noselect">
    <h2>{this.state.username}</h2>
    <p>{this.state.aboutme}</p>
    <h4>{this.state.firstname} {this.state.lastname}</h4>
    <h6>{this.state.email}</h6>
    <h6>{this.state.birthday}</h6>
  </div>
</div>
<div className="noselect">

    <div className="row collapse prefix-radius">
        <div className="small-1 columns">
          <span className="prefix">CPU</span>
        </div>
        <div className="small-7 columns">
          <span className="secondary radius label">{this.state.cpu}</span>
        </div>
    </div>

    <div className="row collapse prefix-radius">
        <div className="small-1 columns">
          <span className="prefix">GPU</span>
        </div>
        <div className="small-7 columns">
          <span className="secondary radius label">{this.state.gpu}</span>
        </div>
    </div>

    <div className="row collapse prefix-radius">
        <div className="small-1 columns">
          <span className="prefix">RAM</span>
        </div>
        <div className="small-7 columns">
          <span className="secondary radius label">{this.state.ram}</span>
        </div>
    </div>

    <div className="row collapse prefix-radius">
        <div className="small-1 columns">
          <span className="prefix">Hard Drive</span>
        </div>
        <div className="small-7 columns">
          <span className="secondary radius label">{this.state.harddrive}</span>
        </div>
    </div>

    <div className="row collapse prefix-radius">
        <div className="small-1 columns">
          <span className="prefix">Monitor</span>
        </div>
        <div className="small-7 columns">
          <span className="secondary radius label">{this.state.monitor}</span>
        </div>
    </div>

</div>

  </div>)
  },
});
