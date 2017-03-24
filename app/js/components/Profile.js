

module.exports = global.Profile = React.createClass({


  getDefaultProps() {
    return {};
  },

  getInitialState() {

    return {
    };
  },



  loadProfile(){
    var viewProfileID = electron.remote.getGlobal('sharedObject').viewProfileID;
    $.get(api_server+'/user/profile/'+ viewProfileID + '/info').done((res)=>{
    	if (!res.avatar) {
    		var avatar = './../app/img/user.jpg';
        } else {
        	var avatar = api_server+'/img/avatars/'+viewProfileID+'.jpg?' + new Date().getTime();
          	this.setState({showImageDelete:true});
        }
        this.setState({
                		username:res.username,
                        firstname:res.firstname,
                        lastname:res.lastname,
                       	birthday:res.dateofbirth,
                       	aboutme:res.aboutme,
                       	avatar:avatar,
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
      <h4>{this.state.firstname}</h4>
      <h5>{this.state.lastname}</h5>
      <h6>{this.state.birthday}</h6>
     	<p>{this.state.aboutme}</p> <br/>
     	</div>
     	)


  },
});
