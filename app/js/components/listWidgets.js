module.exports = global.listWidgets = React.createClass({
    Soundcloud() {
       return {
         __html: "<webview className='widget' src='https://soundcloud.com/charts/top'></webview>"
       };
    },

    render() {
    }
});
