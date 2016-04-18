'use strict';

var React = require("react");

module.exports=React.createClass({
	displayName: 'GraphTooltip',
	render: function(){
		return(
			<div className={this.props.klass} style={this.props.pos}>
				<div className="tooltip-wrap">{this.props.tip}</div>
			</div>
		);
	}
})
