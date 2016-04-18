'use strict';

var React = require("react");
var InputCtrl = require('../components/InputCtrl.js');

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';

var actions = require("../actions/actions.js");

module.exports=React.createClass({
	displayName: 'SettingsView',
	getInitialState: function(){
		this.store = require("../stores/appStore.js");
		var data = this.store.getSettings();
		var ctrlMode = data.brType ? "preview" : "new";
		return {
			brType: data.brType,
			obrSnaga: data.obrSnaga,
			ctrlMode: ctrlMode};
	},
	onSave: function(){
		actions.saveSettings({
			brType: this.state.brType,
			obrSnaga: this.state.obrSnaga
		});
	},
	onDelete: function(){
		//actions.deleteEntry(this.state.entry);
	},
	onEdit: function(){
		this.setState({ctrlMode: "new"});
	},
	onClose: function(){
		if(this.state.ctrlMode === "new"){
			this.resetEntry();	
		}else{
			actions.closeEntry();
		}
	},
	resetEntry: function(){
		this.store = require("../stores/appStore.js");
		var data = this.store.getSettings();
		var ctrlMode = data.brType ? "preview" : "new";
		this.setState({
			brType: data.brType,
			obrSnaga: data.obrSnaga,
			ctrlMode: ctrlMode});
	},
	brTypeChange: function(e, i, v){
		this.setState({brType: v});
	},
	obrSnaChange: function(e){
		this.setState({obrSnaga: e.target.value,});
	},
	render: function(){
		var btnStyle = {margin: ".5em"}
		var disabled = this.state.ctrlMode === "preview"
		return(
			<div className="settings-view">
				<InputCtrl 
					onSave={this.onSave}
					onDelete={this.onDelete}
					onClose={this.onClose}
					onEdit={this.onEdit}
					mode={this.state.ctrlMode} />
				<h2>Podešavanja</h2>
				<div className="settings-form">
					<SelectField
						onChange={this.brTypeChange}
						value={this.state.brType}
						floatingLabelText="Vrsta Brojila"
						disabled={disabled}
					>
						<MenuItem key={1} value={1} primaryText="Jednotarifno"/>
						<MenuItem key={2} value={2} primaryText="Dvotarifno"/>
					</SelectField>
					<TextField
						onChange={this.obrSnaChange}
						disabled={disabled}
						value={this.state.obrSnaga}
						hintText="Obračunska Snaga"
						floatingLabelText="Obračunska Snaga" />
				</div>
			</div>
		);
	}
})
