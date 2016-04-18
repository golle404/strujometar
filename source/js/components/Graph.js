'use strict';

var React = require("react");
var ReactFauxDOM = require("react-faux-dom");
var d3 = require("d3");

module.exports = React.createClass({
	displayName: 'Graph',
	getInitialState: function() {
		var gw = 800;
		var gh = 480;
		var margin = {
			top: 20,
			left: 40,
			bottom: 60,
			right: 45
		}
		var gBox = {
			left: margin.left,
			top: margin.top,
			right: gw - margin.right,
			bottom: gh - margin.bottom,
			width: gw - margin.left - margin.right,
			height: gh - margin.top - margin.bottom
		}
		return {gBox: gBox, gw: gw, gh: gh};
	},
	render: function() {
		// shothend translate
		function translate(x, y) {
		  return "translate(" + x + "," + y + ")";
		}

		var data = this.props.data;
		var num = data.length;
		var tooltip = this.props.tooltip;
		if (data[num - 1].error) {
			data.pop()
			num--;
		}
		var gBox = this.state.gBox;
		var width= this.state.gw;
		var height= this.state.gh;
		/////////  scales  /////////////
		var xScale = d3.scale.ordinal()
			.rangeRoundBands([0, gBox.width], .1)
			.domain(data.map(function(d){
				return d.periodShort
			}))

		var yScaleKWh = d3.scale.linear()
			.range([0, gBox.height])
			.domain([0, d3.max(data, function(d){
				return d.totalKw 
			})])

		var yScaleRSD = d3.scale.linear()
			.range([gBox.height, 0])
			.domain([0, d3.max(data, function(d){
				return d.zzop 
			})])		

		/////////// axis   //////////////
 		var xAxis = d3.svg.axis()
		.scale(xScale)
		.tickFormat(function(d) {
		  return d
		});
		//reverse kwh scale
		var yAxisScale = d3.scale.linear()
			.range([0, gBox.height])
			.domain([d3.max(data, function(d){
				return d.totalKw 
			}),0])

		var yAxisKWH = d3.svg.axis()
		.scale(yAxisScale)
		.tickFormat(function(d) {
		  return d
		})
		.orient("left");

		var yAxisRSD = d3.svg.axis()
		.scale(yScaleRSD)
		.tickFormat(function(d) {
		  return d
		})
		.orient("right");

		/////////  svg node   ///////////////////
		var node = ReactFauxDOM.createElement('svg')
		var svg = d3.select(node)
			.attr({width: width})
			.attr({viewBox: "0 0 " + width + " " + height})
		
		var graphArrea = svg.append("g")
		    .attr("transform", translate(gBox.left, gBox.top));

		//////// append axisis ////////////////////
		graphArrea.append("g")
		.attr("transform", translate(0, gBox.height))
		.call(xAxis)
		.attr({class: "axis-x", textAnchor: "middle"})
		//////////////////////////
		graphArrea.append("g")
		.call(yAxisKWH)
		.attr({class: "axis-y", textAnchor: "middle"})
		.append("text")
		.text("kWh")
		.attr("transform", translate(-9, gBox.height))
		.attr({"dy": ".32em", textAnchor: "end"})


		graphArrea.append("g")
		.call(yAxisRSD)
		.attr("transform", translate(gBox.width, 0))
		.attr({class: "axis-line", textAnchor: "middle"})
		.append("text")
		.text("din")
		.attr("transform", translate(9, gBox.height))
		.attr({"dy": ".32em", textAnchor: "start"})
		/////  append groups that will hold bars  /////////////
		var period = graphArrea.selectAll(".period")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d){
				var tx = xScale(d.periodShort)
				var ty = gBox.height - yScaleKWh(d.totalKw)
				return "translate(" + [tx,ty] + ")";
			})
		//////  append bars for each group  //////////
		period.selectAll("rect")
			.data(function(d){
				return [
					{y: 0, h: d.totalNt, cl: "nt", p: d.periodShort, t:d.totalKw},
					{y: d.totalNt, h: d.totalVt, cl: "vt", p: d.periodShort, t:d.totalKw}]
			})
			.enter()
			.append("rect")
			.attr({
			  x: 0,
			  y: function(d) {
			    return yScaleKWh(d.y);
			  },
			  width: xScale.rangeBand(),
			  height: function(d) {
			    return yScaleKWh(d.h);
			  },
			  class: function(d) {
			    return "bar " +d.cl;
			  }
			})
			.on("mouseover", function(d){
				var left = xScale.rangeBand()*.5 + gBox.left + xScale(d.p)
				var top = gBox.height - yScaleKWh(d.t) + this.props.y + 50;
				tooltip(d3.format(",.2r")(d.h) + "kWh", left, top)
			})
			.on("mouseout", function(){
				tooltip(null)
			})
		/////// create line path  //////////////
		var line = d3.svg.line()
			.x(function(d){
				return xScale.rangeBand()*.5 + xScale(d.periodShort);
			})
			.y(function(d){
				return yScaleRSD(d.zzop)
			})
		//////// append path  /////////////////
		graphArrea.append("path")
			.datum(data)
			.attr("d", line)
			.attr("class", "money-line")
		//////// append path circles   ////////////
		graphArrea.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d){
				return xScale.rangeBand()*.5 + xScale(d.periodShort);
			})
			.attr("cy", function(d){
				return yScaleRSD(d.zzop)	
			})
			.attr("r", 6)
			.attr("class", "line-point")
			.on("mouseover", function(d){
				var left = gBox.left + this.props.cx
				var top = gBox.top + this.props.cy
				tooltip(d3.format(",.2f")(d.zzop) + "din", left, top)
			})
			.on("mouseout", function(){
				tooltip(null)
			})

		var legData = [
			{kl: "bar nt", name: "niža tarifa kWh", type: "rect"},
			{kl: "bar vt", name: "viša tarifa kWh", type: "rect"},
			{kl: "line-point", name: "ukupno zaduženje din", type: "circle"}
		]

		var legend = svg.append("g")
			.attr("class", "legend")
			.attr("transform", translate(gBox.left, gBox.bottom + 30));

		legend.selectAll(".legend")
			.data(legData)
			.enter()
			.append("g")
			.attr("transform", function(d,i){
				return "translate("+ 150*i + " 20)"
			})
			.attr("class", function(d){return "leg leg-" + d.type})
			.append("text")
			.text(function(d){return d.name})
			.attr({x: 20, dy: -4})

		legend.selectAll(".leg-rect")
			.append("rect")
			.attr({width: 16, height: 16, y: -16})
			.attr("class", function(d){
				return d.kl;
			});

		legend.selectAll(".leg-circle")
			.append("circle")
			.attr({r: 8, cx: 8, cy: -8})
			.attr("class", function(d){
				return d.kl;
			});
		//////////  render to react   //////////////
		return node.toReact();
	}
})