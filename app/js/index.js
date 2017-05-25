const ReactDOM = require('react-dom')
const React = require('react')
const injectTapEventPlugin = require('react-tap-event-plugin')
const $ = require('jquery')
const _ = require('lodash')
const moment = require('moment')
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin.js')
const ReactGridLayout = require('react-grid-layout');
const os = require('os');
//const {systemPreferences} = require('electron')

global.jquery = $
window.React = React
window.ReactDOM = ReactDOM
window.injectTapEventPlugin = injectTapEventPlugin
window.$ = $
window.jquery = $
window._ = _
window.moment = moment
window.PureRenderMixin = PureRenderMixin
window.ReactGridLayout = ReactGridLayout
window.os = os
global.api_server = "http://gamempire.net";
//global.api_server = "http://localhost:8080";

global.Login = require('./components/Login.js')
global.Registration = require('./components/Registration.js')
global.SideBar = require('./components/SideBar.js')
global.Dashboard = require('./components/Dashboard.js')
global.ProfileEdit = require('./components/ProfileEdit.js')
global.Profile = require('./components/Profile.js')
global.Friends = require('./components/Friends.js')
global.HSDeckBuilder = require('./components/HSDeckBuilder.js')
global.Soundcloud = require('./components/Soundcloud.js')
global.Notepad = require('./components/Notepad.js')
global.GDQ = require('./components/GDQ.js')

injectTapEventPlugin();

global.primaryElements = [
  ".button",
  "::selection",
  "react-grid-item:hover",
  ".react-grid-item:hover h2",
  ".sidenav .active",
  ".react-grid-placeholder",
  ".validationError",
  ".custom-file-upload"
];
global.backgroundElements = [
  "body",
  "html",
  ".react-grid-item",
  ".react-grid-item h2",
  ".overlay",
  "table tbody",
  "table tfoot",
  "table thead"
];
global.secondaryElements = [
  ".secondary",
  "table thead",
  ".widgetTitle",
  "#top_bar",
  ".sidenav",
  "input"
];

ReactDOM.render(
  <Login />,
  document.getElementById('main-content')
);
