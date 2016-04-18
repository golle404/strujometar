'use strict';

var React = require("react");
var FilterCtrl = require("./FilterCtrl.js");
var actions = require("../actions/actions.js");

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import OpenIcon from 'material-ui/lib/svg-icons/action/open-in-browser';
import ListIcon from 'material-ui/lib/svg-icons/action/view-list';

var nf = require("number-format.js");
var mask = "#,###.00";

module.exports = React.createClass({
	displayName: 'EntryList',
	getInitialState: function(){
		this.store = require("../stores/appStore.js");
		return {data: this.store.getLatestData(),
				currentFilter: -1}
	},
	filterLatest: function(){
		return this.setState({
			data: this.store.getLatestData(),
			currentFilter: -1});
	},
	filterAll: function(){
		return this.setState({
			data: this.store.getCalcData(),
			currentFilter: 0});
	},
	filterYear: function(y){
		return this.setState({
			data: this.store.getDataByYear(y),
			currentFilter: y});
	},
	openEntry: function(id){
		actions.openEntry(id);
	},
	generateItems: function(items){
		var openEntry = this.openEntry;
		return items.map(function(v,i,a){
			return (
				<ListItem
					leftIcon={<OpenIcon />}
					insetChildren={true}
					className="list-item"
					onTouchTap = {openEntry.bind(null, i)}
					secondaryTextLines = {2}
					key = {i} 
					id={i}
					primaryText={v.period} 
					secondaryText={
						<div>
							<div>Ukupna potrošnja: {v.totalKw} kWh</div>
							<div>Ukupno zaduženje: {nf(mask,v.zzop)} din</div>
						</div>
					} />
			)
		})
	},
	render: function(){
		return(
			<div className="entry-list">
				<FilterCtrl
				title="Lista Obračuna"
				icon={ListIcon}
				activeIndex={this.state.currentFilter}
				filterAll={this.filterAll}
				filterLatest={this.filterLatest}
				filterYear={this.filterYear} />
				<List>
		    		{this.generateItems(this.state.data)}
		  		</List>
	  		</div>
		);
	}	
})