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

      this.setState({
          username:res.username,
          avatar:avatar
      });
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

    //Set Dashbaord as active in menu
    $( "#_Profile" ).addClass('active');

    return (<div>
     	<img src={this.state.avatar} /><br/>
     	<h3>{this.state.username}</h3>
      <p>{this.state.aboutme}</p>
      <h4>{this.state.firstname} {this.state.lastname}</h4>
      <h6>{this.state.email}</h6> 
      <h6>{this.state.birthday}</h6> <br/>
     	</div>
     	)
  },
});
