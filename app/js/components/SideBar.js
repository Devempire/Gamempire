module.exports = global.Bar = React.createClass({

	editAboutMe(event) {
		this.setState({aboutMe:event.target.value});
	},

	updateAboutMe(event){
		//global.$('#span_about').text(this.state.aboutMe);
		global.$('#span_about').css({"display":"inline-block"});
		global.$('#topbar_aboutme').css({"display":"none"});
		if (!this.state.aboutMe){
			global.$('#span_about').text(" About Me");//uses special blank character that lets app identify placeholder vs user text. So if userver were to type in [*spacebar* About me] it would recognize as user input vs placeholder.  [U+200C]  Name[En Quad]  html[&#8192;]
		}else{
			global.$('#span_about').text(this.state.aboutMe);
		}
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
    },

	render() {
		return <div>
		    <div id="mySidenav" className="sidenav noselect">
					<a href="#" onClick={this._Dashboard} id="_Dashboard">Dashboard</a>
					<a href="#"onClick={this._Profile} id="_Profile">My Profile</a>
          			<a href="#"onClick={this._ProfileEdit} id="_ProfileEdit">Edit Profile</a>
					<a href="#"onClick={this._Friends} id="_Friends">Friends</a>
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
global.$('#usertopbar').width(global.$('#top_bar').width());
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
			if (event.key == 'Enter') {
				this.updateAboutMe(event);
          //document.getElementById('topbar_aboutme').blur();
      }
    },


		aboutP(){
			var about = global.$('#span_about').text();
			if (about ==" About Me"){ //uses special blank character that lets app identify placeholder vs user text. So if userver were to type in [*spacebar* About me] it would recognize as user input vs placeholder.  [U+200C]  Name[En Quad]  html[&#8192;]
				global.$('#topbar_aboutme').val("");
			}else{
				global.$('#topbar_aboutme').val(about);
			}
			global.$('#span_about').css({"display":"none"});
			global.$('#topbar_aboutme').css({"display":"inline-block"});
			global.$('#topbar_aboutme').focus();

			var ew = ((about.length + 1) * 10) + 'px';
      document.getElementById('topbar_aboutme').style.width = ew;

		},

    topbar(){
			if (!this.state.aboutMe) {
	      var spanabout = <span title="Click to edit" id="span_about" onClick={this.aboutP}> About Me</span>;//special chatarer used in placeholder. try not to edit any palce with " About me"
	    } else {
	      var spanabout = <span title="Click to edit" id="span_about" onClick={this.aboutP}>{this.state.aboutMe}</span>;
	    }

      const topbart = (
        <div id="usertopbar">
          <div id="topbar_avatar"><img src={this.state.avatar}/></div> <h5 onClick={this._ProfileEdit}> {this.state.username}</h5>
					{spanabout}
  				<input type="text" id="topbar_aboutme" onChange={this.editAboutMe} onBlur={this.updateAboutMe}  onKeyPress={this.extendaboutme} />
					<a href="#" title="Logout" onClick={this._Logout} id="logout">🔐</a>
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
	_Friends(){
		ReactDOM.render(
				<Friends />,
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

	_Profile(){
		ReactDOM.render(
			<Profile />,
			document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
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
		electron.remote.getGlobal('sharedObject').avatar=null;
		electron.remote.getGlobal('sharedObject').data=null;
		//console.log(electron.remote.getGlobal('sharedObject'));

		ipc.sendSync('loggedOut')
		ReactDOM.render(
		  <Login />,
		  document.getElementById('main-content')
		);
	}
});
