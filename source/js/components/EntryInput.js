'use strict';

var React = require("react");

var actions = require("../actions/actions.js");
var calcMod = require("../modules/strujometar.js");
var clone = require("clone");
var nf = require("number-format.js");
var mask = "#,###.00";

var InputForm = require('../components/InputForm.js');
var InputCalc = require('../components/InputCalc.js');
var InputCtrl = require('../components/InputCtrl.js');

module.exports = React.createClass({
	displayName: 'EntryInput',
	getInitialState: function(){
		this.store = require("../stores/appStore.js");
		var data = this.store.getCurrent();
		var entry = data.current;
		var prev = data.prev;
		var calc = calcMod(entry, prev)
		var isDiscount = Boolean(entry.ozp) || false;
		var ctrlMode = this.store.isNewEntry() ? "new" : "preview";
		return {
			entry: entry,
			prev: prev, 
			calc: calc, 
			isDiscount: isDiscount,
			ctrlMode: ctrlMode};
	},
	onSave: function(){
		actions.saveEntry(this.state.entry);
	},
	onDelete: function(){
		actions.deleteEntry(this.state.entry);
	},
	onEdit: function(){
		this.setState({ctrlMode: "edit"});
	},
	onClose: function(){
		if(this.state.ctrlMode === "edit"){
			this.resetEntry();	
		}else{
			actions.closeEntry();
		}
	},
	resetEntry: function(){
		var data = this.store.getCurrent();
		var entry = data.current;
		var prev = data.prev;
		var calc = calcMod(entry, prev)
		var isDiscount = Boolean(entry.ozp) || false;
		var ctrlMode = this.store.isNewEntry() ? "new" : "preview";
		this.setState({
			entry: entry,
			prev: prev, 
			calc: calc, 
			isDiscount: isDiscount,
			ctrlMode: ctrlMode});
	},
	inputChange: function(e){
		var entry = clone(this.state.entry);
		entry[e.target.name] = e.target.value
		var calc = calcMod(entry, this.state.prev)
		this.setState({entry: entry, calc: calc})
	},
	inputDisChange: function(e){
		var entry = clone(this.state.entry);
		entry[e.target.name] = e.target.value
		this.setState({entry: entry})
	},
	dateChange: function(e, d){
		var entry = clone(this.state.entry);
		entry.date = d;
		var prev = this.store.getPrev(new Date(d).valueOf());
		var calc = calcMod(entry, prev)
		this.setState({entry: entry, calc: calc, prev: prev})
	},
	toggleDiscount: function(){
		var isDiscount = !this.state.isDiscount;
		var entry = clone(this.state.entry);
		if(isDiscount){
			entry.ozp = this.state.calc.zzElEn;
		}else{
			entry.ozp = 0;
		}
		this.setState({entry:entry, isDiscount: isDiscount})
	},
	render: function(){
		var calcChild = <InputCalc
					calc={this.state.calc} 
					entry={this.state.entry}/>;
		if(this.state.calc.error){
			calcChild = <div className="input-calc">
				{this.state.calc.error}</div>;
		}
		return(
			<div className="entry-input">
				<InputCtrl 
					onSave={this.onSave}
					onDelete={this.onDelete}
					onClose={this.onClose}
					onEdit={this.onEdit}
					mode={this.state.ctrlMode} />
				<div className="form-wrap">
					<h2>Stanje na brojilu</h2>
					<InputForm 
						mode={this.state.ctrlMode}
						entry={this.state.entry} 
						onChange={this.inputChange} 
						onDateChange={this.dateChange}
						onToggleDiscount={this.toggleDiscount}
						onDiscChange={this.inputDisChange}
						isDiscount={this.state.isDiscount} />
				</div>
				<div className="calc-wrap">
					<h2>Obračun za period: {this.state.calc.period}</h2>
					{calcChild}
				</div>
			</div>
		);
	}
})