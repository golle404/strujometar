'use strict';

var React = require("react");
var calc = require("..//modules/strujometar.js");
var actions = require("../actions/formActions.js");
var nf = require("number-format.js");

var mask = "#,###.00";

module.exports=React.createClass({
	displayName: 'EntryItem',
	openEntry: function(){
		actions.openEntry(this.props.id);
	},
	render: function(){
		var data = this.props.data
		var entryDet = <div className="entry-det">
							<div className="entry-kwh">
								<div className="lbl">Utrošeno: </div>
								<div className="val">{data.totalKw}</div>
							</div>
							<div className="entry-din">
								<div className="lbl">Zaduženje: </div>
								<div className="val">{nf(mask,data.zzop)}</div>
							</div>
						</div>
		if(data.error){
			entryDet = <div className="init-entry">Početni Unos</div>
		}
		return(
			<li className="entry-item" onClick={this.openEntry}>
				<div className="entry-period">{data.period}</div>
				{entryDet}
			</li>
		);
	}
})
