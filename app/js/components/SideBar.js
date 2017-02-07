module.exports = global.Bar = React.createClass({

	render() {
		return <div>
		    <div id="mySidenav" className="sidenav">
				<a href="#" onClick={this._Dashboard} id="_Dashboard">Dashbaord</a>
				<a href="#" onClick={this._ProfileEdit} id="_ProfileEdit">Edit Profile</a>
				<a href="#" onClick={this._HSDeckBuilder} id="_HSDeckBuilder">Hearthstone Deck Builder</a>
				<a href="#" onClick={this._Discord} id="_Discord">Discord</a>

				{	
				/* NOT WORKING YET
				<a href="#" id="3">Video Streams</a>
				<a href="#" id="4">Tips & Tricks</a>
				<a href="#" id="5">Guides</a>
				<a href="#" id="6">Esports</a>
				<a href="#" id="7">Chat </a>-->
				<a id="8" >+</a>
				*/
				}

				<a href="#" id="_Logout" onClick={this._Logout}>Logout </a>
				<div className="toggleNav" onClick={this.toggleNav}></div>
		    </div>
			<div id="content">
          		<div id="main_content"></div>
	    	</div>
			<div className="discordFrame" id="discordFrame">
				<script>
			    	ipcRenderer.send('disable-x-frame', webview.partition);
			    </script>
				<webview className="discordFrame" src="https://discordapp.com/login"></webview>
			</div>
		</div>;
	},

	toggleNav(){
		$("#mySidenav, #content, #discordFrame").toggleClass("navOpen");
		if ( $("#mySidenav").hasClass("navOpen") ) {
				//do something it does have the protected class!
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_in.png'), auto"});
		}else{
				$(".toggleNav").css({"cursor":"url('../app/img/arrow_out.png'), auto"});
		}
	},

	_Dashboard(){
		ReactDOM.render(
		  	<Dashboard />,
		  	document.getElementById('content')
		);
		document.getElementById('discordFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_ProfileEdit(){
		ReactDOM.render(
			<ProfileEdit />,
			document.getElementById('content')
		);
		document.getElementById('discordFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_HSDeckBuilder(){
		ReactDOM.render(
			<HSDeckBuilder />,
			document.getElementById('content')
		);
		document.getElementById('discordFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
	},

	_Discord(){
		document.getElementById('content').style.visibility = "hidden";
		document.getElementById('discordFrame').style.visibility = "visible";
		var title = "Discord - Gamempire"
		document.title = title
		document.getElementById('title').textContent = title
		$("#mySidenav>a.active").removeClass("active");
		$( "#_Discord" ).addClass('active');
	},

	_Logout(){
		ipc.sendSync('loggedOut')
		ReactDOM.render(
		  <Login />,
		  document.getElementById('main-content')
		);
	}
});
