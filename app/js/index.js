const ReactDOM = require('react-dom')
const React = require('react')
const injectTapEventPlugin = require('react-tap-event-plugin')
const $ = require('jquery')
const _ = require('lodash')
const moment = require('moment')
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin.js')

window.React = React
window.ReactDOM = ReactDOM
window.injectTapEventPlugin = injectTapEventPlugin
window.$ = $
window.jquery = $
window._ = _
window.moment = moment
window.PureRenderMixin = PureRenderMixin
global.api_server = "http://gamempire.net";


global.Login = require('./components/Login.js')
global.Registration = require('./components/Registration.js')
global.Dashboard = require('./components/Dashboard.js')
global.ProfileEdit = require('./components/ProfileEdit.js')
global.Discord = require('./components/Discord.js')
global.SideBar = require('./components/SideBar.js')
//let Index = require('./components/index.js')
injectTapEventPlugin();

ReactDOM.render(
  <Login />,
  document.getElementById('main-content')
);
