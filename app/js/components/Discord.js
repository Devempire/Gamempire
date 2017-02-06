module.exports = global.Discord = React.createClass({

	render() {
		return <div className="discordFrame">
      <script>
      ipcRenderer.send('disable-x-frame', webview.partition);
      </script>
			<webview className="discordFrame" src="https://discordapp.com/login"></webview>
    </div>;

	}
});
