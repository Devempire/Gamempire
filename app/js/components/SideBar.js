module.exports = global.Bar = React.createClass({

	render() {
		return (
			<b>
			    <div id="mySidenav" className="sidenav">
						<a href="#" id="1">Profile</a>
						<a href="#" id="2">Gaming Tools</a>
						<a href="#" id="3">Video Streams</a>
						<a href="#" id="4">Tips & Tricks</a>
						<a href="#" id="5">Guides</a>
						<a href="#" id="6">Esports</a>
						<a href="#" id="7">Chat </a>
						<a href="#" id="8">Logout </a>
						<a id="8" >+</a>
						<div className="toggleNav" onClick={toggleNav}></div>
			    </div>
					<div id="content">
              <div id="main_content"></div>
		    	</div>
			</b>

		);
	}

});
