'use strict';

var AppDispatcher = require('../dispatcher/appDispatcher.js');

module.exports = {
	newEntry: function(){
		AppDispatcher.dispatch({
	  		actionType: "NEW_ENTRY"
		});
	},
	openList: function(){
		AppDispatcher.dispatch({
	  		actionType: "OPEN_LIST"
		});
	},
	openGraph: function(){
		AppDispatcher.dispatch({
	  		actionType: "OPEN_GRAPH"
		});
	},
	toggleSidebar: function(){
		AppDispatcher.dispatch({
	  		actionType: "TOGGLE_SIDEBAR"
		});
	}
};