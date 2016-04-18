'use strict';

var React = require("react");
var FilterCtrl = require("./FilterCtrl.js");
var Graph = require("./Graph.js");
var GraphTooltip = require("./GraphTooltip.js");

import GraphIcon from 'material-ui/lib/svg-icons/av/equalizer';

module.exports=React.createClass({
	displayName: 'GraphView',
	getInitialState: function(){
		this.store = require("../stores/appStore.js");
		return {data: this.store.getLatestData(),
				currentFilter: -1,
				tooltip: "",
				tooltipPos: {left: 0, top:0},
				tooltipClass: "tooltip hidden"}
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
	setTooltip: function(tip, left, top){
		var bb = this.refs.graf.getBoundingClientRect();
		top *= bb.height/480
		left *= bb.width/800
		if(tip){
			this.setState({
				tooltipPos: {left: left+"px", top: top+"px"},
				tooltipClass: "tooltip",
				tooltip: tip})
		}else{
			this.setState({tooltipClass: "tooltip hidden"})
		}
	},
	render: function(){
		return(
			<div className="graph-view">
				<FilterCtrl
					title="Grafikon Potrošnje"
					icon={GraphIcon}
					activeIndex={this.state.currentFilter}
					filterAll={this.filterAll}
					filterLatest={this.filterLatest}
					filterYear={this.filterYear} />
				<div className="graph-container" ref="graf">
					<GraphTooltip 
						klass={this.state.tooltipClass}
						pos={this.state.tooltipPos}
						tip={this.state.tooltip} /> 
					<Graph 
						data={this.state.data}
						tooltip={this.setTooltip}/>
				</div>
			</div>
		);
	}
})
