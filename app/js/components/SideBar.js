module.exports = global.Bar = React.createClass({

	editAboutMe(event) {
		this.setState({aboutMe:event.target.value});
	},

	updateAboutMe(event){
	    $.ajax({
			url:api_server+"/user/profile/updateaboutme",
			type:"PUT",
			contentType: 'application/json; charset=utf-8',
			data:JSON.stringify({
				_id:this.state.id,
				aboutme:this.state.aboutMe
			})
		}).done((res)=>{

	        }).fail((err)=>{
	          console.log("AboutMe failed to update on server!")
	        });
	},

	getInitialState() {
		var username = electron.remote.getGlobal('sharedObject').username;
		var aboutme = electron.remote.getGlobal('sharedObject').aboutme;
		var id = electron.remote.getGlobal('sharedObject').id;
		var avatar = electron.remote.getGlobal('sharedObject').avatar;

		if (avatar == false) {
			avatar = './../app/img/user.jpg';
		} else {
			avatar = 'http://gamempire.net/img/avatars/'+id+'.jpg?' + new Date().getTime();
		}

		return {
			id:id,
			username:username,
			aboutMe:aboutme,
			avatar:avatar
		};
	},

    componentDidMount: function(){
    	this.topbar();
      //  ReactDOM.render(
      //    <Dashboard />,
        //  document.getElementById('content')
      //  );
      //  console.log("Dashbaord loading...");
    },

	render() {
		return <div>
		    <div id="mySidenav" className="sidenav noselect">
					<a href="#" onClick={this._Dashboard} id="_Dashboard">Dashboard</a>
          <a href="#"onClick={this._ProfileEdit} id="_ProfileEdit">Edit Profile</a>
	{/*
					<a href="#" onClick={this._Playground} id="_Playground">Playground [Buggy]</a>
					<a id="8" >Add custom page</a>
	*/}

					<a href="#" id="_Logout" onClick={this._Logout}>Logout </a>
					<div className="toggleNav" onClick={this.toggleNav}></div>
				</div>

				<div id="content">
          <div id="main_content"><Dashboard /></div>
	    	</div>

				<div className="discordFrame hearthstone_scroll" id="playgroundFrame">
				</div>

		</div>;

    this._Dashboard();

	},

	toggleNav(){

		$("#mySidenav, #top_bar, #content, #playgroundFrame").toggleClass("navOpen");
		if ( $("#mySidenav").hasClass("navOpen") ) {
				//do something it does have the protected class!
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_in.png'), auto"});
		}else{
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_out.png'), auto"});
		}
		//quicksize might be obselete will remember to chekc back and remove
		ipc.sendSync('quicksize');
	},

    extendaboutme(event){
      var ew = ((event.target.value.length + 1) * 10) + 'px';
      document.getElementById('topbar_aboutme').style.width = ew;
      if(event.keyCode == 13){
          document.getElementById('topbar_aboutme').blur();
      }
    },

    topbar(){

      const topbart = (
        <div id="usertopbar">
          <div id="topbar_avatar"><img src={this.state.avatar}/></div> <h5 onClick={this._ProfileEdit}> {this.state.username}</h5>
  				<input type="text" id="topbar_aboutme" defaultValue={this.state.aboutMe}  onChange={this.editAboutMe} onBlur={this.updateAboutMe}  onKeyPress={this.extendaboutme} />
        </div>
  		);

  		ReactDOM.render(
  			topbart,
  		document.getElementById('top_bar')
  		);
    },

	_Dashboard(){
		ReactDOM.render(
		  	<Dashboard />,
	  	document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_ProfileEdit(){
		ReactDOM.render(
			<ProfileEdit />,
			document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_Playground(){
		document.getElementById('content').style.visibility = "hidden";
		document.getElementById('playgroundFrame').style.visibility = "visible";
		var title = "Playground - Gamempire"
		document.title = title
		document.getElementById('title').textContent = title
		$("#mySidenav>a.active").removeClass("active");
		$( "#_Playground" ).addClass('active');
	},

	_Logout(){
    $("#mySidenav, #top_bar, #content, #playgroundFrame").removeClass("navOpen");
		document.getElementById('top_bar').innerHTML = "";
		electron.remote.getGlobal('sharedObject').username=null;
		electron.remote.getGlobal('sharedObject').aboutme=null;
		electron.remote.getGlobal('sharedObject').widget=null;
		electron.remote.getGlobal('sharedObject').token=null;
		electron.remote.getGlobal('sharedObject').id=null;
		electron.remote.getGlobal('sharedObject').layout=null;
		//console.log(electron.remote.getGlobal('sharedObject'));

		ipc.sendSync('loggedOut')
		ReactDOM.render(
		  <Login />,
		  document.getElementById('main-content')
		);
	}
});
