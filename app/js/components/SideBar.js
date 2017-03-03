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
                      console.log("aboutme on server!");
                    }).fail((err)=>{
                      console.log("aboutme fail to update to server!")
                    });


  },

	getInitialState() {
		var profile = electron.remote.getGlobal('sharedObject').profile;
		var id =electron.remote.getGlobal('sharedObject').id;
		return {
			id:id,
			username:profile.username,
			aboutMe:profile.aboutme,
		};

	},


	render() {

		return <div>
		    <div id="mySidenav" className="sidenav noselect">
					<a href="#"onClick={this._ProfileEdit} id="_ProfileEdit"><b>{this.state.username}</b></a>
					<input type="text" placeholder="About Me" value={this.state.aboutMe} onChange={this.editAboutMe} onBlur={this.updateAboutMe}/>
					<a href="#" onClick={this._Dashboard} id="_Dashboard">Dashboard</a>
					{
					/*
					<a href="#" onClick={this._Playground} id="_Playground">Playground [Buggy]</a>


					<a href="#" onClick={this._Dashboardv2} id="_Dashboardv2">Dashboard v2 [Buggy]</a>


					 NOT WORKING YET
					<a href="#" onClick={this._Spotify} id="_Spotify">Spotify</a>

					<a href="#" id="3">Video Streams</a>
					<a href="#" id="4">Tips & Tricks</a>
					<a href="#" id="5">Guides</a>
					<a href="#" id="6">Esports</a>
					<a id="8" >Add custom page</a>
					*/
					}

					<a href="#" id="_Logout" onClick={this._Logout}>Logout </a>
					<div className="toggleNav" onClick={this.toggleNav}></div>
						    </div>
				<div id="content">
          <div id="main_content"></div>
	    	</div>
				<div className="discordFrame hearthstone_scroll" id="playgroundFrame">

				</div>

		</div>;
	},

	toggleNav(){

		$("#mySidenav, #content, #playgroundFrame").toggleClass("navOpen");
		if ( $("#mySidenav").hasClass("navOpen") ) {
				//do something it does have the protected class!
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_in.png'), auto"});
		}else{
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_out.png'), auto"});
		}
		//quicksize might be obselete will remember to chekc back and remove
		ipc.sendSync('quicksize')
	},

	_Dashboard(){

		ReactDOM.render(
		  	<Dashboardv2 />,
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

	_HSDeckBuilder(){
		ReactDOM.render(
			<HSDeckBuilder />,
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

	_Dashboardv2(){
		ReactDOM.render(
				<Dashboardv2 />,
				document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_Logout(){
		electron.remote.getGlobal('sharedObject').profile=null;
		electron.remote.getGlobal('sharedObject').token=null;
		electron.remote.getGlobal('sharedObject').id=null;
		electron.remote.getGlobal('sharedObject').layout=null;
		console.log(electron.remote.getGlobal('sharedObject'));

		ipc.sendSync('loggedOut')
		ReactDOM.render(
		  <Login />,
		  document.getElementById('main-content')
		);
	}
});
