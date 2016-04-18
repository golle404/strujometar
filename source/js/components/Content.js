'use strict';

var React = require("react");

module.exports=React.createClass({
	displayName: 'Content',
	render: function(){		
		return(
			<div className='content'>
				<this.props.view />
			</div>
		);
	}
})
