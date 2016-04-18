'use strict';

var React = require("react");
var actions = require('../actions/actions.js');

import AppBar from 'material-ui/lib/app-bar';

module.exports=React.createClass({
	displayName: 'Header',
	toggleSidebar: function(){
		actions.toggleSidebar();
	},
	render: function(){
		return(
			<header>
				<AppBar
					title="Strujometar"
					showMenuIconButton={this.props.open}
					onLeftIconButtonTouchTap={this.toggleSidebar} />
			</header>
		);
	}
})