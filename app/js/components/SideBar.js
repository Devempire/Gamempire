module.exports = global.Bar = React.createClass({

	render() {
		return (
		    <div id="titleBar">
		    	<div id="titleicon" class="titleicon"></div>
		    	<span id="title" class="title">Gamempire</span>
		        <div id="title-bar-btns">
		            <button id="min-btn" title="Minimize"></button>
		            <button id="max-btn" title="Maximize"></button>
		            <button id="close-btn" title="Close"></button>
		        </div>

			    <div id="mySidenav" class="sidenav">
					<a href="main.html" id="1">Profile</a>
					<a href="gametool.html" id="2">Gaming Tools</a>
					<a href="video.html" id="3">Video Streams</a>
					<a href="javascript:void(0)" id="4">Tips & Tricks</a>
					<a href="guide.html" id="5">Guides</a>
					<a href="esports.html" id="6">Esports</a>
					<a href="chat.html" id="7">Chat </a>
					<a href="../index.html" id="8">Logout </a>
					<a id="8" onclick="addtab()">+</a>
					<div class="toggleNav" onclick="toggleNav()"></div>
			    </div>

			    <div id="content">
			        <div id="main_content">
			        </div>
			    </div>
		    </div>
		);
	}
});