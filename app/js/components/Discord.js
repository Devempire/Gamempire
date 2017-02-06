module.exports = global.Discord = React.createClass({

	render() {
    var title = "Discord - Gamempire"
    document.title = title
    document.getElementById('title').textContent = title
    $("#mySidenav>a.active").removeClass("active");
    $( "#_Discord" ).addClass('active');
		return <div className="discordFrame">
      <script>
      ipcRenderer.send('disable-x-frame', webview.partition);
      </script>

			<webview className="discordFrame" id="discordFrame" src="https://discordapp.com/login"></webview>
    </div>;
	}

});
