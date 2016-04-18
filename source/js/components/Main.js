'use strict';

var React = require("react");
var Content = require('./Content');

module.exports=React.createClass({
	displayName: 'Main',
	render: function(){
		return(
			<div className='main'>
				<Content view={this.props.view}/>
			</div>
		);
	}
})
