"use strict"

var React = require("react");
var ReactDOM = require("react-dom");
var App = require("./components/App.js");
var AppStore = require("./stores/appStore.js");

AppStore.init(function(){
	ReactDOM.render(<App />, document.getElementById('app'));
})
