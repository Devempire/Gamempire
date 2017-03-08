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
                      console.log("aboutme fail to update to server!")
                    });


  },

	getInitialState() {
		var username = electron.remote.getGlobal('sharedObject').username;
		var aboutme =electron.remote.getGlobal('sharedObject').aboutme;
		var id =electron.remote.getGlobal('sharedObject').id;
		return {
			id:id,
			username:username,
			aboutMe:aboutme,
		};

	},


      componentDidMount: function(){
      //  ReactDOM.render(
      //    <Dashboard />,
        //  document.getElementById('content')
      //  );
      //  console.log("Dashbaord loading...");
      },



	render() {

		return <div>
		    <div id="mySidenav" className="sidenav noselect">
					<a href="#"onClick={this._ProfileEdit} id="_ProfileEdit"><b>{this.state.username}</b></a>
					<input type="text" placeholder="About Me" value={this.state.aboutMe} onChange={this.editAboutMe} onBlur={this.updateAboutMe}/>
					<a href="#" onClick={this._Dashboard} id="_Dashboard">Dashboard</a>
	{/*
					<a href="#" onClick={this._Playground} id="_Playground">Playground [Buggy]</a>
					<a id="8" >Add custom page</a>
	*/}

					<a href="#" id="_Logout" onClick={this._Logout}>Logout </a>
					<div className="toggleNav" onClick={this.toggleNav}></div>
				</div>
        <div id="top_bar"></div>
				<div id="content">
          <div id="main_content"><Dashboard /></div>
	    	</div>

				<div className="discordFrame hearthstone_scroll" id="playgroundFrame">
				</div>

		</div>;
    const topbart = (
      <div>
        <h1>Hello, {this.state.username}</h1>
        <input type="text" value={this.state.aboutMe}  onChange={this.editAboutMe} onBlur={this.updateAboutMe} />
      </div>
    );
    ReactDOM.render(
      topbart,
      document.getElementById('top_bar')
    );

    this._Dashboard();

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
		ipc.sendSync('quicksize');
	},


        topbar(){
          const topbart = (
            <div>
              <h1>Hello, {this.state.username}</h1>
              <input type="text" value={this.state.aboutMe}  onChange={this.editAboutMe} onBlur={this.updateAboutMe} />
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
