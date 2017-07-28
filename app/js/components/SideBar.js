var vex = require('vex-js')
vex.defaultOptions.className = 'vex-theme-os'

import Dashboard from './Dashboard.js';
//const Dashboard = require('./Dashboard.js');
//import {plusSlides} from './path'

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
			url:api_server+"/login/profile/updateaboutme",
			type:"PUT",
			contentType: 'application/json; charset=utf-8',
			data:JSON.stringify({
				_id:this.state.id,
				aboutme:this.state.aboutMe
			})
		}).done((res)=>{
        }).fail((err)=>{
          console.log("About Me could not be saved to the server.")
          vex.dialog.alert({
              message: 'About Me could not be saved to the server.',
              callback: function (value){
                  if (value) {
                    return;
                  }
              }.bind(this)
          })
        });
	},

	statusping(){
		if ($(".statusSelect").val()=='online'){
				$.ajax({
							url:api_server+"/login/pingstatus",
							type:"PUT",
							contentType: 'application/json; charset=utf-8',
							data:JSON.stringify({
										 _id:electron.remote.getGlobal('sharedObject').id,
										status:"online",
											})
										}).done((res)=>{
										});
		}
		setTimeout(this.statusping, 10000);
	},

	getInitialState() {
		var username = electron.remote.getGlobal('sharedObject').username;
		var aboutme = electron.remote.getGlobal('sharedObject').aboutme;
		var id = electron.remote.getGlobal('sharedObject').id;
		var avatar = electron.remote.getGlobal('sharedObject').avatar;
		//var widget = electron.remote.getGlobal('sharedObject').widget;

		if (avatar == false) {
			avatar = './../app/img/user.jpg';
		} else {
			avatar = api_server+'/img/avatars/'+id+'.jpg?' + new Date().getTime();
		}

		return {
			id:id,
			username:username,
			aboutMe:aboutme,
			avatar:avatar,
			hidden:false,
			//widgets:[],
			//widget:widget
		};
	},

    componentDidMount: function() {
    	this.topbar();
    	//this.loadWidgets();

		//go online
		this.setState({status:$(".statusSelect").val()}); //set online default on login first load.
		this.statusping();
    },

	render() {
		return <div className="noselect">
		    <div id="mySidenav" className="sidenav noselect">
				<a onClick={this._Dashboard} id="_Dashboard">Dashboard</a>
				<a onClick={this._Profile} id="_Profile">Profile</a>
          		<a onClick={this._ProfileEdit} id="_ProfileEdit">Edit Profile</a>
				<a onClick={this._Friends} id="_Friends">Friends</a>
				{/*
				<a href="#" onClick={this._Playground} id="_Playground">Playground [Buggy]</a>
				<a id="8" >Add custom page</a>
				*/}
				<a id="_Logout" onClick={this._LogoutConfirm}>Logout </a>
				<div className="toggleNav" onClick={this.toggleNav}></div>
			</div>

			<div id="content">
          		<div id="main_content"><Dashboard /></div>
	    	</div>

			<div className="discordFrame hearthstone_scroll" id="playgroundFrame"></div>
		</div>;

    	this._Dashboard();
    	this.callWidgets();
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
		} else {
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
				<select title="Change status" className="statusSelect" value={this.select} onChange={this.handleChange}>
					<option value="online" >Online</option>
					<option value="offline">Offline</option>
				</select>
	          	<div id="avatar">
	        		<img src={this.state.avatar}/>
				</div>
				<h5 className="topbar_username" title="Edit profile" onClick={this._ProfileEdit}> {this.state.username}</h5>
				{spanabout}
				<input type="text" id="topbar_aboutme" onChange={this.editAboutMe} onKeyPress={this.extendaboutme} />
				<input type="button" onClick={this.openRemote} id="remote" value="Remote"/>
				<a title="Logout" onClick={this._LogoutConfirm} id="logout">🔐</a>
	        </div>
	  	);

  		ReactDOM.render(
  			topbart,
  		document.getElementById('top_bar')
  		);
    },

 //    loadWidgets() {
	//     $.get(api_server+"/widget/show").done((res)=>{
	//         var i = res.length;
	//         while (i--) {
	//           var id = res[i]._id;
	//           for(var j=0; j<this.state.widget.length;j++){
	//           if (id ==this.state.widget[j].widgetid) {
	//             res.splice(i, 1);
	//           }
	//         }
	//       }
	//       for (var i = 0; i < res.length; i++) {
	//           this.setState({
	//             widgets: this.state.widgets.concat({
	//               value:res[i]._id,
	//               text:res[i].widgetname,
	//               widgettype:res[i].widgettype
	//             })
	//           });
	//       }
	//     }).fail((err)=>{
	//       console.log('Something is wrong with loading widgets.');
	//       vex.dialog.alert({
	//           message: 'Something is wrong with loading widgets.',
	//           callback: function (value){
	//               if (value) {
	//                 return;
	//               }
	//           }.bind(this)
	//       })
	//     });
	// },

    openRemote() {
    	var games = electron.remote.getGlobal('sharedObject').games;
    	//console.log(games);
    	//console.log(this.state.widgets);
    	//console.log(this.state.widget);
    	var widgetlist = document.createElement('div');
    	widgetlist.setAttribute('id', 'widgetlist');

		for (var i = 0; i < games.length; i++) {
    		var label = document.createElement('label');
    		var widget_name = document.createTextNode(games[i].widgetname);
    		label.appendChild(widget_name);
    		widgetlist.appendChild(label);

    		var input = document.createElement('input');
    		input.setAttribute('type', 'checkbox');
    		input.setAttribute('id', games[i].i);
    		input.addEventListener('click', this.hideWidget);
    		//console.log(games[i].hidden);

    		$.get(api_server+"/widget/find/" + games[i].i + "/info").done((res)=>{
    			console.log(res);
		        //hidden = res.hidden;
		    }).fail((err)=>{
		      console.log('Something is wrong with loading the widget.');
		      vex.dialog.alert({
		          message: 'Something is wrong with loading the widget.',
		          callback: function (value){
		              if (value) {
		                return;
		              }
		          }.bind(this)
		      })
		    });

		    //console.log(hidden);

    		if (games[i].hidden == false || games[i].hidden == "false") {
    			input.setAttribute('checked', 'checked');
    		}
    		
    		widgetlist.appendChild(input);

    		var br = document.createElement('br');
    		widgetlist.appendChild(br);

			console.log(widgetlist);
    	}

		vex.dialog.open({
	        overlayClosesOnClick: true,
	        unsafeMessage: widgetlist,
	        callback: function (value){
	            if (value) {
	              	return;
	            } else {
	            	return;
	            }
	        }.bind(this)
	    })
    },

    hideWidget() {
    	var widget = document.getElementById(event.target.id);
    	var games = electron.remote.getGlobal('sharedObject').games;
    	console.log(widget);
    	console.log(games[0].i);
    	console.log(event.target.id);

    	//console.log(widget.getAttribute('style'));
    	//console.log(widget.getAttribute('hidden'));
    	if (widget.getAttribute('hidden') == null) {
    		widget.setAttribute('hidden', true);
    		this.setState({hidden: true});
    		// for (var i = 0; i < games.length; i++) {
    		// 	if (games[i].i == event.target.id) {
    		// 		console.log('hi');
    		// 		games[i].hidden = true;
    		// 		console.log(games[i].hidden);
    		// 	}
    		// }
    	} else {
    		widget.removeAttribute('hidden');
    		this.setState({hidden: false});
    		// for (var i = 0; i < games.length; i++) {
    		// 	if (games[i].i == event.target.id) {
    		// 		console.log('hey');
    		// 		games[i].hidden = false;
    		// 		console.log(games[i].hidden);
    		// 	}
    		// }
    	}
    	
       	$.ajax({
            url:api_server+"/login/profile/updatewidget",
            type:"PUT",
            data:{
	            _id:this.state.id,
	            widgetid:event.target.id,
	            hidden:this.state.hidden
            }
        }).done((res)=>{
            console.log("widget visibility is updated");
        }).fail((err)=>{
            console.log("Widget Visibility is not updated in the server.");
            vex.dialog.alert({
                message: "Widget Visibility is not updated in the server.",
                callback: function (value){
                    if (value) {
                      	return;
                    }
                }.bind(this)
            })
        });
    },

    handleChange(event) {
	    var status = event.target.value;
		$(".statusSelect").css('background', 'url("../app/img/' + status + '.ico")  97% / 17% no-repeat #eee');

	    vex.dialog.confirm({
	        overlayClosesOnClick: false,
	        message: 'Are you sure you want to go '+status+ ' to others?',
	        callback: function (value){
	            if (value) {
	              	this.setState({
         			 select: status,
         				});
								this.setState({status:status});
         				this.updatestatus();
	            } else {
								$(".statusSelect").css('background', 'url("../app/img/' + this.state.status + '.ico")  97% / 17% no-repeat #eee');
								$(".statusSelect").val(this.state.status);
	            	return;
	            }
	        }.bind(this)
	    })
  	},

  	updatestatus(){
	  	$.ajax({
			url:api_server+"/login/pingstatus",
			type:"PUT",
			contentType: 'application/json; charset=utf-8',
			data:JSON.stringify({
				_id:electron.remote.getGlobal('sharedObject').id,
	 			status:this.state.select,
	     	})
	 	}).done((res)=>{
	 	});
    },

	_Dashboard(){
		ReactDOM.render(
		  	<Dashboard />,
	  		document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
		$("#mySidenav>a").css("background-color", "");
	},

	_Friends(){
		ReactDOM.render(
			<Friends />,
			document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
		$("#mySidenav>a").css("background-color", "");
	},

	_ProfileEdit(){
		ReactDOM.render(
			<ProfileEdit />,
			document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
		$("#mySidenav>a").css("background-color", "");
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
		electron.remote.getGlobal('sharedObject').viewProfileID = electron.remote.getGlobal('sharedObject').id;
		ReactDOM.render(
			<Profile />,
			document.getElementById('content')
		);
		document.getElementById('playgroundFrame').style.visibility = "hidden";
		document.getElementById('content').style.visibility = "visible";
		$("#mySidenav>a").css("background-color", "");
	},

	_LogoutConfirm(){
	    vex.dialog.confirm({
	        overlayClosesOnClick: false,
	        message: 'Are you sure you want to logout?',
	        callback: function (value){
	            if (value) {
	              	this._Logout();
	            } else {
	            	return;
	            }
	        }.bind(this)
	    })
	},

	_Logout(){
    $("#mySidenav, #top_bar, #content, #playgroundFrame").removeClass("navOpen");
		//console.log(electron.remote.getGlobal('sharedObject'));
		$.ajax({
            url:api_server+"/login/pingstatus",
            type:"PUT",
            contentType: 'application/json; charset=utf-8',
            data:JSON.stringify({
                _id:electron.remote.getGlobal('sharedObject').id,
                status:"offline",
            })
        }).done((res)=>{
        document.getElementById('top_bar').innerHTML = "";
		electron.remote.getGlobal('sharedObject').username=null;
		electron.remote.getGlobal('sharedObject').aboutme=null;
		electron.remote.getGlobal('sharedObject').widget=null;
		electron.remote.getGlobal('sharedObject').token=null;
		electron.remote.getGlobal('sharedObject').id=null;
		electron.remote.getGlobal('sharedObject').layout=null;
		electron.remote.getGlobal('sharedObject').avatar=null;
		electron.remote.getGlobal('sharedObject').data=null;
		ipc.sendSync('loggedOut')
		ReactDOM.render(
		  <Login />,
		  document.getElementById('main-content')
		);

		}).fail((err)=>{
        	console.log("status failed to update to the server.")
        })
	}
});
