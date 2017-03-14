

module.exports = global.Profile = React.createClass({


  getDefaultProps() {
    return {};
  },

  getInitialState() {

    return {
    };
  },



  loadProfile(){
    var id = electron.remote.getGlobal('sharedObject').id;
    $.get(api_server+'/user/profile/'+ id + '/info').done((res)=>{
    	if (!res.avatar) {
    		var avatar = './../app/img/user.jpg';
        } else {
        	var avatar = 'http://gamempire.net/img/avatars/'+id+'.jpg?' + new Date().getTime();
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
  	var title = "My Profile\u2014 Gamempire"
    document.title = title
    document.getElementById('title').textContent = title

    //Removes all Active class from Menu
    $("#mySidenav>a.active").removeClass("active");

    //Set Dashbaord as active in menu
    $( "#_Profile" ).addClass('active');

     return (<div>
     	<img src={this.state.avatar} /><br/>
     	<h3>{this.state.username}</h3>
     	<p>{this.state.aboutme}</p> <br/>
     	</div>
     	)

 
  },
});

