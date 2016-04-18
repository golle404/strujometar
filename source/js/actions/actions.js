'use strict';

var AppDispatcher = require('../dispatcher/appDispatcher.js');

module.exports = {
	saveEntry: function(payload){
		AppDispatcher.dispatch({
			actionType: "SAVE_ENTRY",
			payload: payload
		});
	},
	deleteEntry: function(payload){
		AppDispatcher.dispatch({
			actionType: "DELETE_ENTRY",
			payload: payload
		});
	},
	saveSettings: function(payload){
		AppDispatcher.dispatch({
			actionType: "SAVE_SETTINGS",
			payload: payload
		});
	},
	openEntry: function(payload){
		AppDispatcher.dispatch({
			actionType: "OPEN_ENTRY",
			payload: payload
		});	
	},
	closeEntry: function(){
		AppDispatcher.dispatch({
	  		actionType: "CLOSE_ENTRY"
		});
	},
	openView: function(view){
		AppDispatcher.dispatch({
	  		actionType: "OPEN_VIEW",
	  		payload: view
		});
	},
	toggleSidebar: function(){
		AppDispatcher.dispatch({
	  		actionType: "TOGGLE_SIDEBAR"
		});
	}
};