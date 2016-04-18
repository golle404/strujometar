'use strict';

var React = require("react");

module.exports=React.createClass({
	displayName: 'CalcRow',
	render: function(){
		return(
			<div className={"row " + (this.props.klass || "")}>
				<div className="col col-desc">{this.props.desc}</div>
				<div className="col col-item lg-only">{this.props.amount}</div>
				<div className="col col-item lg-only">{this.props.price}</div>
				<div className="col col-item">{this.props.total}</div>
			</div>
		);
	}
})
